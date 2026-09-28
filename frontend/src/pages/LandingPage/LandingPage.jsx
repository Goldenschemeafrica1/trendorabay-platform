import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import podcastService from '../../services/podcastService';
import './LandingPage.css';

const initialLatestStories = [
  { imgLabel: 'BUSINESS / FEATURE', image: '/womeninbusiness.jpeg', tag: 'Business', title: 'The startups quietly solving everyday African problems.', excerpt: 'Ideas becoming practical solutions.', meta: '6 min read' },
  { imgLabel: 'CULTURE / MUSIC', image: '/matatuculture.jpeg', tag: 'Culture', title: 'How Nairobi’s new sound is crossing borders.', excerpt: 'The artists defining the next wave.', meta: '5 min read' },
  { imgLabel: 'TECH / AI', image: '/gamers.jpeg', tag: 'Innovation', title: 'AI is changing how Africa’s young builders work.', excerpt: 'Tools, talent and a rapidly shifting economy.', meta: '7 min read' },
  { imgLabel: 'STYLE / FASHION', image: '/kids2.jpeg', tag: 'Lifestyle', title: 'The rise of African streetwear as a global language.', excerpt: 'Local identity meets global style.', meta: '4 min read' },
];

const initialMagazines = [
  {
    id: 1,
    title: 'The African Future',
    coverTitle: 'THE AFRICAN FUTURE',
    tag: 'Featured',
    issue: 'Issue 001 • 2026',
    coverIssue: 'ISSUE 001',
    coverBottom: '15 STORIES OF WHAT’S NEXT',
    price: 499,
    cover: 'future',
    image: '/theunity.jpeg',
    lead: 'Our debut digital magazine exploring the people, businesses, ideas and cultural movements shaping Africa’s next chapter.',
    inside: ['15 emerging founders', 'The creative economy', 'Africa’s digital future'],
  },
  {
    id: 2,
    title: 'Creative Africa',
    coverTitle: 'CREATIVE AFRICA',
    tag: 'Culture',
    issue: 'Issue 002 • 2026',
    coverIssue: 'ISSUE 002',
    coverBottom: 'MUSIC • FASHION • ART',
    price: 449,
    cover: 'creative',
    image: '/music.jpeg',
    lead: 'A visual celebration of African music, fashion, art and the creators building a new cultural language.',
    inside: ['New African sound', 'Streetwear movement', 'Artists to watch'],
  },
  {
    id: 3,
    title: 'Builders',
    coverTitle: 'BUILDERS',
    tag: 'Innovation',
    issue: 'Issue 003 • 2026',
    coverIssue: 'ISSUE 003',
    coverBottom: 'STARTUPS • TECH • INNOVATION',
    price: 549,
    cover: 'builders',
    image: '/blockchain.jpeg',
    lead: 'Inside the startups, engineers and technology leaders building practical solutions for Africa and beyond.',
    inside: ['Founder stories', 'AI & technology', 'Building for scale'],
  },
  {
    id: 4,
    title: 'Youth 100',
    coverTitle: 'YOUTH 100',
    tag: 'Special Edition',
    issue: 'Special Edition • 2026',
    coverIssue: 'SPECIAL',
    coverBottom: '100 VOICES CHANGING AFRICA',
    price: 699,
    cover: 'youth',
    image: '/youthinpolicy.jpeg',
    lead: 'One hundred young Africans whose ideas, courage and work are helping define the continent’s next generation.',
    inside: ['100 young voices', 'Leaders under 30', 'The next decade'],
  },
  {
    id: 5,
    title: 'Women in Business',
    coverTitle: 'WOMEN IN BUSINESS',
    tag: 'Business',
    issue: 'Issue 005 • 2026',
    coverIssue: 'ISSUE 005',
    coverBottom: 'FOUNDERS • LEADERS • INNOVATORS',
    price: 549,
    cover: 'future',
    image: '/womeninbusiness.jpeg',
    lead: 'The founders, executives and investors redefining business across Africa.',
    inside: ['Women founders', 'Market movers', 'Investment trends'],
  },
];

