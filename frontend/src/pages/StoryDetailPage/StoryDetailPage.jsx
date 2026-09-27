import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import api from '../../services/api';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${slug}`);
        setStory(res.data.data);
      } catch (err) {
        console.error('Failed to load story:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [slug]);

  const contentWithImages = useMemo(() => {
    if (!story) return '';
    const sanitized = DOMPurify.sanitize(story.content || '');
    if (!story.featured_image_url?.length) return sanitized;

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'text/html');
    const body = doc.body;
    const children = Array.from(body.children);
    const images = story.featured_image_url.slice(0, 4);
    const total = children.length;
    const positions = [
      0,
      Math.floor(total * 0.35),
      Math.floor(total * 0.65),
      Math.max(0, total - 2),
    ];

    for (let i = images.length - 1; i >= 0; i--) {
      const target = positions[i];
      const el = children[target];
      if (el) {
        const img = doc.createElement('img');
        img.src = images[i];
        img.alt = `${story.title} ${i + 1}`;
        img.className = i === images.length - 1
          ? 'story-detail-inline-last'
          : (i % 2 === 0 ? 'story-detail-inline-left' : 'story-detail-inline-right');
        el.after(img);
      }
    }

    return body.innerHTML;
  }, [story]);

  if (loading) return <div className="story-detail-loading">Loading...</div>;
  if (!story) return <div className="story-detail-loading">Story not found.</div>;

  return (
    <section className="story-detail">
      <div className="story-detail-header">
        <span className="story-detail-tag">{story.category || 'Story'}</span>
        <h1>{story.title}</h1>
        <p className="story-detail-meta">
          By {story.author_name || 'Trendorabay'} •{' '}
          {new Date(story.published_at || story.created_at).toLocaleDateString()}
        </p>
      </div>
      <div
        className="story-detail-body"
        dangerouslySetInnerHTML={{ __html: contentWithImages }}
      />
      <Link to="/" className="story-detail-back">
        ← Back to home
      </Link>
    </section>
  );
};

export default StoryDetailPage;
