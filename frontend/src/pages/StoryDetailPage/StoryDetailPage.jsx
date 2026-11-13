import { useEffect, useMemo, useState, useRef } from 'react';
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
  const [toast, setToast] = useState({ show: false, message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [relatedStories, setRelatedStories] = useState([]);
  const [readProgress, setReadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const relatedTrackRef = useRef(null);
  const toastTimerRef = useRef(null);

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

        // Fetch related stories (by category)
        try {
          const categoryId = storyData.category_id;
          if (categoryId) {
            const relatedRes = await api.get(`/stories?category=${categoryId}&limit=6`);
            // Filter out the current story
            const filtered = (relatedRes.data.data || []).filter(s => s.id !== storyData.id).slice(0, 6);
            setRelatedStories(filtered);
          } else {
            // Fallback to latest stories if no category
            const relatedRes = await api.get(`/stories?limit=6`);
            const filtered = (relatedRes.data.data || []).filter(s => s.id !== storyData.id).slice(0, 6);
            setRelatedStories(filtered);
          }
        } catch (relatedErr) {
          console.error('Failed to load related stories:', relatedErr.message);
        }
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

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.pageYOffset || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
      setReadProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.share-wrap')) {
        setShowShare(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowShare(false);
      }
    };

    if (showShare) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showShare]);

  // Toast notification
  const showToast = (message) => {
    setToast({ show: true, message });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2400);
  };

  const handleLike = async () => {
    const userId = user?.id || user?.user?.id;

    if (!userId) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    try {
      const res = await api.post(`/stories/${story.id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likes);
      if (res.data.liked) {
        showToast('Thanks for the love ❤');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert('You are not logged in. Please log in to like stories.');
          localStorage.setItem('redirectAfterLogin', window.location.pathname);
          window.location.href = '/login';
        } else {
          alert('Authentication error. Please try logging in again.');
        }
      } else {
        alert('Failed to like story. Please try again.');
      }
    }
  };

  const handleShare = async (platform = null) => {
    // Share via the OG endpoint so link previews include the story image
    const shareUrl = `${window.location.origin}/share/story/${story.slug || slug}`;
    const shareText = story.title || 'Check out this story on Trendorabay';

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link copied to clipboard');
      } catch (err) {
        showToast('Could not copy link');
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Failed to share:', err.message);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!');
    }
    setShowShare(false);
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
      showToast('Comment posted');
    } catch (err) {
      console.error('Failed to post comment:', err.message);
      alert('Failed to post comment. Please try again.');
    }
  };

  // Split content into exactly 2 pages and insert images
  const pagesContent = useMemo(() => {
    if (!story) return ['', ''];
    const sanitized = DOMPurify.sanitize(story.content || '');

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'text/html');
    const body = doc.body;
    const children = Array.from(body.children);

    // Split content into 2 pages (roughly half each)
    const midPoint = Math.ceil(children.length / 2);
    const page1Children = children.slice(0, midPoint);
    const page2Children = children.slice(midPoint);

    // Get all available images (skip the first hero image)
    const allImages = story.featured_image_url?.slice(1) || [];
    const totalImages = allImages.length;

    // Distribute images evenly between pages
    const page1ImageCount = Math.ceil(totalImages / 2);
    const page1Images = allImages.slice(0, page1ImageCount);
    const page2Images = allImages.slice(page1ImageCount);

    // Calculate insertion positions based on number of images
    const getPositions = (total, imageCount) => {
      if (imageCount === 0) return [];
      if (imageCount === 1) return [Math.floor(total * 0.5)];
      if (imageCount === 2) return [Math.floor(total * 0.33), Math.floor(total * 0.66)];
      if (imageCount === 3) return [0, Math.floor(total * 0.5), Math.max(0, total - 2)];
      // For 4 or more images
      return [
        0,
        Math.floor(total * 0.35),
        Math.floor(total * 0.65),
        Math.max(0, total - 2),
      ].slice(0, imageCount);
    };

    // Insert images into page 1
    const page1Div = document.createElement('div');
    page1Children.forEach(child => page1Div.appendChild(child.cloneNode(true)));

    if (page1Images.length > 0) {
      const page1ChildrenList = Array.from(page1Div.children);
      const total1 = page1ChildrenList.length;
      const positions1 = getPositions(total1, page1Images.length);

      for (let i = page1Images.length - 1; i >= 0; i--) {
        const target = positions1[i];
        const el = page1ChildrenList[target];
        if (el) {
          const img = document.createElement('img');
          img.src = page1Images[i];
          img.alt = `${story.title} ${i + 2}`;
          img.className = i === page1Images.length - 1
            ? 'story-detail-inline-last'
            : (i % 2 === 0 ? 'story-detail-inline-left' : 'story-detail-inline-right');
          el.after(img);
        }
      }
    }

    // Insert images into page 2
    const page2Div = document.createElement('div');
    page2Children.forEach(child => page2Div.appendChild(child.cloneNode(true)));

    if (page2Images.length > 0) {
      const page2ChildrenList = Array.from(page2Div.children);
      const total2 = page2ChildrenList.length;
      const positions2 = getPositions(total2, page2Images.length);

      for (let i = page2Images.length - 1; i >= 0; i--) {
        const target = positions2[i];
        const el = page2ChildrenList[target];
        if (el) {
          const img = document.createElement('img');
          img.src = page2Images[i];
          img.alt = `${story.title} ${i + page1ImageCount + 2}`;
          img.className = i === page2Images.length - 1
            ? 'story-detail-inline-last'
            : (i % 2 === 0 ? 'story-detail-inline-left' : 'story-detail-inline-right');
          el.after(img);
        }
      }
    }

    return [page1Div.innerHTML, page2Div.innerHTML];
  }, [story]);

  // Update total pages when content changes
  useEffect(() => {
    setTotalPages(2);
  }, []);

  // Reset to page 1 when story changes
  useEffect(() => {
    setCurrentPage(1);
  }, [slug]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Scroll to top of current page when page changes
  useEffect(() => {
    const pageElement = document.getElementById(`page-${currentPage}`);
    if (pageElement) {
      const top = pageElement.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Helper functions
  const getInitials = (name) => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    const initials = parts.map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return initials || 'A';
  };

  const timeAgo = (timestamp) => {
    const s = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (s < 45) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return m + 'm ago';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h ago';
    const d = Math.floor(h / 24);
    if (d < 7) return d + 'd ago';
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const scrollRelated = (direction) => {
    if (!relatedTrackRef.current) return;
    const card = relatedTrackRef.current.querySelector('.related-card');
    if (!card) return;
    const gap = 14;
    const step = card.offsetWidth + gap;
    const perView = Math.max(1, Math.floor((relatedTrackRef.current.clientWidth + step * 0.1) / step));
    relatedTrackRef.current.scrollBy({ left: direction * step * perView, behavior: 'smooth' });
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    if (!content) return '5 min read';
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) return <div className="story-detail-loading">Loading...</div>;
  if (error || !story) return (
    <div className="story-detail-error">
      <h2>Story Not Found</h2>
      <p>The story you're looking for doesn't exist or has been removed.</p>
      <Link to="/stories" className="back-link">← Browse all stories</Link>
    </div>
  );

  const heroImage = story.featured_image_url?.[0] || story.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=85';
  const authorAvatar = story.author_avatar || 'https://i.pravatar.cc/100?img=12';
  const publishedDate = new Date(story.published_at || story.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="story-detail">
      {/* Reading Progress Bar */}
      <div className="read-progress" style={{ width: `${readProgress}%` }}></div>

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>

      {/* STORY HERO */}
      <section className="story-hero">
        <div className="narrow">
          <div className="eyebrow">
            {story.category_name || 'Story'}
            {story.country && <span> • {story.country}</span>}
          </div>
          <h1>{story.title}</h1>
          <p className="dek">{story.excerpt || story.description || ''}</p>
        </div>

        {/* centered hero image */}
        <div className="hero-wrap">
          <figure className="hero-figure">
            <div className="frame">
              <img src={heroImage} alt={story.title} />
            </div>
          </figure>
        </div>

        {/* ARTICLE METADATA */}
        <div className="article-metadata">
          <div className="narrow">
            <div className="metadata-row">
              <div className="author-info">
                <img src={authorAvatar} alt={story.author_name || 'Author'} className="author-avatar" />
                <div className="author-details">
                  <span className="author-name">{story.author_name || 'Trendorabay'}</span>
                  <span className="author-label">Author</span>
                </div>
              </div>
              <div className="metadata-items">
                <div className="metadata-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metadata-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{publishedDate}</span>
                </div>
                <div className="metadata-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metadata-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{story.readTime || story.read_time || calculateReadingTime(story.content)}</span>
                </div>
                <div className="metadata-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metadata-icon">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{story.views || 0} views</span>
                </div>
                <div className="metadata-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metadata-icon">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                  <span>{story.category_name || 'Story'}</span>
                </div>
                {story.country && (
                  <div className="metadata-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="metadata-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M2 12h20"></path>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span>{story.country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      {pagesContent.map((pageContent, index) => (
        <section
          key={index}
          className={`story-page ${currentPage === index + 1 ? 'active' : ''}`}
          id={`page-${index + 1}`}
        >
          <article className="article-body">
            <div className="narrow">
              <div
                className="story-detail-body"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />

              {/* PAGER */}
              <div className="pager">
                <div className="pager-info">Page <strong>{index + 1}</strong> of {totalPages}</div>
                <div className="page-dots">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`page-dot ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => goToPage(i + 1)}
                      aria-label={`Page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* FINISH READING BUTTON - only show on last page */}
              {currentPage === totalPages && (
                <div className="finish-reading-wrapper">
                  <button
                    type="button"
                    className="finish-reading-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Finish reading
                  </button>
                </div>
              )}

              {/* AUTHOR CARD - only show on last page */}
              {currentPage === totalPages && (
                <div className="author-card">
                  <div className="avatar">
                    <img src={authorAvatar} alt={story.author_name || 'Author'} />
                  </div>
                  <div>
                    <h3>{story.author_name || 'Trendorabay'}</h3>
                    <p>{story.author_bio || 'Writer and editor at Trendorabay, covering stories that matter.'}</p>
                  </div>
                </div>
              )}
            </div>
          </article>
        </section>
      ))}

      {/* ENGAGEMENT: LIKE / COMMENT / SHARE */}
      <section className="engage-section">
        <div className="narrow">
          <div className="engage-bar" role="group" aria-label="Story actions">
            <button
              className={`engage-btn ${liked ? 'active' : ''}`}
              type="button"
              aria-pressed={liked}
              aria-label="Like this story"
              onClick={handleLike}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/>
              </svg>
              <span className="eng-label">Like</span>
              <span className="eng-count">{likeCount}</span>
            </button>

            <button
              className="engage-btn"
              type="button"
              aria-expanded={showComments}
              aria-controls="commentPanel"
              aria-label="Show comments"
              onClick={() => setShowComments(!showComments)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.8-.8L3 21l1.9-5.2a8.4 8.4 0 0 1-.8-3.8 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.5 8.5z"/>
              </svg>
              <span className="eng-label">Comment</span>
              <span className="eng-count">{comments.length}</span>
            </button>

            <div className="share-wrap">
              <button
                className="engage-btn"
                type="button"
                aria-expanded={showShare}
                aria-controls="shareMenu"
                aria-label="Share this story"
                onClick={() => setShowShare(!showShare)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <span className="eng-label">Share</span>
              </button>

              {showShare && (
                <div className="share-menu" id="shareMenu">
                  <button type="button" onClick={() => handleShare('whatsapp')}>
                    <span className="dot-icon"></span>WhatsApp
                  </button>
                  <button type="button" onClick={() => handleShare('twitter')}>
                    <span className="dot-icon"></span>X (Twitter)
                  </button>
                  <button type="button" onClick={() => handleShare('facebook')}>
                    <span className="dot-icon"></span>Facebook
                  </button>
                  <button type="button" onClick={() => handleShare('copy')}>
                    <span className="dot-icon"></span>Copy link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* COMMENT PANEL */}
          {showComments && (
            <div className="comment-panel" id="commentPanel">
              <h3>Join the conversation</h3>

              <form className="comment-form" onSubmit={handleSubmitComment}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts…"
                  rows={3}
                  maxLength={600}
                  required
                />
                <button type="submit" className="comment-submit-btn">Post comment</button>
              </form>

              <div className="comment-list">
                {comments.length === 0 ? (
                  <p className="comment-empty">No comments yet — be the first to share a thought.</p>
                ) : (
                  comments.map((comment) => {
                    const displayName = comment.username || comment.email?.split('@')[0] || 'Anonymous';

                    return (
                      <div key={comment.id} className="comment">
                        <div className="c-avatar">{getInitials(displayName)}</div>
                        <div className="c-body">
                          <div className="c-top">
                            <span className="c-name">{displayName}</span>
                            <span className="c-time">{timeAgo(comment.created_at)}</span>
                          </div>
                          <p className="c-text">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RELATED STORIES (compact carousel) */}
      <section className="related">
        <div className="container">
          <div className="related-head">
            <div>
              <div className="eyebrow">Keep reading</div>
              <h2>More from {story.category_name || 'Trendorabay'}.</h2>
            </div>
            {relatedStories.length > 1 && (
              <div className="related-nav">
                <button
                  className="nav-btn"
                  aria-label="Previous related stories"
                  onClick={() => scrollRelated(-1)}
                >
                  ←
                </button>
                <button
                  className="nav-btn"
                  aria-label="Next related stories"
                  onClick={() => scrollRelated(1)}
                >
                  →
                </button>
              </div>
            )}
          </div>

          <div className="related-track" ref={relatedTrackRef}>
            {relatedStories.length > 0 ? (
              relatedStories.map((relatedStory) => (
                <Link
                  key={relatedStory.id}
                  to={`/stories/${relatedStory.slug}`}
                  className="related-card"
                >
                  <div className="img">
                    <img
                      src={relatedStory.imageUrl || relatedStory.featured_image_url?.[0] || relatedStory.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=85'}
                      alt={relatedStory.title}
                    />
                  </div>
                  <div className="body">
                    <div className="tag">{relatedStory.category_name || 'Story'}</div>
                    <h3>{relatedStory.title}</h3>
                    <p>{relatedStory.excerpt || relatedStory.description || ''}</p>
                    <div className="meta">
                      {calculateReadingTime(relatedStory.content)}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No related stories available</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoryDetailPage;
