import AnnDiagram from '../../../components/diagrams/AnnDiagram'
import biologicalNeuronBridgeImage from '../../../assets/ChatGPT Image Apr 24, 2026, 01_40_31 PM.png'

function BridgeToAnn({ onContinue }) {
  return (
    <section className="module1-section module1-bridge-section">
      <div className="module1-section-heading module1-bridge-heading">
        <p className="module1-eyebrow">D. Bridge</p>
        <h2>From a living neuron to a simpler model</h2>
        <p>
          We are not copying biology part-for-part. We are keeping one useful idea: signals come in, they combine, and
          the unit responds if the total evidence is strong enough.
        </p>
      </div>

      <section className="bridge-comparison module1-bridge-comparison">
        <div className="bridge-panel bridge-panel-bio module1-panel module1-soft-panel">
          <div className="module1-bridge-panel-header">
            <div>
              <h3 className="module1-panel-title module1-panel-title-large">Biological neuron</h3>
              <p className="module1-card-muted">
                A living cell whose parts gather, combine, and pass signals onward.
              </p>
            </div>
            <span className="module1-bridge-current-label">Real system</span>
          </div>

          <div className="bridge-visual bridge-visual-bio module1-bridge-shell module1-bridge-shell-bio">
            <img
              className="module1-bridge-bio-image"
              src={biologicalNeuronBridgeImage}
              alt="Biological neuron with many incoming signals combining before outgoing signals continue."
            />
          </div>

        </div>

        <div className="bridge-panel bridge-panel-ann module1-panel module1-soft-panel">
          <div className="module1-bridge-panel-header">
            <div>
              <h3 className="module1-panel-title">Artificial neuron</h3>
              <p className="module1-card-muted">
                A simpler model that keeps the same basic idea: inputs come in, combine, and produce one output.
              </p>
            </div>
            <span className="module1-bridge-current-label">Simplified model</span>
          </div>

          <div className="bridge-visual bridge-visual-ann module1-bridge-shell module1-bridge-shell-ann">
            <AnnDiagram variant="bridge" />
          </div>

        </div>
      </section>

      <div className="module1-bridge-actions">
        <button className="module1-primary-button" onClick={onContinue}>
          Continue to Module 2
        </button>
      </div>
    </section>
  )
}

export default BridgeToAnn
