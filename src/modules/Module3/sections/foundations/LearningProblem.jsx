const DIGIT_FEATURE_IMAGE = '/assets/module3/ChatGPT Image Jun 27, 2026, 11_13_38 PM.png'

const beforeWeights = [
  { label: 'Upper curve', value: 'Medium', tone: 'neutral', desc: 'top arc of the digit', color: '#534AB7' },
  { label: 'Closed loop', value: 'Too strong', tone: 'danger', desc: 'where the two strokes meet', color: '#1D9E75' },
  { label: 'Open gap', value: 'Too weak', tone: 'warn', desc: 'open space on the right side', color: '#D85A30' },
  { label: 'Lower curve', value: 'Medium', tone: 'neutral', desc: 'bottom arc of the digit', color: '#BA7517' },
]

const afterWeights = [
  { label: 'Upper curve', value: 'Strong', tone: 'success', desc: 'top arc of the digit', color: '#534AB7' },
  { label: 'Closed loop', value: 'Weak', tone: 'soft', desc: 'where the two strokes meet', color: '#1D9E75' },
  { label: 'Open gap', value: 'Strongest', tone: 'successStrong', desc: 'open space on the right side', color: '#D85A30' },
  { label: 'Lower curve', value: 'Strong', tone: 'success', desc: 'bottom arc of the digit', color: '#BA7517' },
]

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

function FeatureWeights({ items }) {
  return (
    <div className="m3-sa-weights" aria-label="Feature weights">
      {items.map((item) => (
        <div
          key={item.label}
          className="m3-sa-weight-row"
          style={{ '--m3-sa-feature-color': item.color }}
        >
          <span className="m3-sa-weight-dot" aria-hidden="true" />
          <span className="m3-sa-weight-copy">
            <span className="m3-sa-weight-label">{item.label}</span>
            <span className="m3-sa-weight-desc">{item.desc}</span>
          </span>
          <strong className={`m3-sa-weight-pill m3-sa-weight-pill--${item.tone}`}>
            {item.value}
          </strong>
        </div>
      ))}
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
                alt="Digit 3 with labels for upper curve, open gap, and lower curve"
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
            <PredictionSummary prediction="8" target="3" status="Error detected" />
            <FeatureWeights items={beforeWeights} />
            <p className="m3-sa-note">
              The model focuses too much on the wrong feature and misses the open gap.
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
              prediction="3"
              target="3"
              status="Prediction improved"
              improved
            />
            <FeatureWeights items={afterWeights} />
            <p className="m3-sa-note">
              The model focuses on the right features and predicts correctly.
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
