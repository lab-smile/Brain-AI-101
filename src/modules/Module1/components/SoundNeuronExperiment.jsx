import FloatingSignal from './FloatingSignal'
import NeuronResponsePanel from './NeuronResponsePanel'
import PhetNeuronPanel from './PhetNeuronPanel'
import { staticPayAttentionSvg } from './module1SceneAssets'
import useSoundNeuronExperiment, { EXAMPLE_SIGNALS } from '../hooks/useSoundNeuronExperiment'
import '../styles/soundNeuronExperiment.css'

function SoundNeuronExperiment() {
  const {
    currentPhrase,
    recentSignals,
    isAnimating,
    lastResult,
    setCurrentPhrase,
    submitCurrentPhrase,
    submitExamplePhrase,
  } = useSoundNeuronExperiment()

  return (
    <div className="module1-sound-neuron">
      <div className="module1-sound-neuron__shell">
        <div className="module1-sound-neuron__intro">
          <p className="module1-eyebrow module1-eyebrow-tight">C. Sound Experiment</p>
          <h2 className="module1-sound-neuron__title">When Does a Neuron Fire?</h2>
          <p className="module1-card-muted module1-text-reset">
            Sound signals travel to the ear, become neural input, and trigger a spike when the neuron is stimulated strongly enough.
          </p>
        </div>

        <form className="module1-sound-neuron__composer" onSubmit={submitCurrentPhrase}>
          <div className="module1-sound-neuron__input-row">
            <input
              id="module1-sound-neuron-input"
              type="text"
              value={currentPhrase}
              onChange={(event) => setCurrentPhrase(event.target.value)}
              placeholder="Type what Alex hears"
              autoComplete="off"
            />
            <button type="submit" className="module1-primary-button module1-sound-neuron__send-button">
              Send sound
            </button>
          </div>

          <div className="module1-sound-neuron__examples" aria-label="Example phrases">
            {EXAMPLE_SIGNALS.map((example) => (
              <button
                key={example.value}
                type="button"
                className="module1-sound-neuron__example-chip"
                onClick={() => submitExamplePhrase(example.value)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </form>

        <div className={`module1-sound-neuron__workspace ${isAnimating ? 'is-animating' : ''}`}>
          <div className="module1-sound-neuron__scene-panel">
            <div className="module1-sound-neuron__scene-art" aria-hidden="true">
              <div
                className="module1-sound-neuron__scene-art-body"
                dangerouslySetInnerHTML={{ __html: staticPayAttentionSvg }}
              />
              <div className="module1-sound-neuron__signal-overlay">
                {recentSignals.map((signal) => (
                  <FloatingSignal
                    key={signal.id}
                    phrase={signal.phrase}
                    impact={signal.impact}
                    strength={signal.strength}
                    isAlexCue={signal.isAlexCue}
                    duration={signal.duration}
                    scale={signal.scale}
                    laneOffset={signal.laneOffset}
                  />
                ))}
              </div>
            </div>
            <div className="module1-sound-neuron__scene-hint">Signals move toward the soma.</div>
          </div>

          <div className="module1-sound-neuron__neuron-panel">
            <div className="module1-sound-neuron__panel-header">
              <div>
                <h3 className="module1-sound-neuron__panel-title">Watch the neuron</h3>
                <p className="module1-sound-neuron__panel-copy">Stimulate the neuron and watch how it responds.</p>
              </div>
            </div>

            <NeuronResponsePanel lastResult={lastResult} />
            <PhetNeuronPanel
              title="Watch the neuron"
              helperText="Stimulate the neuron and watch how it responds."
              showStatus={false}
              showPlayback={false}
              showAttribution={false}
              compact
              showIntro={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoundNeuronExperiment
