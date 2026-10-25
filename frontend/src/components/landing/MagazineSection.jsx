import { Link, useNavigate } from 'react-router-dom';

const formatPrice = (price) => `KES ${price.toLocaleString()}`;

const MagazineCover = ({ magazine, variant = '', lazy = true }) => (
  <div className={`nl-mag-cover nl-cover-${magazine.cover} ${variant}`}>
    {magazine.image ? (
      <img
        src={magazine.image}
        alt={`${magazine.title} cover`}
        className="nl-mag-cover-img"
        loading={lazy ? 'lazy' : 'eager'}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    ) : (
      <>
        <div>
          <div className="nl-cover-brand">TRENDORABAY</div>
          <div className="nl-cover-issue">{magazine.coverIssue}</div>
        </div>
        <div className="nl-cover-title">{magazine.coverTitle}</div>
        <div className="nl-cover-bottom">{magazine.coverBottom}</div>
      </>
    )}
  </div>
);

const MagazineSection = ({ magazines }) => {
  const navigate = useNavigate();
  const featured = magazines[0];

  if (!featured) return null;

  const handleMagazineClick = (magazine) => {
    // Use ID as slug to ensure uniqueness
    const slug = String(magazine.id);
    if (import.meta.env.DEV) {
      console.log('Navigating to magazine with ID:', magazine.id, 'slug:', slug, 'title:', magazine.title);
    }
    navigate(`/magazines/${slug}`);
  };

  return (
    <section id="nl-magazines" className="nl-section">
      <div className="nl-store-view">
        <div className="nl-section-head">
          <div>
            <span className="nl-tag">TRENDORABAY STORE</span>
            <h2>✦ Magazines</h2>
          </div>
        </div>

        <div className="nl-magazine-hero">
          <MagazineCover magazine={featured} lazy={false} />
          <div>
            <span className="nl-kicker">Latest Issue</span>
            <h2>{featured.title}.</h2>
            <p className="nl-hero-lead">{featured.lead}</p>
            <div className="nl-price">{formatPrice(featured.price)}</div>
            <Link to="/cart" className="nl-buybtn">BUY MAGAZINE</Link>
            <button
              type="button"
              className="nl-secondarybtn"
              onClick={() => handleMagazineClick(featured)}
            >
              VIEW ISSUE
            </button>
          </div>
          <img
            src="/music1.jpeg"
            alt="Upcoming issue preview"
            className="nl-mag-hero-thumb"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        <div className="nl-section-head nl-section-head-spaced">
          <h2>Latest Issues</h2>
        </div>
        <div className="nl-mag-grid">
          {magazines.slice(1).map((magazine) => (
            <article
              key={magazine.id}
              className="nl-mag-card"
              onClick={() => handleMagazineClick(magazine)}
            >
              <MagazineCover magazine={magazine} variant="nl-mag-cover-small" />
              <div className="nl-mag-info">
                <h3>{magazine.title}</h3>
                <p className="nl-meta">{magazine.issue}</p>
                <button
                  type="button"
                  className="nl-mag-btn"
                  onClick={() => handleMagazineClick(magazine)}
                >
                  Read or Buy Print
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="nl-section-foot">
          <Link to="/magazines">ALL ISSUES →</Link>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
