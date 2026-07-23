import nsfLogo from '../assets/NSFlogo/NSF_Official_logo_Res_600ppi.png'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* ROW 1: lab identity + credit */}
      <div className="footer-row1">
        <a
          href="https://lab-smile.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://lab-smile.github.io/img/misc/smilebanner.png"
            alt="SMILE Lab"
            className="footer-smile-logo"
          />
        </a>

        <div className="footer-lab-info">
          <strong>SMILE Lab</strong>
          <span>J. Crayton Pruitt Family Department of Biomedical Engineering</span>
          <span>University of Florida</span>
          <span>
            PI:{' '}
            <a
              href="https://lab-smile.github.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dr. Ruogu Fang
            </a>
          </span>
        </div>

        <div className="footer-built">
          <span>
            Designed and built by{' '}
            <a
              href="https://github.com/Boombaka3"
              target="_blank"
              rel="noopener noreferrer"
            >
              Qixuan Wu
            </a>
          </span>
        </div>
      </div>

      {/* ROW 2: funding + license */}
      <div className="footer-row2">
        <a
          href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2318984"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={nsfLogo}
            alt="National Science Foundation"
            className="footer-nsf-logo"
          />
        </a>

        <span>
          Supported by NSF NCS-FO-2318984 AI Supplement
          {' · '}
          © 2026 Brain × AI 101
          {' · '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY 4.0
          </a>
          {' (content) · '}
          <a
            href="https://github.com/Boombaka3/Brain-AI-101/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT
          </a>
          {' (code) · '}
          <a
            href="https://github.com/Boombaka3/Brain-AI-101"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open source on GitHub
          </a>
          {' · '}
          <a href="/about" rel="noopener noreferrer">
            About
          </a>
        </span>
      </div>
    </footer>
  )
}
