function NeuronResponsePanel({ lastResult }) {
  if (lastResult === 'no-fire') {
    return (
      <div className="module1-sound-neuron__response-panel">
        <span className="module1-sound-neuron__response-label">Result</span>
        <strong className="module1-sound-neuron__response-title">No spike yet</strong>
        <span className="module1-sound-neuron__response-label">Why it happened</span>
        <p className="module1-sound-neuron__response-line">The signal was not strong enough to trigger a spike in time.</p>
      </div>
    )
  }

  if (lastResult === 'alex-fire') {
    return (
      <div className="module1-sound-neuron__response-panel">
        <span className="module1-sound-neuron__response-label">Result</span>
        <strong className="module1-sound-neuron__response-title">Neuron stimulated</strong>
        <span className="module1-sound-neuron__response-label">Why it happened</span>
        <p className="module1-sound-neuron__response-line">The stimulus changes the neuron&apos;s activity. Use the view options to inspect ions, charges, concentrations, or the potential chart.</p>
      </div>
    )
  }

  if (lastResult === 'fire') {
    return (
      <div className="module1-sound-neuron__response-panel">
        <span className="module1-sound-neuron__response-label">Result</span>
        <strong className="module1-sound-neuron__response-title">Neuron stimulated</strong>
        <span className="module1-sound-neuron__response-label">Why it happened</span>
        <p className="module1-sound-neuron__response-line">The stimulus changes the neuron&apos;s activity. Use the view options to inspect ions, charges, concentrations, or the potential chart.</p>
      </div>
    )
  }

  return (
    <div className="module1-sound-neuron__response-panel">
      <span className="module1-sound-neuron__response-label">Result</span>
      <strong className="module1-sound-neuron__response-title">Ready</strong>
      <span className="module1-sound-neuron__response-label">Why it happened</span>
      <p className="module1-sound-neuron__response-line">Use Stimulate Neuron to watch the neuron respond.</p>
    </div>
  )
}

export default NeuronResponsePanel