const initialMustReadFeatures = [
  { imgLabel: 'STARTUPS', image: '/leadingwithpurpose.jpeg', tag: 'Startups', title: 'Inside the founder mindset behind Africa’s next breakout companies.', meta: 'Business • 9 min read' },
  { imgLabel: 'MONEY', image: '/financeandinvestment.jpeg', tag: 'Funding', title: 'What founders should know before chasing their first investment.', meta: 'Business • 6 min read' },
  { imgLabel: 'PEOPLE', image: '/community.jpeg', tag: 'Entrepreneurs', title: 'Five young builders creating opportunities where they live.', meta: 'Business • 5 min read' },
];

const initialInnovationStories = [
  { imgLabel: 'AI', image: '/blockchain.jpeg', tag: 'Technology', title: 'The tools giving small teams an unfair advantage.', excerpt: 'Technology for the new economy.' },
  { imgLabel: 'BUILDERS', image: '/youthinpolicy1.jpeg', tag: 'Young Innovators', title: 'Meet the builders refusing to wait for permission.', excerpt: 'Ideas from across the continent.' },
  { imgLabel: 'SOLUTIONS', image: '/kids3.jpeg', tag: 'Impact', title: 'Local solutions to problems the world is watching.', excerpt: 'Innovation with purpose.' },
  { imgLabel: 'FUTURE', image: '/photography.jpeg', tag: 'Future', title: 'What Africa’s digital future could look like.', excerpt: 'People, platforms and possibilities.' },
];

const initialOpportunities = [
  { tag: 'GRANT', title: 'Startup Growth Fund', meta: 'Africa • No deadline' },
  { tag: 'JOB', title: 'Product Designer', meta: 'Nairobi • No deadline' },
  { tag: 'EVENT', title: 'Africa Innovation Summit', meta: 'Virtual • No deadline' },
];

const formatPrice = (price) => `KES ${price.toLocaleString()}`;

