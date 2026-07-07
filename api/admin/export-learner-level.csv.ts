import { prisma } from '../_lib/prisma.js'
import { isAuthorizedAdminRequest } from '../_lib/auth.js'
import { buildLearnerLevelRows } from '../_lib/learnerLevelExport.js'
import { toCsv } from '../_lib/csv.js'
import { checkRateLimit } from '../_lib/rateLimit.js'
import {
  methodNotAllowed,
  safeErrorMessage,
  sendJson,
  sendText,
  type VercelRequestLike,
  type VercelResponseLike,
} from '../_lib/http.js'

export default async function handler(
  request: VercelRequestLike,
  response: VercelResponseLike,
) {
  if (!checkRateLimit(request, response)) return
  if (request.method === 'OPTIONS') {
    response.statusCode = 200
    response.end()
    return
  }
  if (request.method !== 'GET') return methodNotAllowed(response, 'GET')

  try {
    if (!isAuthorizedAdminRequest(request)) {
      return sendJson(response, 401, { ok: false, error: 'Unauthorized.' })
    }

    const [evaluations, attempts] = await Promise.all([
      prisma.evaluationSubmission.findMany({
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.quizAttempt.findMany({
        where: {
          source: 'course-evaluation',
        },
        orderBy: { submittedAt: 'desc' },
        include: {
          answers: true,
        },
      }),
    ])

    const { headers, rows } = buildLearnerLevelRows(evaluations, attempts)
    const csv = toCsv(headers, rows)

    response.setHeader(
      'Content-Disposition',
      'attachment; filename="brain-ai-101-learner-level.csv"',
    )
    return sendText(response, 200, csv, 'text/csv; charset=utf-8')
  } catch (error) {
    return sendJson(response, 500, {
      ok: false,
      error: safeErrorMessage(error, 'Unable to export learner-level CSV.'),
    })
  }
}
