import { useMemo, useState } from 'react'

const INPUT_NODES = [
  { id: 'i1', x: 110, y: 90, label: 'x1' },
  { id: 'i2', x: 110, y: 180, label: 'x2' },
  { id: 'i3', x: 110, y: 270, label: 'x3' },
]

const HIDDEN_NODES = [
  { id: 'h1', x: 360, y: 120, label: 'h1' },
  { id: 'h2', x: 360, y: 240, label: 'h2' },
]

const OUTPUT_NODE = { id: 'o1', x: 620, y: 180, label: 'y' }

const START_WEIGHTS = {
  i1h1: 0.4,
  i1h2: 0.2,
  i2h1: 0.3,
  i2h2: 0.5,
  i3h1: 0.6,
  i3h2: 0.4,
  h1o1: 0.7,
  h2o1: 0.5,
}

const UPDATED_WEIGHTS = {
  i1h1: 0.5,
  i1h2: 0.3,
  i2h1: 0.3,
  i2h2: 0.5,
  i3h1: 0.7,
  i3h2: 0.5,
  h1o1: 0.8,
  h2o1: 0.6,
}

function BackpropagationSection() {
  const [forwardRun, setForwardRun] = useState(0)
  const [errorShown, setErrorShown] = useState(false)
  const [backwardRun, setBackwardRun] = useState(0)
  const [weightsUpdated, setWeightsUpdated] = useState(false)

  const weights = weightsUpdated ? UPDATED_WEIGHTS : START_WEIGHTS

  const prediction = weightsUpdated ? '0.9' : forwardRun > 0 ? '0.6' : '--'
  const target = errorShown ? '1.0' : '--'
  const error = errorShown ? (weightsUpdated ? '0.1' : '0.4') : '--'

  const forwardPaths = useMemo(() => ([
    { id: `bp-f-1-${forwardRun}`, d: 'M 110 90 C 190 90, 250 110, 360 120' },
    { id: `bp-f-2-${forwardRun}`, d: 'M 110 180 C 190 180, 250 150, 360 120' },
    { id: `bp-f-3-${forwardRun}`, d: 'M 110 270 C 190 270, 250 230, 360 240' },
    { id: `bp-f-4-${forwardRun}`, d: 'M 360 120 C 450 120, 530 145, 620 180' },
    { id: `bp-f-5-${forwardRun}`, d: 'M 360 240 C 450 240, 530 215, 620 180' },
  ]), [forwardRun])

  const backwardPaths = useMemo(() => ([
    { id: `bp-b-1-${backwardRun}`, d: 'M 620 180 C 530 145, 450 120, 360 120' },
    { id: `bp-b-2-${backwardRun}`, d: 'M 620 180 C 530 215, 450 240, 360 240' },
    { id: `bp-b-3-${backwardRun}`, d: 'M 360 120 C 250 110, 190 90, 110 90' },
    { id: `bp-b-4-${backwardRun}`, d: 'M 360 240 C 250 230, 190 270, 110 270' },
  ]), [backwardRun])

  const reset = () => {
    setForwardRun(0)
    setErrorShown(false)
    setBackwardRun(0)
    setWeightsUpdated(false)
  }

  const connectionStroke = (value) => 2 + value * 4

  return (
    <section className="m3-section">
      <div className="m3-section-heading">
        <p className="m3-eyebrow">D. BACKPROPAGATION</p>
        <h2>Backpropagation: Sending Error Backward</h2>
        <p className="m3-section-subtitle">
          The model uses error to decide which connections should change.
        </p>
      </div>

      <div className="m3-section-card m3-backprop-card">
        <div className="m3-backprop-topline">
          <div className="m3-backprop-direction">
            <span className={`m3-backprop-badge${forwardRun > 0 ? ' is-active' : ''}`}>Forward pass</span>
            <span>Inputs → Hidden layer → Output → Prediction</span>
          </div>
          <div className="m3-backprop-direction">
            <span className={`m3-backprop-badge m3-backprop-badge--error${backwardRun > 0 ? ' is-active' : ''}`}>Backward pass</span>
            <span>Error → Output layer → Hidden layer → Weight updates</span>
          </div>
        </div>

        <div className="m3-backprop-layout">
          <div className="m3-backprop-network">
            <svg viewBox="0 0 720 360" className="m3-svg-block" aria-label="Simple neural network for backpropagation">
              <rect x="20" y="20" width="680" height="320" rx="18" fill="#f8fafc" stroke="#e2e8f0" />

              <text x="85" y="54" textAnchor="middle" fontSize="12" fill="#64748b">Input</text>
              <text x="360" y="54" textAnchor="middle" fontSize="12" fill="#64748b">Hidden</text>
              <text x="620" y="54" textAnchor="middle" fontSize="12" fill="#64748b">Output</text>

              <g className={`m3-backprop-links${forwardRun > 0 ? ' is-forward' : ''}${backwardRun > 0 ? ' is-backward' : ''}`}>
                <line x1="110" y1="90" x2="360" y2="120" stroke="#94a3b8" strokeWidth={connectionStroke(weights.i1h1)} />
                <line x1="110" y1="90" x2="360" y2="240" stroke="#94a3b8" strokeWidth={connectionStroke(weights.i1h2)} />
                <line x1="110" y1="180" x2="360" y2="120" stroke="#94a3b8" strokeWidth={connectionStroke(weights.i2h1)} />
                <line x1="110" y1="180" x2="360" y2="240" stroke="#94a3b8" strokeWidth={connectionStroke(weights.i2h2)} />
                <line x1="110" y1="270" x2="360" y2="120" stroke="#94a3b8" strokeWidth={connectionStroke(weights.i3h1)} />
                <line x1="110" y1="270" x2="360" y2="240" stroke="#94a3b8" strokeWidth={connectionStroke(weights.i3h2)} />
                <line x1="360" y1="120" x2="620" y2="180" stroke="#64748b" strokeWidth={connectionStroke(weights.h1o1)} />
                <line x1="360" y1="240" x2="620" y2="180" stroke="#64748b" strokeWidth={connectionStroke(weights.h2o1)} />
              </g>

              {Object.entries(weights).map(([key, value], index) => {
                const positions = {
                  i1h1: [220, 92],
                  i1h2: [220, 152],
                  i2h1: [220, 142],
                  i2h2: [220, 202],
                  i3h1: [220, 222],
                  i3h2: [220, 270],
                  h1o1: [495, 132],
                  h2o1: [495, 226],
                }
                const [x, y] = positions[key]
                return (
                  <text
                    key={key}
                    x={x}
                    y={y}
                    fontSize="11"
                    fill={weightsUpdated && key !== 'i2h1' && key !== 'i2h2' ? '#047857' : '#475569'}
                    fontWeight="700"
                  >
                    {value.toFixed(1)}
                  </text>
                )
              })}

              {[...INPUT_NODES, ...HIDDEN_NODES, OUTPUT_NODE].map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.id === 'o1' ? 28 : 24}
                    fill="#ffffff"
                    stroke={node.id === 'o1' ? '#f59e0b' : '#3b82f6'}
                    strokeWidth="3"
                  />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
                    {node.label}
                  </text>
                </g>
              ))}

              {forwardRun > 0 && forwardPaths.map((path, index) => (
                <g key={path.id}>
                  <path id={path.id} d={path.d} fill="none" stroke="none" />
                  <circle r="6" fill="#10b981">
                    <animateMotion dur="1.1s" begin={`${index * 0.18}s`} fill="freeze">
                      <mpath href={`#${path.id}`} />
                    </animateMotion>
                  </circle>
                </g>
              ))}

              {backwardRun > 0 && backwardPaths.map((path, index) => (
                <g key={path.id}>
                  <path id={path.id} d={path.d} fill="none" stroke="none" />
                  <circle r="6" fill="#ef4444">
                    <animateMotion dur="1.05s" begin={`${index * 0.18}s`} fill="freeze">
                      <mpath href={`#${path.id}`} />
                    </animateMotion>
                  </circle>
                </g>
              ))}
            </svg>
          </div>

          <div className="m3-backprop-sidebar">
            <div className="m3-backprop-stats">
              <div className="m3-backprop-stat">
                <span>Prediction</span>
                <strong>{prediction}</strong>
              </div>
              <div className="m3-backprop-stat">
                <span>Target</span>
                <strong>{target}</strong>
              </div>
              <div className="m3-backprop-stat">
                <span>Error</span>
                <strong>{error}</strong>
              </div>
            </div>

            <div className="m3-backprop-explainer">
              <p className="m3-backprop-label">Explanation</p>
              <p>
                Backpropagation does not mean the AI “thinks backward.” It means the model calculates how much each connection contributed to the error, then adjusts the weights.
              </p>
            </div>

            <div className="m3-backprop-analogy">
              <p className="m3-backprop-label">Student analogy</p>
              <p>
                Imagine a group project receives a low score. The team looks backward through the project to find which parts caused the problem. Then each person improves their part for next time.
              </p>
            </div>

            <div className="m3-backprop-note">
              <p className="m3-backprop-label">Accuracy note</p>
              <p>
                This is a simplified model. Real backpropagation uses calculus, but the basic idea is error-guided weight adjustment.
              </p>
            </div>
          </div>
        </div>

        <div className="m3-controls">
          <button className="m3-btn" onClick={() => setForwardRun((value) => value + 1)}>
            Run Forward Pass
          </button>
          <button className="m3-btn" onClick={() => setErrorShown(true)} disabled={forwardRun === 0}>
            Show Error
          </button>
          <button className="m3-btn" onClick={() => setBackwardRun((value) => value + 1)} disabled={!errorShown}>
            Send Error Backward
          </button>
          <button className="m3-btn" onClick={() => setWeightsUpdated(true)} disabled={backwardRun === 0}>
            Update Weights
          </button>
          <button className="m3-btn" onClick={reset}>
            Reset
          </button>
        </div>

        <p className="m3-takeaway">
          Backpropagation helps a model learn by tracing the error backward and updating weights.
        </p>
      </div>
    </section>
  )
}

export default BackpropagationSection
