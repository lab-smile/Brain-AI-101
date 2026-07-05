import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

function relu(value) {
  return Math.max(0, value)
}

function toSvgX(value) {
  return 70 + ((value + 3) / 6) * 360
}

function toSvgY(value) {
  return 220 - (value / 3.3) * 170
}

function buildReluPath() {
  const points = []

  for (let x = -3; x <= 3.01; x += 0.1) {
    points.push(`${toSvgX(x).toFixed(1)},${toSvgY(relu(x)).toFixed(1)}`)
  }

  return `M ${points.join(' L ')}`
}

function ActivationSection({ onContinue }) {
  const [inputValue, setInputValue] = useState(1)
  const outputValue = relu(inputValue)
  const reluPath = useMemo(() => buildReluPath(), [])
  const dotX = toSvgX(inputValue)
  const dotY = toSvgY(outputValue)
  const zeroX = toSvgX(0)

  return (
    <section className="module1-section module1-activation-section">
      <div className="module1-section-heading">
        <p className="module1-eyebrow">E. Activation Function</p>
        <h2>The Threshold Gate Becomes ReLU</h2>
        <p>
          The axon hillock checks whether the summed signal is strong enough to continue. In an artificial neuron, the
          activation function is the math step that makes the same kind of check.
        </p>
      </div>

      <div className="module1-panel module1-soft-panel">
        <div className="module1-mapping-list-bridge">
          <article className="module1-mapping-item">
            <p className="module1-bridge-footer-title">Signal-flow step</p>
            <h3>Input to weight to sum to threshold check to activation function to output</h3>
            <p>
              The soma-style sum combines the incoming information. ReLU then decides what leaves as the output value.
            </p>
          </article>

          <article className="module1-mapping-item">
            <p className="module1-bridge-footer-title">ReLU rule</p>
            <h3>Below zero becomes 0. Above zero passes through.</h3>
            <p>
              If the summed signal is not strong enough, ReLU outputs 0. If it is above the gate, the value keeps going.
            </p>
          </article>
        </div>

        <svg viewBox="0 0 500 270" className="ann-diagram-svg" style={{ marginTop: 24, maxHeight: 270 }}>
          <rect x="24" y="18" width="452" height="230" rx="18" fill="#f8fafc" stroke="#e2e8f0" />
          <text x="250" y="48" textAnchor="middle" fontSize="15" fontWeight="800" fill="#7c3aed">
            ReLU: f(x) = max(0, x)
          </text>

          <line x1="70" y1="220" x2="430" y2="220" stroke="#cbd5e1" strokeWidth="1.4" />
          <line x1={zeroX} y1="48" x2={zeroX} y2="226" stroke="#cbd5e1" strokeWidth="1.4" />
          <text x="70" y="240" textAnchor="middle" fontSize="11" fill="#64748b">
            -3
          </text>
          <text x={zeroX} y="240" textAnchor="middle" fontSize="11" fill="#64748b">
            0
          </text>
          <text x="430" y="240" textAnchor="middle" fontSize="11" fill="#64748b">
            +3
          </text>

          <path d={reluPath} fill="none" stroke="#7c3aed" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <motion.line
            x1={dotX}
            y1={dotY}
            x2={dotX}
            y2="220"
            stroke="#7c3aed"
            strokeWidth="1.4"
            strokeDasharray="4 3"
            opacity="0.55"
            animate={{ x1: dotX, x2: dotX, y1: dotY }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <motion.circle
            cx={dotX}
            cy={dotY}
            r="7"
            fill="#7c3aed"
            animate={{ cx: dotX, cy: dotY }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <motion.text
            x={dotX}
            y={dotY - 14}
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#7c3aed"
            animate={{ x: dotX, y: dotY - 14 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {outputValue.toFixed(1)}
          </motion.text>
        </svg>

        <div className="module1-threshold-block" style={{ marginTop: 20 }}>
          <label className="module1-threshold-label" htmlFor="module1-relu-slider">
            Summed signal: <strong>{inputValue > 0 ? '+' : ''}{inputValue.toFixed(1)}</strong>
          </label>
          <input
            id="module1-relu-slider"
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={inputValue}
            onChange={(event) => setInputValue(Number(event.target.value))}
          />
          <p className="module1-card-muted">
            ReLU output: <strong>{outputValue.toFixed(1)}</strong>
          </p>
        </div>
      </div>

      <div className="module1-bridge-actions">
        <button className="module1-primary-button" onClick={onContinue}>
          Continue to Module 2
        </button>
      </div>
    </section>
  )
}

export default ActivationSection
