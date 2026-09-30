import { Link } from 'react-router-dom';

const HeroSection = ({ heroStory, latestStories }) => {
  return (
    <section id="nl-hero" className="hero-stories">
      <div className="hero-stories-content">
        <span className="hero-stories-kicker">TRENDORABAY • STORIES</span>
        <h1>
          STORIES THAT
          <br />
          SHAPE <span>AFRICA&apos;S</span>
          <br />
          NEXT CHAPTER.
        </h1>
        <p>
          Real people. Bold ideas. The businesses, culture and innovation writing Africa&apos;s
          tomorrow — told with depth and style.
        </p>
        <div className="hero-stories-buttons">
          <Link to="/stories" className="hero-stories-btn-primary">
            READ LATEST STORIES →
          </Link>
          <Link to="/stories" className="hero-stories-btn-secondary">
            BROWSE BY TOPIC
          </Link>
        </div>
      </div>

      <div className="hero-stories-visual">
        <div className="hero-stories-feature">
          <div className="hero-stories-feature-tag">FEATURED STORY</div>
          <div>
            <h2>The Future of Health: Why Prevention Is Becoming the Most Powerful Medicine</h2>
            <p>Founders, creators and innovators turning bold ideas into real impact.</p>
            <Link
              to={heroStory?.slug ? `/stories/${heroStory.slug}` : '/stories'}
            >
              READ THE STORY →
            </Link>
          </div>
        </div>

        <div className="hero-stories-strip">
          {latestStories.slice(0, 2).map((story) => (
            <Link
              key={story.id || story.title}
              to={story.slug ? `/stories/${story.slug}` : '/stories'}
              className="hero-stories-mini"
            >
              <span className="hero-stories-mini-tag">
                {(story.tag || 'STORY').toUpperCase()}
              </span>
              <strong>{story.title}</strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
