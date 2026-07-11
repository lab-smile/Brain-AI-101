import CourseEvaluationQuestionCallback from '../knowledge/CourseEvaluationQuestionCallback'
import CourseEvaluationCnnVisual from '../knowledge/CourseEvaluationCnnVisual'
import { knowledgeQuestions } from '../../data/courseEvaluationData'
import { useT } from '../../../../i18n/useT'

export default function EvaluationResults({
  headingRef,
  attempt,
  results,
  isRetryingUpload,
  onRetryUpload,
  onRetake,
  onContinue,
  submissionStatus = 'idle',
}) {
  const t = useT()
  const breakdownItems = Object.values(results.moduleBreakdown)
  const uploadStatus = attempt.remoteSubmissionStatus || 'idle'
  const showRetry = attempt.completedAt && uploadStatus !== 'synced'
  const uploadStatusLabel = uploadStatus === 'synced'
    ? t('postEval.results.storedDb')
    : uploadStatus === 'syncing'
      ? t('postEval.results.savingDb')
      : uploadStatus === 'failed'
        ? t('postEval.results.savedLocalRetry')
        : t('postEval.results.savedLocal')

  return (
    <section className="ce-panel ce-results-panel" aria-labelledby="results-heading">
      <div className="ce-panel-head">
        <h2 id="results-heading" ref={headingRef} tabIndex={-1}>{t('postEval.results.title')}</h2>
        <p>{t('postEval.results.helper')}</p>
      </div>

      <div className="ce-results-summary">
        <div className="ce-score-card">
          <span className="ce-score-label">{t('postEval.results.scoreLabel')}</span>
          <strong>{results.score} / {results.maxScore}</strong>
          <p>{results.passed ? t('postEval.results.scorePass') : t('postEval.results.scoreRetry')}</p>
        </div>

        <div className="ce-save-card">
          <span className="ce-score-label">{t('postEval.results.savedStatus')}</span>
          <strong>{attempt.completedAt ? uploadStatusLabel : t('postEval.results.inProgress')}</strong>
          {submissionStatus === 'success' && (
            <p className="eval-results__storage-note eval-results__storage-note--success">
              {t('postEval.results.savedSuccess')}
            </p>
          )}
          {submissionStatus === 'error' && (
            <p className="eval-results__storage-note eval-results__storage-note--error">
              {t('postEval.results.savedError')}
            </p>
          )}
          {(submissionStatus === 'idle' || submissionStatus === 'submitting') && (
            <p className="eval-results__storage-note eval-results__storage-note--pending">
              {t('postEval.results.savedPending')}
            </p>
          )}
          {attempt.remoteSubmissionError && (
            <p className="ce-inline-error">{attempt.remoteSubmissionError}</p>
          )}
        </div>
      </div>

      {breakdownItems.length > 0 && (
        <div className="ce-breakdown">
          <h3>{t('postEval.results.moduleBreakdown')}</h3>
          <div className="ce-breakdown-grid">
            {breakdownItems.map((item) => (
              <div key={item.module} className="ce-breakdown-card">
                <span>{item.label}</span>
                <strong>{item.correct} / {item.total}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ce-results-list" aria-live="polite">
        {results.questionResults.map((item, index) => {
          const sourceQuestion = knowledgeQuestions.find((question) => question.id === item.id)
          const moduleLabel = sourceQuestion?.module === 'module1'
            ? t('nav.path.module1')
            : sourceQuestion?.module === 'module2'
              ? t('nav.path.module2')
              : t('nav.path.module3')

          return (
            <article key={item.id} className={`ce-result-item${item.isCorrect ? ' is-correct' : ' is-incorrect'}`}>
              <div className="ce-result-head">
                <div>
                  <span className="ce-result-kicker">{t('postEval.results.question', { number: index + 1 })}</span>
                  <h3>{item.question}</h3>
                </div>
                <span className={`ce-result-badge${item.isCorrect ? ' is-correct' : ' is-incorrect'}`}>
                  {item.isCorrect ? t('postEval.results.correct') : t('postEval.results.incorrect')}
                </span>
              </div>

              {sourceQuestion && (
                <CourseEvaluationQuestionCallback module={moduleLabel} sectionTitle={sourceQuestion.sectionTitle} />
              )}

              <p className="ce-result-meta">
                {t('postEval.results.yourAnswer')}: <strong>{item.selectedAnswer || t('postEval.results.noAnswer')}</strong>
                {' '}| {t('postEval.results.correctAnswer')}: <strong>{item.correctAnswer}</strong>
              </p>

              {sourceQuestion?.visualType && (
                <CourseEvaluationCnnVisual
                  visualType={sourceQuestion.visualType}
                  visualData={sourceQuestion.visualData}
                  revealAnswer
                  selectedAnswer={item.selectedAnswer}
                  correctAnswer={item.correctAnswer}
                />
              )}

              <p className="ce-result-explanation">{item.explanation}</p>
            </article>
          )
        })}
      </div>

      <div className="ce-actions">
        <div className="ce-actions-group">
          <button type="button" className="shared-btn shared-btn-secondary" onClick={onRetake}>
            {t('postEval.results.retake')}
          </button>
          {showRetry && (
            <button
              type="button"
              className="shared-btn shared-btn-secondary"
              onClick={onRetryUpload}
              disabled={isRetryingUpload || uploadStatus === 'syncing'}
            >
              {isRetryingUpload || uploadStatus === 'syncing' ? t('postEval.results.retrying') : t('postEval.results.retrySave')}
            </button>
          )}
        </div>
        <button type="button" className="shared-btn shared-btn-primary" onClick={onContinue}>
          {t('postEval.results.continueCompletion')}
        </button>
      </div>
    </section>
  )
}
