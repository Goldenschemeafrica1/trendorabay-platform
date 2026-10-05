import { Link } from 'react-router-dom';

const HeroSection = ({ heroStory, latestStories }) => {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">Stories · Style · Solutions</div>
          <h1>The home of <em>Africa's creators.</em></h1>
          <p>Trendorabay is where Africa's stories are told, its products are discovered, and its opportunities are shared. A magazine, a marketplace, and a community — all in one place.</p>
          <div className="hero-cta">
            <Link to="/store" className="dark-btn">Explore the store</Link>
            <Link to="/stories" className="light-btn">Read the magazine</Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="tile ta"><img src="/hero.jpeg" alt="African fashion" /></div>
          <div className="tile tb"><img src="/hero1.jpeg" alt="Creator" /></div>
          <div className="tile tc"><img src="/hero2.jpeg" alt="Art" /></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
