import { Link } from 'react-router-dom';

const LatestStories = ({ stories }) => {
  return (
    <section id="nl-latest" className="nl-section">
      <div className="nl-section-head">
        <h2>✦ Latest Stories</h2>
        <Link to="/stories">VIEW ALL →</Link>
      </div>
      <div className="nl-trending">
        {stories.map((story) => (
          <Link
            key={story.id || story.title}
            to={story.slug ? `/stories/${story.slug}` : '/stories'}
            className="nl-story-link"
          >
            <article className="nl-story-card">
              <div className="nl-card-img">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="nl-card-media"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                {story.imgLabel}
              </div>
              <div className="nl-card-body">
                <span className="nl-tag">{story.tag}</span>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
                <div className="nl-meta">{story.meta}</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestStories;
