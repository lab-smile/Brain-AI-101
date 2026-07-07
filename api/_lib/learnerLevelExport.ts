const HEADERS = [
  'Subject',
  'Pre_NeuronParts',
  'Pre_SignalFlow',
  'Pre_BioVsArtificial',
  'Pre_InputsWeightsActivation',
  'Pre_LearningFeedback',
  'Pre_InterestAI',
  'Post_NeuronParts',
  'Post_SignalFlow',
  'Post_BioVsArtificial',
  'Post_InputsWeightsActivation',
  'Post_LearningFeedback',
  'Post_InterestAI',
  'Q1',
  'Q2',
  'Q3',
  'Q4',
  'Q5',
  'Q6',
  'Q7',
  'Q8',
  'Q9',
  'Q10',
  'TotalScore',
] as const

const PRE_FIELD_MAP = [
  ['Pre_NeuronParts', 'likert-1'],
  ['Pre_SignalFlow', 'likert-2'],
  ['Pre_BioVsArtificial', 'likert-3'],
  ['Pre_InputsWeightsActivation', 'likert-4'],
  ['Pre_LearningFeedback', 'likert-5'],
  ['Pre_InterestAI', 'likert-6'],
] as const

const POST_FIELD_MAP = [
  ['Post_NeuronParts', 'likert-1'],
  ['Post_SignalFlow', 'likert-2'],
  ['Post_BioVsArtificial', 'likert-3'],
  ['Post_InputsWeightsActivation', 'likert-4'],
  ['Post_LearningFeedback', 'likert-5'],
  ['Post_InterestAI', 'likert-6'],
] as const

const QUESTION_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const

type Header = (typeof HEADERS)[number]

export interface LearnerLevelEvaluationRecord {
  sessionId: string
  source: 'pre_course' | 'post_course'
  submittedAt: Date
  likertResponses: Record<string, unknown>
}

export interface LearnerLevelQuizAnswerRecord {
  questionId: string
  isCorrect: boolean
}

export interface LearnerLevelQuizAttemptRecord {
  sessionId: string
  submittedAt: Date
  score: number
  answers: LearnerLevelQuizAnswerRecord[]
}

export type LearnerLevelRow = Record<Header, string | number>

function isLater(left: Date | null, right: Date | null) {
  if (!left) return false
  if (!right) return true
  return left.getTime() > right.getTime()
}

function toFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function formatMean(value: number) {
  return Number(value.toFixed(3)).toString()
}

export function buildLearnerLevelRows(
  evaluations: LearnerLevelEvaluationRecord[],
  attempts: LearnerLevelQuizAttemptRecord[],
) {
  const sessions = new Map<string, {
    pre: LearnerLevelEvaluationRecord | null
    preTimestamp: Date | null
    post: LearnerLevelEvaluationRecord | null
    postTimestamp: Date | null
    quiz: LearnerLevelQuizAttemptRecord | null
    quizTimestamp: Date | null
  }>()

  const ensureSession = (sessionId: string) => {
    const existing = sessions.get(sessionId)
    if (existing) {
      return existing
    }

    const created = {
      pre: null,
      preTimestamp: null,
      post: null,
      postTimestamp: null,
      quiz: null,
      quizTimestamp: null,
    }
    sessions.set(sessionId, created)
    return created
  }

  for (const evaluation of evaluations) {
    const session = ensureSession(evaluation.sessionId)

    if (evaluation.source === 'pre_course' && isLater(evaluation.submittedAt, session.preTimestamp)) {
      session.pre = evaluation
      session.preTimestamp = evaluation.submittedAt
    }

    if (evaluation.source === 'post_course' && isLater(evaluation.submittedAt, session.postTimestamp)) {
      session.post = evaluation
      session.postTimestamp = evaluation.submittedAt
    }
  }

  for (const attempt of attempts) {
    const session = ensureSession(attempt.sessionId)

    if (isLater(attempt.submittedAt, session.quizTimestamp)) {
      session.quiz = attempt
      session.quizTimestamp = attempt.submittedAt
    }
  }

  const subjectRows: LearnerLevelRow[] = Array.from(sessions.entries())
    .sort(([sessionIdA], [sessionIdB]) => sessionIdA.localeCompare(sessionIdB))
    .map(([sessionId, session]) => {
      const row: LearnerLevelRow = Object.fromEntries(
        HEADERS.map((header) => [header, '']),
      ) as LearnerLevelRow

      row.Subject = sessionId

      for (const [column, likertId] of PRE_FIELD_MAP) {
        const value = toFiniteNumber(session.pre?.likertResponses?.[likertId])
        row[column] = value ?? ''
      }

      for (const [column, likertId] of POST_FIELD_MAP) {
        const value = toFiniteNumber(session.post?.likertResponses?.[likertId])
        row[column] = value ?? ''
      }

      const answersByQuestionId = new Map(
        (session.quiz?.answers ?? []).map((answer) => [answer.questionId, answer]),
      )

      QUESTION_IDS.forEach((questionId, index) => {
        const answer = answersByQuestionId.get(questionId)
        row[`Q${index + 1}` as Header] = answer?.isCorrect ? 1 : answer ? 0 : ''
      })

      row.TotalScore = session.quiz?.score ?? ''
      return row
    })

  const meanRow: LearnerLevelRow = Object.fromEntries(
    HEADERS.map((header) => [header, '']),
  ) as LearnerLevelRow
  meanRow.Subject = 'Mean'

  for (const header of HEADERS.slice(1)) {
    const values = subjectRows
      .map((row) => row[header])
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))

    meanRow[header] = values.length ? formatMean(values.reduce((sum, value) => sum + value, 0) / values.length) : ''
  }

  return {
    headers: [...HEADERS],
    rows: [...subjectRows, meanRow].map((row) => HEADERS.map((header) => row[header])),
  }
}
