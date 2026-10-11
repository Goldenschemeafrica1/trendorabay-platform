import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import api from '../../services/api';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
  const { slug } = useParams();
  const { user } = useSelector(state => state.auth);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch story first
        const storyRes = await api.get(`/stories/${slug}`);
        const storyData = storyRes.data.data;
        setStory(storyData);

        // Check if user has already viewed this story (one-time view per user)
        const viewKey = `story_view_${storyData.id}`;
        const hasViewed = localStorage.getItem(viewKey);

        // Only increment view count if user hasn't viewed this story before
        if (!hasViewed) {
          try {
            await api.post(`/stories/${storyData.id}/view`);
            localStorage.setItem(viewKey, 'true');
          } catch (viewErr) {
            console.error('Failed to increment view count:', viewErr.message);
          }
        }

        // Then fetch likes and comments using story ID
        const [likesRes, commentsRes] = await Promise.all([
          api.get(`/stories/${storyData.id}/likes`),
          api.get(`/stories/${storyData.id}/comments`)
        ]);

        setLikeCount(likesRes.data.likes || 0);
        setComments(commentsRes.data.data || []);
      } catch (err) {
        console.error('Failed to load story data:', err.message);
        if (err.response?.status === 404) {
          setError('Story not found');
        } else {
          setError('Failed to load story');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleLike = async () => {
    // Debug: Log user object structure
    if (import.meta.env.DEV) {
      console.log('Full user object from Redux:', user);
      console.log('User ID from user.id:', user?.id);
      console.log('User ID from user.user?.id:', user?.user?.id);
      console.log('Is authenticated:', !!user);
    }

    const userId = user?.id || user?.user?.id;

    if (!userId) {
      if (import.meta.env.DEV) {
        console.error('No user ID found. User object:', user);
        console.error('Keys in user object:', user ? Object.keys(user) : 'user is null/undefined');

        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('trendorabay-user');
        if (import.meta.env.DEV) {
          console.log('Stored user in localStorage:', storedUser);
        }
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (import.meta.env.DEV) {
            console.log('Parsed stored user:', parsedUser);
            console.log('Parsed user ID:', parsedUser?.id || parsedUser?.user?.id);
          }
        } catch (e) {
          if (import.meta.env.DEV) {
            console.error('Failed to parse stored user:', e);
          }
        }
      }

      // Save current URL for redirect after login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    try {
      if (import.meta.env.DEV) {
        console.log('Attempting to like story - User ID:', userId);
        console.log('Token in localStorage:', !!localStorage.getItem('authToken'));
        console.log('User object:', user);
      }

      const res = await api.post(`/stories/${story.id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to like story:', err);
        console.error('Error details:', {
          status: err.response?.status,
          message: err.message,
          data: err.response?.data
        });
      }
      if (err.response?.status === 401) {
        // Check if token exists
        const token = localStorage.getItem('authToken');
        console.error('401 Error - Token exists:', !!token);
        if (!token) {
          alert('You are not logged in. Please log in to like stories.');
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
          window.location.href = '/login';
        } else {
          alert('Authentication error. Please try logging in again.');
        }
      } else if (err.response?.status === 403) {
        alert('You do not have permission to like this story.');
      } else if (err.response?.status === 404) {
        alert('Story not found.');
      } else {
        alert('Failed to like story. Please try again.');
      }
    }
  };

  const handleShare = async () => {
    // Strip HTML tags from content for sharing
    const stripHtml = (html) => {
      if (!html) return '';
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    const shareText = story.excerpt || stripHtml(story.content)?.substring(0, 200);

    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Failed to share:', err.message);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user?.id) {
      alert('Please log in to comment');
      return;
    }

    try {
      const res = await api.post(`/stories/${story.id}/comments`, {
        content: commentText
      });
      setComments(prev => [...prev, res.data.data]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err.message);
      alert('Failed to post comment. Please try again.');
    }
  };

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
  if (error || !story) return (
    <div className="story-detail-error">
      <h2>Story Not Found</h2>
      <p>The story you're looking for doesn't exist or has been removed.</p>
      <Link to="/stories" className="back-link">← Browse all stories</Link>
    </div>
  );

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

      {/* Action Bar */}
      <div className="story-detail-actions">
        <button
          className={`story-action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="action-icon">{liked ? '❤️' : '🤍'}</span>
          <span className="action-count">{likeCount}</span>
        </button>
        <button
          className="story-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="action-icon">💬</span>
          <span className="action-count">{comments.length}</span>
        </button>
        <button
          className="story-action-btn"
          onClick={handleShare}
        >
          <span className="action-icon">📤</span>
          <span className="action-label">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="story-detail-comments">
          <h3>Comments ({comments.length})</h3>

          {/* Comment Form */}
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <button type="submit" className="comment-submit">
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => {
                const displayName = comment.username || comment.email?.split('@')[0] || 'Anonymous';

                return (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <strong>{displayName}</strong>
                      <span className="comment-date">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <Link to="/" className="story-detail-back">
        ← Back to home
      </Link>
    </section>
  );
};

export default StoryDetailPage;
