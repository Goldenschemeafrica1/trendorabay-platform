import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './InnovationPage.css';

const InnovationPage = () => {
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const spotlightsTrackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [innovationStories, setInnovationStories] = useState([]);
  const [featuredInnovation, setFeaturedInnovation] = useState(null);
  const [loading, setLoading] = useState(true);

  const showToast = (msg) => {
    setToastMsg(msg);
    toast(msg);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    showToast('Subscribed! Check your inbox to confirm.');
    setEmail('');
  };

  const scrollSpotlights = (dir) => {
    if (!spotlightsTrackRef.current) return;
    const track = spotlightsTrackRef.current;
    const card = track.querySelector('.spotlight');
    if (!card) return;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 14;
    const step = card.offsetWidth + gap;
    const perView = Math.max(1, Math.floor((track.clientWidth + step * 0.1) / step));
    track.scrollBy({ left: dir * step * perView, behavior: 'smooth' });
  };

  const updateScrollButtons = () => {
    if (!spotlightsTrackRef.current) return;
    const track = spotlightsTrackRef.current;
    const max = track.scrollWidth - track.clientWidth - 2;
    setCanScrollLeft(track.scrollLeft > 2);
    setCanScrollRight(track.scrollLeft < max);
  };

  useEffect(() => {
    const track = spotlightsTrackRef.current;
    if (track) {
      track.addEventListener('scroll', updateScrollButtons, { passive: true });
      window.addEventListener('resize', updateScrollButtons);
      updateScrollButtons();
    }
    return () => {
      if (track) {
        track.removeEventListener('scroll', updateScrollButtons);
      }
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  useEffect(() => {
    const fetchInnovationStories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stories/doctor-ink-in-the-world-of-tattoos');
        const story = response.data.data;

        if (story) {
          console.log('Story data:', story);
          console.log('Featured image URL:', story.featured_image_url);
          console.log('Image URL type:', typeof story.featured_image_url);
          console.log('Author data:', story.author);
          console.log('Author name:', story.author?.name || story.authorName || story.author_name);
          console.log('Setting featured innovation with authorName:', story.authorName);
          setFeaturedInnovation(story);
        }
      } catch (error) {
        console.error('Failed to fetch innovation story:', error);
        toast.error('Failed to load innovation story');
      } finally {
        setLoading(false);
      }
    };

    fetchInnovationStories();
  }, []);

  const sectors = [
    { name: 'Fintech & Payments', desc: 'Mobile money, digital banking and payment infrastructure rebuilding how Africa transacts.', count: '32 stories' },
    { name: 'AgriTech', desc: 'From AI-powered farming to cold-chain logistics — feeding a growing continent.', count: '24 stories' },
    { name: 'HealthTech', desc: 'Telemedicine, diagnostics and health data platforms expanding care to the last mile.', count: '18 stories' },
    { name: 'EdTech', desc: 'Learning platforms, upskilling tools and digital classrooms reaching millions of students.', count: '15 stories' },
    { name: 'Climate Tech', desc: 'Solar, water, carbon markets and climate-resilient infrastructure for a warming continent.', count: '21 stories' },
    { name: 'Creative Tech', desc: 'Design tools, media platforms and creator economies reshaping African storytelling.', count: '27 stories' },
  ];

  const spotlights = [
    { tag: 'Fintech', title: 'Kora Pay — payments for the informal economy.', desc: 'A Lagos startup giving small merchants the tools to accept digital payments without a bank account.', founder: 'Ada Obi', location: 'Lagos, NG', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=85' },
    { tag: 'AgriTech', title: 'Shamba Sense — sensors that save water and crops.', desc: 'Nairobi-based hardware that monitors soil health in real time and alerts farmers before drought hits.', founder: 'Wanjiru Kamau', location: 'Nairobi, KE', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=85' },
    { tag: 'HealthTech', title: 'Rafiki Health — remote care for rural clinics.', desc: 'A platform connecting rural clinics with urban specialists through low-bandwidth video consultations.', founder: 'Dr. Kojo Mensah', location: 'Accra, GH', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=85' },
    { tag: 'Climate', title: 'SunBox — off-grid solar for the last mile.', desc: 'Affordable pay-as-you-go solar systems bringing electricity to communities beyond the grid.', founder: 'Neema Joseph', location: 'Dar es Salaam, TZ', img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=85' },
    { tag: 'EdTech', title: 'Ubuntu Learn — bootcamps that place grads.', desc: 'An edtech platform with a 92% job placement rate for graduates of its 6-month engineering programs.', founder: 'Tunde Adeyemi', location: 'Lagos, NG', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=85' },
    { tag: 'Creative', title: 'Kito Studio — tools for African animators.', desc: 'A creative tooling studio building animation software tailored for African aesthetics and workflows.', founder: 'Zainab Ali', location: 'Cape Town, ZA', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=85' },
  ];

  return (
    <main className="innovation-page">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Innovation</div>
            <h1>Ideas building <em>Africa's next chapter.</em></h1>
            <p>From fintech rails to agritech breakthroughs, from creative tech to climate solutions — we cover the entrepreneurs, inventors and startups reshaping what Africa can become.</p>
            <div className="hero-cta">
              <button className="dark-btn" onClick={() => document.getElementById('sectors').scrollIntoView({ behavior: 'smooth' })}>Explore sectors</button>
              <button className="light-btn" onClick={() => document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })}>Featured innovation</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="tile ta"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85" alt="Technology" /></div>
            <div className="tile tb"><img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=85" alt="Creators" /></div>
            <div className="tile tc"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=85" alt="Teamwork" /></div>
          </div>
        </div>
      </section>

      {/* FEATURED INNOVATION */}
      <section className="section" id="featured" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="section-head-left">
            <div>
              <div className="eyebrow">Featured innovation</div>
              <h2>This month's spotlight.</h2>
            </div>
            {featuredInnovation && (
              <Link className="link" to={`/stories/${featuredInnovation.slug}`}>Read the full story</Link>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : featuredInnovation ? (
            <article className="featured-innovation" onClick={() => window.location.href = `/stories/${featuredInnovation.slug}`}>
              <div className="featured-img">
                <span className="featured-badge">Innovation of the month</span>
                {featuredInnovation.featured_image_url && (typeof featuredInnovation.featured_image_url === 'string' || Array.isArray(featuredInnovation.featured_image_url)) ? (
                  <img
                    src={Array.isArray(featuredInnovation.featured_image_url) ? featuredInnovation.featured_image_url[0] : featuredInnovation.featured_image_url.split(',')[0].trim()}
                    alt={featuredInnovation.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = '#e5e5e5';
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#666' }}>
                    TRENDORABAY
                  </div>
                )}
              </div>
              <div className="featured-info">
                <div className="eyebrow">{featuredInnovation.category_name || featuredInnovation.categoryName || 'Innovation'} · Kenya</div>
                <h2>{featuredInnovation.title}</h2>
                <p>{featuredInnovation.content?.replace(/<[^>]*>/g, '').substring(0, 200)}...</p>
                <div className="featured-meta">
                  <div className="avatar">
                    {featuredInnovation.author_avatar || featuredInnovation.authorAvatar ? (
                      <img src={featuredInnovation.author_avatar || featuredInnovation.authorAvatar} alt="" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#666' }}>
                        {(featuredInnovation.author_name || featuredInnovation.authorName || 'A').charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="author">
                    <strong>{featuredInnovation.author_name || featuredInnovation.authorName || 'Author'}</strong>
                    <span>Innovation Editor</span>
                  </div>
                  <span className="dot"></span>
                  <span>{featuredInnovation.readTime || featuredInnovation.read_time || '5 min read'}</span>
                </div>
              </div>
            </article>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>No featured innovation story found</div>
          )}
        </div>
      </section>

      {/* SECTORS */}
      <section className="section sectors" id="sectors">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Explore sectors</div>
            <h2>The areas where Africa is innovating fastest.</h2>
            <p>We cover innovation across every corner of the continent — from Silicon Savannah to Lagos to Cape Town.</p>
          </div>

          <div className="sectors-grid">
            {sectors.map((sector, index) => (
              <div key={index} className="sector" onClick={() => showToast(`Opening ${sector.name} stories`)}>
                <h3>{sector.name}</h3>
                <p>{sector.desc}</p>
                <div className="count">{sector.count}</div>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPOTLIGHTS (carousel) */}
      <section className="section">
        <div className="container">
          <div className="section-head-left">
            <div>
              <div className="eyebrow">Startup spotlight</div>
              <h2>Innovators to watch.</h2>
            </div>
            <div className="spotlight-nav">
              <button className="nav-btn" aria-label="Previous spotlights" disabled={!canScrollLeft} onClick={() => scrollSpotlights(-1)}>←</button>
              <button className="nav-btn" aria-label="Next spotlights" disabled={!canScrollRight} onClick={() => scrollSpotlights(1)}>→</button>
            </div>
          </div>

          <div className="spotlights-track" ref={spotlightsTrackRef}>
            {spotlights.map((spot, index) => (
              <article key={index} className="spotlight" onClick={() => showToast('Opening spotlight')}>
                <div className="spotlight-img">
                  <span className="spotlight-tag">{spot.tag}</span>
                  <img src={spot.img} alt="" />
                </div>
                <div className="spotlight-info">
                  <h3>{spot.title}</h3>
                  <p>{spot.desc}</p>
                  <div className="meta">
                    <span className="founder">{spot.founder}</span>
                    <span>{spot.location}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="newsletter">
            <div className="eyebrow">Stay informed</div>
            <h2>Innovation stories, every Friday.</h2>
            <p>Get the best of African innovation — new startups, deep dives and hidden breakthroughs — straight to your inbox.</p>
            <form onSubmit={handleSubscribe}>
              <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit">Subscribe free</button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <div className="eyebrow" style={{ color: '#aaa' }}>Building something?</div>
              <h2>Have an innovation story we should cover?</h2>
              <p>Tell us what you're building, why it matters and who it's for. We're always looking for the next breakthrough.</p>
            </div>
            <button className="white-btn" onClick={() => showToast('Opening pitch form')}>Pitch us your story →</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default InnovationPage;
