import digitFeatureImage from '../../../../assets/module3/digit/digit-4-ambiguous-9.png'

const DIGIT_FEATURE_IMAGE = digitFeatureImage

function PredictionSummary({ prediction, target, status, improved = false }) {
  return (
    <div className={`m3-sa-prediction${improved ? ' m3-sa-prediction--improved' : ''}`}>
      <div>
        <span>Prediction</span>
        <strong>{prediction}</strong>
      </div>
      <div>
        <span>Target</span>
        <strong>{target}</strong>
      </div>
      <p>{status}</p>
    </div>
  )
}

function LearningProblem() {
  return (
    <section className="m3-section m3-section--centered">
      <div className="m3-section-card m3-section-card--feature m3-learning-problem-card m3-sa-card">
        <div className="m3-section-heading">
          <p className="m3-eyebrow">A. LEARNING MEANS CHANGING</p>
          <h2>Can the model correct itself?</h2>
          <p className="m3-section-subtitle">
            A model learns when feedback changes which features matter most.
          </p>
        </div>

        <div className="m3-sa-layout">
          <article className="m3-sa-panel m3-sa-panel--input">
            <div className="m3-sa-panel-head">
              <h3>Input digit</h3>
              <p>The model looks at parts of the shape.</p>
            </div>
            <div className="m3-sa-digit-frame">
              <img
                src={DIGIT_FEATURE_IMAGE}
                alt="Handwritten digit 4 with an ambiguous shape that could be mistaken for a 9"
                className="m3-sa-digit-image"
              />
            </div>
            <p className="m3-sa-note">The model checks different parts of the shape.</p>
          </article>

          <article className="m3-sa-panel m3-sa-panel--before">
            <div className="m3-sa-panel-head">
              <h3>Before learning</h3>
              <p>The model makes a wrong prediction.</p>
            </div>
            <PredictionSummary prediction="9" target="4" status="Error detected" />
            <p className="m3-sa-note">
              The top of this stroke looks almost closed, so the model reads it as a loop and guesses 9.
            </p>
            <p className="m3-sa-note">
              The model overweights the near-closed top and misreads the digit.
            </p>
          </article>

          <div className="m3-sa-connector" aria-hidden="true">
            <span>Feedback updates weights</span>
          </div>

          <article className="m3-sa-panel m3-sa-panel--after">
            <div className="m3-sa-panel-head">
              <h3>After learning</h3>
              <p>The model makes the correct prediction.</p>
            </div>
            <PredictionSummary
              prediction="4"
              target="4"
              status="Prediction improved"
              improved
            />
            <p className="m3-sa-note">
              The model now weighs the open gap at the top more heavily, and correctly reads this as 4.
            </p>
            <p className="m3-sa-note">
              The model correctly reads the open top as a 4.
            </p>
          </article>
        </div>

        <p className="m3-section-takeaway m3-sa-takeaway">
          The model learns by comparing its prediction with the target and adjusting which features matter most.
        </p>
      </div>
    </section>
  )
}

export default LearningProblem
