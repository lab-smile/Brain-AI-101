import { describe, expect, it } from 'vitest'
import { buildLearnerLevelRows } from '../learnerLevelExport'

describe('buildLearnerLevelRows', () => {
  it('merges latest pre, post, and quiz attempt into one row per session and appends a mean row', () => {
    const result = buildLearnerLevelRows(
      [
        {
          sessionId: 'session-b',
          source: 'pre_course',
          submittedAt: new Date('2026-06-01T10:00:00.000Z'),
          likertResponses: {
            'likert-1': 1,
            'likert-2': 2,
          },
        },
        {
          sessionId: 'session-b',
          source: 'pre_course',
          submittedAt: new Date('2026-06-02T10:00:00.000Z'),
          likertResponses: {
            'likert-1': 4,
            'likert-2': 5,
          },
        },
        {
          sessionId: 'session-b',
          source: 'post_course',
          submittedAt: new Date('2026-06-03T10:00:00.000Z'),
          likertResponses: {
            'likert-1': 5,
            'likert-2': 4,
          },
        },
        {
          sessionId: 'session-a',
          source: 'pre_course',
          submittedAt: new Date('2026-06-01T09:00:00.000Z'),
          likertResponses: {
            'likert-1': 2,
          },
        },
      ],
      [
        {
          sessionId: 'session-b',
          submittedAt: new Date('2026-06-03T10:00:00.000Z'),
          score: 7,
          answers: [
            { questionId: 'q1', isCorrect: false },
            { questionId: 'q2', isCorrect: true },
          ],
        },
        {
          sessionId: 'session-b',
          submittedAt: new Date('2026-06-04T10:00:00.000Z'),
          score: 9,
          answers: [
            { questionId: 'q1', isCorrect: true },
            { questionId: 'q2', isCorrect: true },
            { questionId: 'q10', isCorrect: false },
          ],
        },
        {
          sessionId: 'session-a',
          submittedAt: new Date('2026-06-02T08:00:00.000Z'),
          score: 5,
          answers: [
            { questionId: 'q1', isCorrect: true },
          ],
        },
      ],
    )

    expect(result.headers).toEqual([
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
    ])

    expect(result.rows).toEqual([
      ['session-a', 2, '', '', '', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', '', '', '', '', 5],
      ['session-b', 4, 5, '', '', '', '', 5, 4, '', '', '', '', 1, 1, '', '', '', '', '', '', '', 0, 9],
      ['Mean', '3', '5', '', '', '', '', '5', '4', '', '', '', '', '1', '1', '', '', '', '', '', '', '', '0', '7'],
    ])
  })
})
