import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './MagazineDetails.css';

const MagazineDetails = ({ magazine }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  const formatPrice = (price) => `KSh ${price?.toLocaleString() || '1,500'}`;

  const handleToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  const scrollCarousel = (trackRef, direction) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector('.feature-card, .contributor-card');
    if (!card) return;

    const gap = 22;
    const mobileGap = 14;
    const isMobile = window.innerWidth <= 640;
    const gapValue = isMobile ? mobileGap : gap;
    const step = card.offsetWidth + gapValue;

    trackRef.current.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  // Sample featured stories
  const featuredStories = [
    { num: '01', category: 'Fashion · Cover story', title: 'The new wave of African fashion is rewriting global rules.', excerpt: 'From Lagos to Nairobi, a generation of designers is building brands that refuse to be defined by the West.', author: 'Amara Okonkwo', time: '12 min' },
    { num: '02', category: 'Technology', title: 'Inside the fintech building Africa\'s payment rails.', excerpt: 'How a Nairobi startup went from a WhatsApp group to processing $2M a day.', author: 'Brian Kimani', time: '8 min' },
    { num: '03', category: 'Agriculture', title: 'The farmers using AI to fight drought in the Sahel.', excerpt: 'Satellite data, mobile phones and a new generation of agripreneurs.', author: 'Zainab Ali', time: '6 min' },
    { num: '04', category: 'Music', title: 'How Afrobeats became a global export — and what\'s next.', excerpt: 'From Lagos to London to Los Angeles, a sound that changed the industry.', author: 'Tunde Adeyemi', time: '10 min' },
    { num: '05', category: 'Art', title: 'The galleries betting big on African contemporary art.', excerpt: 'A new generation of curators is reshaping the global art market.', author: 'Naledi Dlamini', time: '9 min' },
    { num: '06', category: 'Culture', title: 'The return of African thrift culture.', excerpt: 'Why second-hand fashion is once again the coolest thing in the city.', author: 'Aisha Kimani', time: '5 min' },
  ];

  // Sample contributors
  const contributors = [
    { name: 'Brian Kimani', role: 'Editor-in-Chief', desc: 'Leads editorial direction and the long-form features desk.', avatar: 'https://i.pravatar.cc/200?img=12' },
    { name: 'Amara Okonkwo', role: 'Feature Writer', desc: 'Covered the African fashion wave for the cover story.', avatar: 'https://i.pravatar.cc/200?img=47' },
    { name: 'Zainab Ali', role: 'Contributing Writer', desc: 'Agriculture, climate and rural reporting.', avatar: 'https://i.pravatar.cc/200?img=32' },
    { name: 'Tunde Adeyemi', role: 'Music & Culture', desc: 'Covered Afrobeats\' global expansion and its next wave.', avatar: 'https://i.pravatar.cc/200?img=68' },
    { name: 'Naledi Dlamini', role: 'Art Editor', desc: 'Curates the art and design coverage across each issue.', avatar: 'https://i.pravatar.cc/200?img=45' },
    { name: 'Aisha Kimani', role: 'Culture Writer', desc: 'Reports on style, street culture and the creative scene.', avatar: 'https://i.pravatar.cc/200?img=15' },
    { name: 'Kwame Mensah', role: 'Photo Editor', desc: 'Oversaw photography across all 64 pages.', avatar: 'https://i.pravatar.cc/200?img=8' },
    { name: 'Neema Joseph', role: 'Art Director', desc: 'Designed the layout and visual identity of Issue 001.', avatar: 'https://i.pravatar.cc/200?img=22' },
  ];

  if (!magazine) return null;

  return (
    <div className="magazine-details-page">
      {/* HERO */}
      <section className="issue-hero">
        <div className="container issue-hero-grid">

          <div className="cover-wrap">
            <div className="cover-img">
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="Issue Cover" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '24px', fontWeight: 'bold', color: '#666'}}>TRENDORABAY</span>
                </div>
              )}
            </div>

            <div className="cover-actions">
              <button className="btn accent" onClick={() => handleToast('Opening reader')}>
                Read online <span>→</span>
              </button>
              <button className="btn primary" onClick={() => handleToast('Added to cart')}>
                Buy print ({formatPrice(magazine.printPrice || 1500)})
              </button>
              <button className="btn ghost" onClick={() => handleToast('Downloading PDF')}>
                Download PDF
              </button>
            </div>

            <div className="cover-meta-small">
              Published {magazine.published ? new Date(magazine.published).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : 'May 2026'}<br />
              By Trendorabay Media
            </div>
          </div>

          <div className="issue-info">
            <div className="eyebrow">{magazine.issue || '001'} · Volume I · {magazine.published ? new Date(magazine.published).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : 'May 2026'}</div>

            <h1>What's <em>inside.</em></h1>

            <p className="issue-subtitle">Real stories, real people, real culture. A 64-page snapshot of the people and ideas shaping tomorrow's Africa.</p>

            <div className="issue-meta-grid">
              <div className="meta-item">
                <span className="label">Published</span>
                <span className="value">{magazine.published ? new Date(magazine.published).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : 'May 12, 2026'}</span>
              </div>
              <div className="meta-item">
                <span className="label">Pages</span>
                <span className="value">{magazine.pages || 64} pages</span>
              </div>
              <div className="meta-item">
                <span className="label">Stories</span>
                <span className="value">10 features</span>
              </div>
              <div className="meta-item">
                <span className="label">Reading time</span>
                <span className="value">~42 minutes</span>
              </div>
              <div className="meta-item">
                <span className="label">Editor</span>
                <span className="value">{magazine.editor || 'Brian Kimani'}</span>
              </div>
              <div className="meta-item">
                <span className="label">Format</span>
                <span className="value">Digital + Print</span>
              </div>
            </div>

            <p className="issue-description">{magazine.fullDescription || magazine.description || 'Our debut issue. We spent three months on the ground across Nairobi, Lagos, Accra and Cape Town — documenting the designers redefining African fashion, the founders building the continent\'s payment rails, the farmers using AI to fight drought, and the creators shaping the culture. Ten features. Zero filler.'}</p>

            <div className="issue-highlights">
              <span className="highlight-pill">Free to read</span>
              <span className="highlight-pill">Print available</span>
              <span className="highlight-pill">Digital PDF</span>
              <span className="highlight-pill">20+ contributors</span>
            </div>

            <div className="issue-share">
              <span className="label">Share</span>
              <button className="share-btn" onClick={() => handleToast('Share on X')} aria-label="Share on X">𝕏</button>
              <button className="share-btn" onClick={() => handleToast('Share on Instagram')} aria-label="Share on Instagram">◐</button>
              <button className="share-btn" onClick={() => handleToast('Share on LinkedIn')} aria-label="Share on LinkedIn">in</button>
              <button className="share-btn" onClick={() => handleToast('Copy link')} aria-label="Copy link">⧉</button>
            </div>
          </div>

        </div>
      </section>

      {/* PRINT EDITION */}
      <section className="container">
        <div className="print-edition">

          <div className="print-img-wrap">
            <div className="print-img">
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="Print Edition Cover" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '24px', fontWeight: 'bold', color: '#666'}}>TRENDORABAY</span>
                </div>
              )}
            </div>
          </div>

          <div className="print-text">
            <div className="eyebrow">Physical Edition</div>
            <h2>Get the print copy.</h2>
            <p>There's nothing quite like holding the story in your hands. {magazine.issue || '001'} is available in a premium, perfect-bound physical edition — designed to be read slowly, kept on your shelf, and revisited for years.</p>

            <div className="print-specs">
              <div>64 pages of premium matte paper</div>
              <div>Perfect-bound spine, A4 size</div>
              <div>Free delivery in Nairobi</div>
              <div>Nationwide shipping available</div>
            </div>

            <div className="print-price-row">
              <span className="print-price">{formatPrice(magazine.printPrice || 1500)}</span>
              <span className="print-price-note">Incl. taxes & delivery</span>
            </div>

            <div className="print-actions">
              <button className="btn-print" onClick={() => handleToast('Added to cart')}>
                Add to cart →
              </button>
              <button className="btn-print-outline" onClick={() => handleToast('Viewing cart')}>
                View cart
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED STORIES (CAROUSEL) */}
      <section className="section">
        <div className="container">
          <div className="carousel-header">
            <div className="section-head">
              <div className="eyebrow">Featured in this issue</div>
              <h2>Six stories worth your time.</h2>
              <p>A preview of the pieces inside {magazine.issue || '001'} — swipe to read the full stories.</p>
            </div>

            <div className="carousel-nav">
              <button className="carousel-btn" onClick={() => scrollCarousel(track1Ref, -1)} aria-label="Previous stories">←</button>
              <button className="carousel-btn" onClick={() => scrollCarousel(track1Ref, 1)} aria-label="Next stories">→</button>
            </div>
          </div>

          <div className="carousel-container">
            <div className="carousel-track" ref={track1Ref}>
              {featuredStories.map((story, index) => (
                <article key={index} className="feature-card" onClick={() => handleToast('Opening story')}>
                  <div className="feature-img">
                    <span className="feature-num">{story.num}</span>
                    {magazine.coverImage ? (
                      <img src={magazine.coverImage} alt="" />
                    ) : (
                      <div style={{width: '100%', height: '100%', background: '#e5e5e5'}} />
                    )}
                  </div>
                  <div className="feature-info">
                    <span className="cat">{story.category}</span>
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <div className="meta">
                      <span className="author">{story.author}</span>
                      <span>{story.time}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTRIBUTORS (CAROUSEL) */}
      <section className="section contributors-section">
        <div className="container">
          <div className="carousel-header">
            <div className="section-head">
              <div className="eyebrow">The team</div>
              <h2>People behind {magazine.issue || '001'}.</h2>
              <p>Writers, photographers, editors and designers who brought this issue to life.</p>
            </div>

            <div className="carousel-nav">
              <button className="carousel-btn" onClick={() => scrollCarousel(track2Ref, -1)} aria-label="Previous contributors">←</button>
              <button className="carousel-btn" onClick={() => scrollCarousel(track2Ref, 1)} aria-label="Next contributors">→</button>
            </div>
          </div>

          <div className="carousel-container">
            <div className="carousel-track" ref={track2Ref}>
              {contributors.map((contributor, index) => (
                <div key={index} className="contributor-card" onClick={() => handleToast('Opening profile')}>
                  <div className="avatar"><img src={contributor.avatar} alt="" /></div>
                  <h3>{contributor.name}</h3>
                  <div className="role">{contributor.role}</div>
                  <p>{contributor.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREVIEW SPREADS */}
      <section className="section preview-section">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow">A look inside</div>
            <h2>Preview the spreads.</h2>
            <p>Three sample pages from {magazine.issue || '001'} — designed to be read slowly.</p>
          </div>

          <div className="preview-grid">
            <div className="preview-card" onClick={() => handleToast('Opening preview')}>
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5'}} />
              )}
              <span className="preview-page-num">Page 12</span>
            </div>
            <div className="preview-card" onClick={() => handleToast('Opening preview')}>
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5'}} />
              )}
              <span className="preview-page-num">Page 28</span>
            </div>
            <div className="preview-card" onClick={() => handleToast('Opening preview')}>
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5'}} />
              )}
              <span className="preview-page-num">Page 44</span>
            </div>
          </div>
        </div>
      </section>

      {/* PREV / NEXT ISSUE NAV */}
      <section className="container">
        <div className="issue-nav">
          <div className="issue-nav-card" onClick={() => handleToast('Opening previous issue')}>
            <div className="thumb">
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5'}} />
              )}
            </div>
            <div className="info">
              <div className="label">← Previous</div>
              <div className="title">Issue 000 — Pilot</div>
            </div>
          </div>
          <div className="issue-nav-card next" onClick={() => handleToast('Opening next issue')}>
            <div className="thumb">
              {magazine.coverImage ? (
                <img src={magazine.coverImage} alt="" />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#e5e5e5'}} />
              )}
            </div>
            <div className="info">
              <div className="label">Next →</div>
              <div className="title">Issue 002 — Coming June</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="container" style={{marginTop: '40px'}}>
        <div className="cta-banner">
          <div>
            <div style={{fontSize: '11px', fontWeight: '800', letterSpacing: '.18em', textTransform: 'uppercase', color: '#888', marginBottom: '14px'}}>Subscribe free</div>
            <h2>Get every issue the moment it drops.</h2>
            <p>Subscribe for free and we'll send you each new issue, plus occasional deep dives and creator spotlights.</p>
          </div>
          <button className="white-btn" onClick={() => handleToast('Opening subscribe form')}>Subscribe free →</button>
        </div>
      </section>

      {showToast && (
        <div className="toast show">{toastMessage}</div>
      )}
    </div>
  );
};

export default MagazineDetails;