const MagazineCover = ({ magazine, variant = '' }) => (
  <div className={`nl-mag-cover nl-cover-${magazine.cover} ${variant}`}>
    {magazine.image ? (
      <img
        src={magazine.image}
        alt={`${magazine.title} cover`}
        className="nl-mag-cover-img"
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

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [latestStories, setLatestStories] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [mustReadFeatures, setMustReadFeatures] = useState([]);
  const [innovationStories, setInnovationStories] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroStory, setHeroStory] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [audioError, setAudioError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const featured = magazines[0] || initialMagazines[0];

  // Smooth scroll to top on mount
  useLayoutEffect(() => {
    // Disable scroll restoration first
    if (window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Smooth scroll to top
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [homeRes, magRes, oppRes, storiesRes] = await Promise.all([
          api.get('/stories/homepage'),
          api.get('/magazines?limit=5'),
          api.get('/opportunities?limit=3'),
          api.get('/stories/latest?limit=4'),
        ]);

        // Try to fetch podcasts separately to avoid breaking the whole page if it fails
        let podcastData = [];
        try {
          podcastData = await podcastService.getPodcasts({ limit: 3 });
        } catch (podcastError) {
          console.error('Failed to load podcasts:', podcastError.message);
          // Leave podcastData empty, will use fallback UI
        }

        const home = homeRes.data.data || {};

        const stripHtml = (html) => {
          if (!html) return '';
          return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        };

        const makeExcerpt = (content, limit = 120) => {
          const text = stripHtml(content);
          if (!text) return '';
          return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
        };

        const formatDate = (dateString) => {
          if (!dateString) return 'No deadline';
          try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) return 'No deadline';
            return `Deadline: ${date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}`;
          } catch (error) {
            return 'No deadline';
          }
        };

        const mapStories = (stories, label = 'FEATURE') => (stories || []).map((s) => ({
          id: s.id,
          slug: s.slug,
          imgLabel: s.categoryName ? `${s.categoryName.toUpperCase()} / ${label}` : label,
          image: s.imageUrl,
          tag: s.categoryName || 'Story',
          title: s.title,
          excerpt: makeExcerpt(s.content, 120),
          meta: '5 min read',
        }));

        setHeroStory(home.featuredStories?.[0] || null);
        setLatestStories(mapStories(storiesRes.data.data || [], 'FEATURE'));
        setMustReadFeatures((home.mustReadStories || []).slice(0, 3).map((s) => ({
          id: s.id,
          slug: s.slug,
          imgLabel: 'FEATURE',
          image: s.imageUrl,
          tag: s.categoryName || 'Story',
          title: s.title,
          meta: `${s.categoryName || 'Story'} • 5 min read`,
        })));
        setInnovationStories(mapStories(home.textOnlyStories || home.featuredStories || [], 'INNOVATION').slice(0, 4).map((s) => ({
          ...s,
          slug: s.slug,
        })));

        setMagazines((magRes.data.data || []).map((m) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          image: m.coverImage,
          cover: 'future',
          tag: 'ISSUE',
          price: m.price || 499,
          lead: m.description || 'Our latest issue exploring the people, businesses, ideas and culture shaping Africa.',
          issue: m.issue || (m.published ? new Date(m.published).getFullYear().toString() : '2026'),
          inside: ['Featured stories', 'Exclusive interviews', 'Community voices'],
          // Preserve all the detailed fields for details page
          fullDescription: m.fullDescription || m.description,
          reviewCount: m.reviewCount || 0,
          rating: m.rating || 4.5,
          readers: m.readers || 1000,
          isNew: m.isNew || false,
          isFeatured: m.isFeatured || false,
          editorPick: m.editorPick || false,
          subcategory: m.subcategory || m.category || 'General',
          digitalPrice: m.digitalPrice || m.price,
          printPrice: m.printPrice || (m.price || 0) + 4,
          subscriptionPrice: m.subscriptionPrice || (m.price || 0) * 12,
          pages: m.pages || 100,
          language: m.language || 'English',
          publisher: m.publisher || 'Trendorabay',
          editor: m.editor || 'Trendorabay Editorial',
          contributors: m.contributors || [],
          tableOfContents: m.tableOfContents || [],
          reviews: m.reviews || [],
          relatedMagazines: m.relatedMagazines || [],
          previewPages: m.previewPages || [],
        })));

        setOpportunities((oppRes.data.data || []).slice(0, 3).map((o) => ({
          tag: (o.category || 'OPPORTUNITY').toUpperCase(),
          title: o.title,
          meta: `${o.location || o.country || 'Remote'} • ${formatDate(o.deadline)}`,
        })));

        // Set podcasts data
        setPodcasts(podcastData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load landing page data:', error.message);
        // Fallback to hardcoded data if API fails
        setLatestStories(initialLatestStories);
        setMagazines(initialMagazines);
        setMustReadFeatures(initialMustReadFeatures);
        setInnovationStories(initialInnovationStories);
        setOpportunities(initialOpportunities);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      }
    };
  }, []);



  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success(`Thanks! ${email} has been added to the Trendorabay Weekly.`);
    setEmail('');
  };

  const handlePlayPodcast = async (podcast) => {
    const audioUrl = podcast.audioUrl || podcast.audio_file_url;

    if (!audioUrl || typeof audioUrl !== 'string') {
      toast.error('Audio not available for this podcast');
      return;
    }

    setAudioError(false);

    if (currentlyPlaying === podcast.id) {
      // Toggle play/pause for current podcast
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setAudioError(true);
        }
      }
    } else {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }

      // Play new podcast
      setCurrentlyPlaying(podcast.id);
      setCurrentPodcast(podcast);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          setAudioError(true);
          toast.error('Error playing audio');
        }
      }
    }
  };

  const handleStopPodcast = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    setIsPlaying(false);
    setAudioError(false);
    setCurrentlyPlaying(null);
    setCurrentPodcast(null);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioError(false);
    setCurrentlyPlaying(null);
    setCurrentPodcast(null);
  };

  const handleAudioError = () => {
    toast.error('Error playing audio');
    setIsPlaying(false);
    setAudioError(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <section className="landing-page">
      <div className="nl-container">
        {/* Top Ad */}
        <div className="top-ad">
          <img src="/ad1.png" alt="Advertisement" />
        </div>

        {/* Hero */}
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

        {/* Latest Stories */}
        <section id="nl-latest" className="nl-section">
          <div className="nl-section-head">
            <h2>✦ Latest Stories</h2>
            <Link to="/stories">VIEW ALL →</Link>
          </div>
          <div className="nl-trending">
            {latestStories.map((story) => (
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

        {/* Magazines */}
        <section id="nl-magazines" className="nl-section">
          <div className="nl-store-view">
            <div className="nl-section-head">
              <div>
                <span className="nl-tag">TRENDORABAY STORE</span>
                <h2>✦ Magazines</h2>
              </div>
              <Link to="/magazines">ALL ISSUES →</Link>
            </div>

            <div className="nl-magazine-hero">
              <MagazineCover magazine={featured} />
              <div>
                <span className="nl-kicker">Latest Issue</span>
                <h2>{featured.title}.</h2>
                <p className="nl-hero-lead">{featured.lead}</p>
                <div className="nl-price">{formatPrice(featured.price)}</div>
                <Link to="/cart" className="nl-buybtn">BUY MAGAZINE</Link>
                <button
                  type="button"
                  className="nl-secondarybtn"
                  onClick={() => navigate(`/magazines/${featured.slug || featured.id}`)}
                >
                  VIEW ISSUE
                </button>
              </div>
              <img
                src="/music1.jpeg"
                alt="Upcoming issue preview"
                className="nl-mag-hero-thumb"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>

            <div className="nl-section-head nl-section-head-spaced">
              <h2>Latest Issues</h2>
              <Link to="/magazines">BROWSE ALL →</Link>
            </div>
            <div className="nl-mag-grid">
              {magazines.map((magazine) => (
                <article
                  key={magazine.id}
                  className="nl-mag-card"
                  onClick={() => navigate(`/magazines/${magazine.slug || magazine.id}`)}
                >
                  <MagazineCover magazine={magazine} variant="nl-mag-cover-small" />
                  <div className="nl-mag-info">
                    <span className="nl-tag">{magazine.tag.toUpperCase()}</span>
                    <h3>{magazine.title}</h3>
                    <div className="nl-mag-price">{formatPrice(magazine.price)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Merchandise */}
        <section id="nl-merchandise" className="nl-section">
          <div className="nl-section-head">
            <div>
              <span className="nl-tag">TRENDORABAY STORE</span>
              <h2>✦ Merchandise</h2>
            </div>
            <Link to="/store">VIEW STORE →</Link>
          </div>
          <div className="nl-merch-hero">
            <div>
              <span className="nl-kicker">Drop 001</span>
              <h2>Wear the story. <span className="nl-culture-accent">Carry the culture.</span></h2>
              <p className="nl-hero-lead">
                Official Trendorabay merchandise inspired by African creativity, youth culture and
                the ideas shaping tomorrow.
              </p>
              <Link to="/store" className="nl-buybtn nl-buybtn-spaced">SHOP THE DROP</Link>
            </div>
            <img
              src="/merch-banner.jpg"
              alt="Trendorabay T-shirt merchandise"
              className="nl-merch-visual"
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </section>

        {/* Must Read */}
        <section id="nl-business" className="nl-section nl-two-col">
          <div>
            <div className="nl-section-head">
              <h2>✦ Must Read</h2>
              <Link to="/stories">EXPLORE →</Link>
            </div>
            <div className="nl-feature-list">
              {mustReadFeatures.map((feature) => (
                <article
                  key={feature.id || feature.title}
                  className="nl-feature"
                  onClick={() => navigate(`/stories/${feature.slug || feature.id}`)}
                >
                  <div className="nl-card-img">
                    {feature.image && (
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="nl-card-media"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    {feature.imgLabel}
                  </div>
                  <div>
                    <span className="nl-tag">{feature.tag}</span>
                    <h3>{feature.title}</h3>
                    <p className="nl-meta">{feature.meta}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="nl-sidebar-col">
            <aside className="nl-sidebox">
              <span className="nl-kicker">Trendorabay Brief</span>
              <h3>One place for the ideas moving Africa forward.</h3>
              <p>
                Get the most important stories, business insights and opportunities in one weekly
                briefing.
              </p>
              <div className="nl-pill-list">
                {['Startups', 'Money', 'Tech', 'Culture', 'Creators'].map((pill) => (
                  <span key={pill} className="nl-pill">{pill}</span>
                ))}
              </div>
            </aside>
            <div className="nl-ad-sidebar">
              <img src="https://placehold.co/300x250?text=Ad" alt="Sidebar Advertisement" />
            </div>
          </div>
        </section>

        {/* Innovation */}
        <section id="nl-innovation" className="nl-section">
          <div className="nl-section-head">
            <h2>✦ Innovation</h2>
            <Link to="/stories">EXPLORE →</Link>
          </div>
          <div className="nl-trending">
            {innovationStories.map((story) => (
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

        {/* Podcasts */}
        <section id="nl-podcasts" className="nl-section podcast-section">
          <div className="nl-section-head">
            <div>
              <span className="nl-tag">TRENDORABAY AUDIO</span>
              <h2>✦ Podcasts</h2>
            </div>
          </div>

          <div className="nl-podcast-horizontal">
            {podcasts.length > 0 ? (
              podcasts.map((podcast, index) => (
                <article key={podcast.id || index} className="nl-podcast-episode-card">
                  <div className="nl-podcast-episode-image">
                    <img
                      src={podcast.coverImage || podcast.image || '/music7.jpeg'}
                      alt={podcast.title || `Episode ${index + 1}`}
                      className="nl-podcast-episode-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button
                      className="nl-podcast-play-center"
                      onClick={() => handlePlayPodcast(podcast)}
                    >
                      {currentlyPlaying === podcast.id && isPlaying ? '⏸' : '▶'}
                    </button>
                  </div>
                  <div className="nl-podcast-episode-info">
                    <span className="nl-podcast-episode-num">EP. {String(index + 1).padStart(2, '0')}</span>
                    <h4>{podcast.title || 'Untitled Episode'}</h4>
                    <p>{podcast.category || 'General'} • {podcast.duration || '30 MIN'}</p>
                  </div>
                </article>
              ))
            ) : (
              // Fallback to hardcoded data if no podcasts from API
              <>
                <article className="nl-podcast-episode-card">
                  <div className="nl-podcast-episode-image">
                    <img
                      src="/music7.jpeg"
                      alt="Episode 1"
                      className="nl-podcast-episode-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button className="nl-podcast-play-center">▶</button>
                  </div>
                  <div className="nl-podcast-episode-info">
                    <span className="nl-podcast-episode-num">EP. 01</span>
                    <h4>Building something people actually need</h4>
                    <p>Founders & Innovation • 32 MIN</p>
                  </div>
                </article>

                <article className="nl-podcast-episode-card">
                  <div className="nl-podcast-episode-image">
                    <img
                      src="/music1.jpeg"
                      alt="Episode 2"
                      className="nl-podcast-episode-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button className="nl-podcast-play-center">▶</button>
                  </div>
                  <div className="nl-podcast-episode-info">
                    <span className="nl-podcast-episode-num">EP. 02</span>
                    <h4>The new African creative economy</h4>
                    <p>Culture & Creators • 28 MIN</p>
                  </div>
                </article>

                <article className="nl-podcast-episode-card">
                  <div className="nl-podcast-episode-image">
                    <img
                      src="/blockchain.jpeg"
                      alt="Episode 3"
                      className="nl-podcast-episode-img"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <button className="nl-podcast-play-center">▶</button>
                  </div>
                  <div className="nl-podcast-episode-info">
                    <span className="nl-podcast-episode-num">EP. 03</span>
                    <h4>Ideas that can change a city</h4>
                    <p>Impact & Community • 35 MIN</p>
                  </div>
                </article>
              </>
            )}

            <div className="nl-podcast-description">
              <span className="nl-podcast-all-episodes">ALL EPISODES →</span>
              <span className="nl-tag">THE TRENDORABAY PODCAST</span>
              <h3>Conversations beyond the headlines.</h3>
              <p>Real stories and ideas from people shaping Africa's next chapter.</p>
            </div>
          </div>

          {currentPodcast && (
            <div className={`nl-podcast-player ${isPlaying ? 'nl-podcast-player-playing' : ''}`}>
              <div className="nl-podcast-player-info">
                <span className="nl-podcast-player-label">
                  {audioError ? 'Audio unavailable' : 'Now Playing'}
                </span>
                <h4>{currentPodcast.title}</h4>
                <p>
                  {currentPodcast.category || 'General'} • {currentPodcast.duration || '30 MIN'}
                </p>
              </div>
              <div className="nl-podcast-player-controls">
                <button
                  type="button"
                  className="nl-podcast-player-play"
                  onClick={() => handlePlayPodcast(currentPodcast)}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  type="button"
                  className="nl-podcast-player-close"
                  onClick={handleStopPodcast}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Middle Ad */}
        <div className="top-ad">
          <img src="https://placehold.co/1200x100?text=AD" alt="Advertisement" />
        </div>

        {/* Opportunities */}
        <section id="nl-opportunities" className="nl-section">
          <div className="nl-opps">
            <div className="nl-section-head">
              <h2>✦ Opportunities</h2>
              <Link to="/opportunities">SEE ALL →</Link>
            </div>
            <p>Funding, jobs, grants, scholarships, competitions and events worth knowing about.</p>
            <div className="nl-opp-grid">
              {opportunities.map((opp) => (
                <div key={opp.title || opp.tag} className="nl-opp">
                  <span className="nl-tag">{opp.tag}</span>
                  <strong>{opp.title}</strong>
                  <p className="nl-meta">{opp.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Write for Us */}
        <section id="nl-writers" className="nl-section writers-section">
          <div className="nl-writers-shell">
            <div className="nl-writers-copy">
              <span className="nl-tag">WRITE FOR TRENDORABAY</span>
              <h2>Share Your Story.</h2>
              <p>Have a story, idea, or perspective to share? We're looking for writers and storytellers across Africa.</p>
            </div>
            <Link to="/write-for-us" className="nl-writer-cta">
              Become a Writer <span>→</span>
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <section className="nl-section">
          <div className="nl-newsletter">
            <div>
              <span className="nl-kicker">Newsletter</span>
              <h2>The Trendorabay Weekly.</h2>
              <p>
                The stories, people, trends and opportunities shaping Africa — delivered to your
                inbox.
              </p>
            </div>
            <form className="nl-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
              />
              <button type="submit">SUBSCRIBE</button>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section id="nl-faq" className="nl-section">
          <div className="nl-section-head">
            <h2>✦ FAQ</h2>
          </div>
          <div className="nl-faq">
            <details className="nl-faq-item">
              <summary>What is Trendorabay?</summary>
              <p>
                Trendorabay is a digital magazine and platform highlighting the people, businesses,
                ideas and culture shaping Africa's next chapter.
              </p>
            </details>
            <details className="nl-faq-item">
              <summary>How can I contribute or write for Trendorabay?</summary>
              <p>
                We welcome stories from founders, creators and thinkers across the continent. Visit
                our Write for Us page to submit your idea.
              </p>
            </details>
            <details className="nl-faq-item">
              <summary>Where can I find the latest issues and merchandise?</summary>
              <p>
                Browse our Magazines and Store sections for the latest digital issues, apparel and
                accessories.
              </p>
            </details>
          </div>
        </section>

        {/* Hidden audio element for podcast playback */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onError={handleAudioError}
          style={{ display: 'none' }}
        />

      </div>
    </section>
  );
};

export default LandingPage;
