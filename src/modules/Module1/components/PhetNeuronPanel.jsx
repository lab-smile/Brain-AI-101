import PhetNeuronEmbed, {
} from './PhetNeuronEmbed'
import usePhetNeuronController from '../hooks/usePhetNeuronController'

function PhetNeuronPanel({
  title = 'Test the neuron',
  helperText = 'Use the controls below to stimulate the neuron and watch how it responds.',
  showStatus = true,
  showPlayback = true,
  showAttribution = false,
  compact = false,
  showIntro = true,
}) {
  const {
    iframeRef,
    isLoaded,
    bridgeReady,
    runtimeState,
    handleFrameLoad,
    runtimeLabel,
    runtimeDetail,
    simEventState,
    handlePlay,
    handlePause,
    handleStepBackward,
    handleStepForward,
    handleReset,
    handleStimulate,
    handleSpeedSlow,
    handleSpeedNormal,
    handleSpeedFast,
    handleSetAllIons,
    handleSetCharges,
    handleSetConcentrations,
    handleSetPotentialChart,
  } = usePhetNeuronController()

  const shellClassName = [
    'module1-phet-panel',
    'module1-phet-panel--embedded',
    compact ? 'module1-phet-panel--compact' : '',
    simEventState === 'firing' ? 'is-firing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={shellClassName}>
      {showIntro && (
        <div className="module1-phet-panel__intro">
          <h3 className="module1-phet-panel__title">{title}</h3>
          <p className="module1-phet-panel__runtime-copy">{helperText}</p>
        </div>
      )}

      {showStatus && (
        <div className="module1-phet-panel__status-row">
          <span
            className={[
              'module1-phet-panel__status-pill',
              `is-${simEventState}`,
              bridgeReady ? 'is-bridge-ready' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {runtimeLabel}
          </span>
          <span className="module1-phet-panel__status-meta">{runtimeDetail}</span>
        </div>
      )}

      <div className="module1-phet-panel__controls">
        {showPlayback && (
          <section className="module1-phet-panel__control-group">
            <h4>Playback</h4>
            <div className="module1-phet-panel__control-row">
              <button type="button" onClick={handlePlay} disabled={!runtimeState.canPlay}>Play</button>
              <button type="button" onClick={handlePause} disabled={!runtimeState.canPause}>Pause</button>
              <button type="button" onClick={handleStepBackward} disabled={!runtimeState.canStepBackward}>Step backward</button>
              <button type="button" onClick={handleStepForward} disabled={!runtimeState.canStepForward}>Step forward</button>
            </div>
          </section>
        )}

        <section className="module1-phet-panel__control-group">
          <h4>Stimulus</h4>
          <div className="module1-phet-panel__control-row">
            <button type="button" onClick={handleStimulate} disabled={!runtimeState.canStimulate}>Stimulate Neuron</button>
            <button type="button" onClick={handleReset} disabled={!runtimeState.canReset}>Reset all</button>
          </div>
        </section>

        <section className="module1-phet-panel__control-group">
          <h4>Speed</h4>
          <div className="module1-phet-panel__control-row">
            <button type="button" onClick={handleSpeedSlow} className={runtimeState.speed === 'slow' ? 'is-active' : ''}>Slow</button>
            <button type="button" onClick={handleSpeedNormal} className={runtimeState.speed === 'normal' ? 'is-active' : ''}>Normal</button>
            <button type="button" onClick={handleSpeedFast} className={runtimeState.speed === 'fast' ? 'is-active' : ''}>Fast</button>
          </div>
        </section>

        <section className="module1-phet-panel__control-group">
          <h4>View options</h4>
          <div className="module1-phet-panel__toggle-row">
            <label>
              <input type="checkbox" checked={runtimeState.allIons} onChange={(event) => handleSetAllIons(event.target.checked)} />
              <span>All Ions</span>
            </label>
            <label>
              <input type="checkbox" checked={runtimeState.charges} onChange={(event) => handleSetCharges(event.target.checked)} />
              <span>Charges</span>
            </label>
            <label>
              <input type="checkbox" checked={runtimeState.concentrations} onChange={(event) => handleSetConcentrations(event.target.checked)} />
              <span>Concentrations</span>
            </label>
            <label>
              <input type="checkbox" checked={runtimeState.potentialChart} onChange={(event) => handleSetPotentialChart(event.target.checked)} />
              <span>Potential Chart</span>
            </label>
          </div>
        </section>
      </div>

      <PhetNeuronEmbed iframeRef={iframeRef} onFrameLoad={handleFrameLoad} />

      {showAttribution && (
        <p className="module1-phet-panel__attribution">
          {isLoaded ? 'Animation loaded. ' : ''}
          Neuron simulation
        </p>
      )}
    </div>
  )
}

export default PhetNeuronPanel
