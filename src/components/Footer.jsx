import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-row1">
        <a href="https://lab-smile.github.io/" target="_blank" rel="noopener">
          <img
            src="https://lab-smile.github.io/img/misc/smilebanner.png"
            alt="SMILE Lab"
            style={{ height: '48px', objectFit: 'contain' }}
          />
        </a>

        <div className="footer-lab-info">
          <strong>SMILE Lab</strong>
          <span>J. Crayton Pruitt Family Department of Biomedical Engineering</span>
          <span>University of Florida</span>
          <span>
            PI:{' '}
            <a href="https://lab-smile.github.io/" target="_blank" rel="noopener">
              Dr. Ruogu Fang
            </a>
          </span>
        </div>

        <div className="footer-built">
          <div>
            Built by{' '}
            <a href="https://github.com/Boombaka3" target="_blank" rel="noopener">
              Qixuan Wu
            </a>
          </div>
          <div>M.S. Student, CISE, University of Florida</div>
        </div>
      </div>

      <div className="footer-row2">
        {/* NSF logo to be added here once provided */}
        <span>
          © 2026 Brain × AI 101 · Licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">
            CC BY 4.0
          </a>{' '}
          (content) and{' '}
          <a
            href="https://github.com/Boombaka3/Brain-AI-101/blob/main/LICENSE"
            target="_blank"
            rel="noopener"
          >
            MIT
          </a>{' '}
          (code) ·{' '}
          <a
            href="https://github.com/Boombaka3/Brain-AI-101"
            target="_blank"
            rel="noopener"
          >
            Open source on GitHub
          </a>{' '}
          · NSF NCS-FO-2318984 AI Supplement
          <img
            src="https://licensebuttons.net/l/by/4.0/80x15.png"
            alt="CC BY 4.0"
            style={{ verticalAlign: 'middle', marginLeft: '4px' }}
          />
        </span>
      </div>
    </footer>
  )
}
