import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => (
  <div className="about-page">
    <main className="container">
      {/* Hero */}
      <section className="about-hero">
        <div>
          <span className="kicker">About Trendorabay</span>
          <h1>
            Africa is writing
            <br />
            what&apos;s <span>next.</span>
          </h1>
          <p>
            Trendorabay is a modern media and opportunity platform telling African stories with
            depth, style and purpose — and connecting a new generation to the opportunities shaping
            the continent&apos;s future.
          </p>
        </div>
        <div className="hero-stat-grid">
          <div className="hero-stat">
            <strong>100+</strong>
            <span>Stories published</span>
          </div>
          <div className="hero-stat">
            <strong>25+</strong>
            <span>Niche communities</span>
          </div>
          <div className="hero-stat">
            <strong>6</strong>
            <span>Countries covered</span>
          </div>
          <div className="hero-stat">
            <strong>2026</strong>
            <span>Just getting started</span>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="mission-grid">
          <div className="mission-visual">
            <div className="mv-brand">TRENDORABAY</div>
            <div className="mv-title">
              THE
              <br />
              AFRICAN
              <br />
              FUTURE.
            </div>
            <div className="mv-bottom">STORIES • STYLE • SOLUTIONS</div>
          </div>
          <div className="mission-copy">
            <span className="kicker">Our Mission</span>
            <h2>To tell Africa&apos;s story on its own terms.</h2>
            <p>
              For too long, Africa&apos;s narrative has been told by others — filtered through
              stereotypes, framed by crisis, reduced to a single story. Trendorabay exists to change
              that.
            </p>
            <p>
              We document the founders, creators, innovators and everyday people building what comes
              next. We celebrate African excellence without ignoring African complexity. And we
              connect a new generation to the opportunities, tools and ideas they need to shape
              their own futures.
            </p>
            <p>
              This is not just a publication. It is a platform — a place where stories meet
              opportunity, where culture meets business, and where Africa&apos;s next chapter is
              written by Africans.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">What guides us</span>
            <h2>✦ Our Values</h2>
          </div>
        </div>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Africa First</h3>
            <p>
              Every story, every opportunity, every decision starts with Africa at the centre. We
              are building for this continent, not about it.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔍</div>
            <h3>Depth &amp; Truth</h3>
            <p>
              We go beyond headlines. We verify, we contextualise, and we tell the full story —
              even when it is complicated.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">⚡</div>
            <h3>Bold &amp; Modern</h3>
            <p>
              We reject the tired, dusty narratives. Our storytelling is fresh, visual, and built
              for how Africa&apos;s youth consume media today.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Opportunity for All</h3>
            <p>
              We believe access to information can change lives. That is why we surface funding,
              jobs, grants and events — and send you straight to the source.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">The platform</span>
            <h2>✦ What We Do</h2>
          </div>
        </div>
        <div className="what-grid">
          <div className="what-card">
            <div className="wc-icon">📰</div>
            <h3>Stories &amp; Journalism</h3>
            <p>
              Long-form features, profiles, analysis and cultural commentary covering business,
              technology, culture, lifestyle and innovation across Africa.
            </p>
            <Link to="/stories">READ LATEST STORIES →</Link>
          </div>
          <div className="what-card">
            <div className="wc-icon">🎯</div>
            <h3>Opportunities Hub</h3>
            <p>
              A curated, verified directory of grants, jobs, scholarships, competitions,
              fellowships and events — always linking you to the official source.
            </p>
            <Link to="/events">FIND OPPORTUNITIES →</Link>
          </div>
          <div className="what-card">
            <div className="wc-icon">🎙</div>
            <h3>Podcasts &amp; Audio</h3>
            <p>
              Honest, in-depth conversations with the founders, creators and change-makers building
              Africa&apos;s next chapter — beyond the headlines.
            </p>
            <Link to="/podcasts">LISTEN NOW →</Link>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">The journey</span>
            <h2>✦ How We Got Here</h2>
          </div>
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <div className="tl-year">2025</div>
            <h3>The idea</h3>
            <p>
              Trendorabay began as a simple frustration: Africa&apos;s stories were being told by
              everyone except Africans. A small team came together with a shared belief — that the
              continent&apos;s next chapter deserved a platform of its own.
            </p>
          </div>
          <div className="timeline-item">
            <div className="tl-year">Early 2026</div>
            <h3>Building the platform</h3>
            <p>
              We launched our editorial, communities, magazine store, merchandise and podcast. We
              started publishing stories about the founders, creators and innovators shaping
              Africa&apos;s future.
            </p>
          </div>
          <div className="timeline-item">
            <div className="tl-year">2026</div>
            <h3>Opportunities launched</h3>
            <p>
              We introduced the Trendorabay Opportunities platform — a curated, verified directory
              connecting Africa&apos;s next generation to funding, jobs, grants, scholarships and
              events.
            </p>
          </div>
          <div className="timeline-item">
            <div className="tl-year">Next</div>
            <h3>The app &amp; beyond</h3>
            <p>
              We are building the Trendorabay mobile app, expanding our community network, and
              growing our editorial team across the continent. This is just the beginning.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="section-head">
          <div>
            <span className="tag">The people</span>
            <h2>✦ Behind Trendorabay</h2>
          </div>
        </div>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">👩🏾‍💻</div>
            <div className="team-info">
              <h3>Amara Okafor</h3>
              <div className="role">Founder &amp; Editor-in-Chief</div>
              <p>
                Journalist and storyteller with a decade of experience covering African business,
                culture and innovation.
              </p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-avatar">👨🏾‍💼</div>
            <div className="team-info">
              <h3>David Mwangi</h3>
              <div className="role">Head of Opportunities</div>
              <p>
                Former startup ecosystem builder connecting African talent to global and local
                opportunities.
              </p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-avatar">👩🏽‍🎨</div>
            <div className="team-info">
              <h3>Zara Diallo</h3>
              <div className="role">Creative Director</div>
              <p>
                Visual designer and brand strategist shaping Trendorabay&apos;s bold, modern
                editorial identity.
              </p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-avatar">👨🏿‍💻</div>
            <div className="team-info">
              <h3>Kofi Mensah</h3>
              <div className="role">Head of Product &amp; Technology</div>
              <p>Engineer and product builder leading the platform&apos;s digital experience and future app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="about-cta">
          <div>
            <span className="kicker" style={{ background: '#111', color: '#fff' }}>
              Join us
            </span>
            <h2>
              Be part of
              <br />
              the story.
            </h2>
            <p>
              Whether you are a reader, a creator, an organisation or an investor — there is a
              place for you in the Trendorabay community.
            </p>
          </div>
          <div className="cta-buttons">
            <Link to="/stories" className="btn-dark">
              READ OUR STORIES
            </Link>
            <Link to="/contact" className="btn-outline-dark">
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default AboutPage;
