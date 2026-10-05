import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '' });

  const goHome = () => {
    navigate('/');
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      showToast('No previous page — going home');
      setTimeout(() => navigate('/'), 900);
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2400);
  };

  return (
    <div className="not-found-page">
      <main>
        <div className="container error-wrap">
          <div className="error-text">
            <div className="eyebrow">Error 404</div>
            <div className="error-code">4<span className="dot"></span>4</div>
            <h1>We couldn't find that page.</h1>
            <p>The link you followed may be broken, or the page may have been moved. Let's get you back on track.</p>

            <div className="cta-group">
              <button className="btn primary" onClick={goHome}>Back to home</button>
              <button className="btn ghost" onClick={goBack}>Go back</button>
            </div>
          </div>
        </div>
      </main>

      <section className="suggestions">
        <div className="container">
          <div className="suggestions-head">
            <div className="eyebrow">Try instead</div>
            <h2>Where would you like to go?</h2>
          </div>

          <div className="links-grid">
            <Link className="link-card" to="/">
              <h3>Homepage</h3>
              <p>Back to the start — stories, communities and everything Trendorabay.</p>
              <span className="arrow">Go home →</span>
            </Link>

            <Link className="link-card" to="/store">
              <h3>Store</h3>
              <p>Browse official merch and products from African creators.</p>
              <span className="arrow">Open store →</span>
            </Link>

            <Link className="link-card" to="/opportunities">
              <h3>Opportunities</h3>
              <p>Jobs, grants, gigs and remote roles across the continent.</p>
              <span className="arrow">View opportunities →</span>
            </Link>

            <Link className="link-card" to="/about">
              <h3>About</h3>
              <p>Who we are, what we stand for, and why we build for creators.</p>
              <span className="arrow">Read about us →</span>
            </Link>
          </div>
        </div>
      </section>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </div>
  );
};

export default NotFoundPage;
