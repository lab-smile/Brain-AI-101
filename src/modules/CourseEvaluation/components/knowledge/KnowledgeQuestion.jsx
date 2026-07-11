import CourseEvaluationQuestionCallback from './CourseEvaluationQuestionCallback'
import CourseEvaluationCnnVisual from './CourseEvaluationCnnVisual'
import { useT } from '../../../../i18n/useT'

const MODULE_BADGES = {
  module1: 'nav.path.module1',
  module2: 'nav.path.module2',
  module3: 'nav.path.module3',
}

export default function KnowledgeQuestion({ question, questionNumber, totalQuestions, selectedAnswer, onSelect }) {
  const t = useT()
  const moduleLabel = MODULE_BADGES[question.module] ? t(MODULE_BADGES[question.module]) : question.module

  return (
    <article className="ce-question-card">
      <div className="ce-question-top">
        <span className="ce-question-count">{t('postEval.questionCount', { current: questionNumber, total: totalQuestions })}</span>
        <div className="ce-question-tags">
          <span className="shared-chip">{moduleLabel}</span>
          <span className="shared-chip shared-chip-green">{question.concept}</span>
        </div>
      </div>

      <CourseEvaluationQuestionCallback module={moduleLabel} sectionTitle={question.sectionTitle} />

      <h3>{question.question}</h3>

      {question.visualType && (
        <CourseEvaluationCnnVisual
          visualType={question.visualType}
          visualData={question.visualData}
          revealAnswer={false}
        />
      )}

      <div className="ce-choice-list" role="radiogroup" aria-label={question.question}>
        {question.choices.map((choice) => {
          const checked = selectedAnswer === choice.id

          return (
            <label key={choice.id} className={`ce-choice${checked ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name={question.id}
                value={choice.id}
                checked={checked}
                onChange={() => onSelect(question.id, choice.id)}
                aria-label={`${choice.id}. ${choice.text}`}
              />
              <span className="ce-choice-key">{choice.id}</span>
              <span className="ce-choice-text">{choice.text}</span>
            </label>
          )
        })}
      </div>
    </article>
  )
}
