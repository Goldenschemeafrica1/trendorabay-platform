import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import podcastService from '../../services/podcastService';
import podcastHostService from '../../services/podcastHostService';
import './PodcastsPage.css';

// Expanded featured series collection
const featuredSeriesList = [
  {
    id: 1,
    name: "Startup Stories",
    description: "Founders building billion-dollar dreams across Africa",
    icon: "🚀",
    color: "#E67E22",
    episodeCount: 24,
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Voices of Africa",
    description: "Pan-African changemakers reshaping the continent",
    icon: "🌍",
    color: "#E67E22",
    episodeCount: 31,
    coverImage: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Young Founders",
    description: "Under 30 hustle & innovation stories",
    icon: "⚡",
    color: "#E67E22",
    episodeCount: 18,
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
  },
  ];

const categoriesList = [
  "All", "Business & Entrepreneurship", "Culture & Lifestyle", 
  "Innovation & Tech", "Youth & Education", "Impact Stories", "Startup Stories"
];

const PodcastPage = () => {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState([]);
  const [featuredGuests, setFeaturedGuests] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    topic: '',
    social_media: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const playTimeoutRef = useRef(null);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Fetch podcasts from API
  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      try {
        const podcasts = await podcastService.getPodcasts();
        console.log('Fetched podcasts:', podcasts);
        setEpisodes(podcasts);
        setFilteredEpisodes(podcasts);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setEpisodes([]);
        setFilteredEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  // Fetch hosts from API
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await podcastHostService.getHosts({ status: 'active' });
        let hosts = [];
        
        if (Array.isArray(response)) {
          hosts = response;
        } else if (response && Array.isArray(response.data)) {
          hosts = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          hosts = response.data.data;
        }
        
        setHosts(hosts);
      } catch (error) {
        console.error('Error fetching hosts:', error);
        setHosts([]);
      }
    };
    
    fetchHosts();
  }, []);

  // Fetch featured guests from API
  useEffect(() => {
    const fetchFeaturedGuests = async () => {
      try {
        const response = await podcastHostService.getFeaturedGuests(10);
        let guests = [];
        
        if (Array.isArray(response)) {
          guests = response;
        } else if (response && Array.isArray(response.data)) {
          guests = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          guests = response.data.data;
        }
        
        setFeaturedGuests(guests);
      } catch (error) {
        console.error('Error fetching featured guests:', error);
        setFeaturedGuests([]);
      }
    };
    
    fetchFeaturedGuests();
  }, []);

  // Filter episodes
  useEffect(() => {
    let filtered = episodes;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(ep => ep.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(ep => 
        ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredEpisodes(filtered);
  }, [selectedCategory, searchQuery, episodes]);

  // Audio handlers
  const playEpisode = (episode) => {
    setAudioError(null);
    
    if (currentEpisode?.id === episode.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error('Audio play error:', err);
          setAudioError('Failed to play audio. The source may not be available.');
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      setCurrentEpisode(episode);
      setShowMiniPlayer(true);
      setIsPlaying(true);
      
      playTimeoutRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = episode.audioUrl;
          audioRef.current.play().catch(err => {
            console.error('Audio play error:', err);
            setAudioError('Failed to play audio. The source may not be available.');
            setIsPlaying(false);
          });
        }
      }, 100);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      
      if (progressRef.current) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        progressRef.current.style.width = `${progress}%`;
      }
    }
  };

  const handleSeek = (e) => {
    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEpisodeEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (progressRef.current) progressRef.current.style.width = "0%";
  };

  const formatDurationHHMMSS = (dur) => {
    if (!dur || typeof dur !== 'string') return '00:00:00';
    const parts = dur.split(':');
    if (parts.length === 2) {
      const mins = parts[0].padStart(2, '0');
      const secs = parts[1].padStart(2, '0');
      return `00:${mins}:${secs}`;
    }
    return dur;
  };

  const getTrendingEpisodes = () => {
    if (!Array.isArray(episodes) || episodes.length === 0) return [];
    return [...episodes]
      .filter(episode => !episode.videoUrl)
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 5);
  };

  const getVideoEpisodes = () => {
    if (!Array.isArray(episodes) || episodes.length === 0) return [];
    return [...episodes].filter(episode => episode.videoUrl);
  };

  const nextEpisode = () => {
    if (!currentEpisode) return;
    const currentIndex = episodes.findIndex(e => e.id === currentEpisode.id);
    const nextIndex = (currentIndex + 1) % episodes.length;
    playEpisode(episodes[nextIndex]);
  };

  const prevEpisode = () => {
    if (!currentEpisode) return;
    const currentIndex = episodes.findIndex(e => e.id === currentEpisode.id);
    const prevIndex = (currentIndex - 1 + episodes.length) % episodes.length;
    playEpisode(episodes[prevIndex]);
  };

  const handleApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateApplicationForm = () => {
    const errors = {};
    
    if (!applicationForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!applicationForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(applicationForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!applicationForm.bio.trim()) {
      errors.bio = 'Bio is required';
    } else if (applicationForm.bio.length < 50) {
      errors.bio = 'Bio must be at least 50 characters';
    }
    
    if (!applicationForm.topic.trim()) {
      errors.topic = 'Topic is required';
    } else if (applicationForm.topic.length < 20) {
      errors.topic = 'Topic must be at least 20 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateApplicationForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://192.168.100.4:3001/api/podcast-guest-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setApplicationForm({
          name: '',
          email: '',
          phone: '',
          bio: '',
          topic: '',
          social_media: ''
        });
        
        // Close modal after success message
        setTimeout(() => {
          setShowApplicationModal(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setFormErrors({ submit: data.error || 'Failed to submit application' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setFormErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openApplicationModal = () => {
    setShowApplicationModal(true);
    setSubmitSuccess(false);
    setFormErrors({});
  };

  const handleEpisodeClick = (episode) => {
    console.log('Selected episode:', JSON.stringify(episode, null, 2));
    // Navigate to podcast detail page
    navigate(`/podcast/${episode.id}`);
  };

  return (
    <div className="podcast-page">
      {/* Hidden audio element */}
      {currentEpisode?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentEpisode.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEpisodeEnd}
          onLoadedMetadata={handleTimeUpdate}
          onError={() => {
            console.error('Audio loading error - no audio data in database');
            setAudioError('Audio not available in database. Please upload audio file.');
            setIsPlaying(false);
          }}
        />
      )}

      {/* Coming Soon Section */}
      <section className="coming-soon-section">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <i className="fas fa-podcast"></i>
          </div>
          <h1>Coming Soon</h1>
          <p>We're working on bringing you amazing podcast content featuring inspiring voices from across Africa. Stay tuned for incredible stories and conversations.</p>
          <button className="apply-guest-btn" onClick={() => setShowGuestApplication(true)}>
            <i className="fas fa-microphone"></i> Apply to be a Guest
          </button>
        </div>
      </section>

      {/* Hero Section - Hidden for now */}
      {/* <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Amplifying African Voices to the World</h1>
              <p>Join thousands of listeners discovering authentic stories from across the continent. From groundbreaking entrepreneurs to cultural visionaries, experience the narratives shaping Africa's future.</p>
              <div className="hero-actions">
                <button className="hero-cta primary">Start Listening <i className="fas fa-play"></i></button>
                <button className="hero-cta secondary">Explore Episodes <i className="fas fa-arrow-right"></i></button>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <img src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=500&fit=crop" alt="Podcast Studio" />
                <div className="hero-image-overlay">
                  <div className="floating-card">
                    <i className="fas fa-headphones"></i>
                    <span>Now Streaming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Content - Hidden for now */}
      {/*
      <div className="container">
        <div className="most-listened-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Featured Episodes
              </h2>
            </div>
          </div>
          <div className="most-listened-grid">
            {getTrendingEpisodes().slice(0, 3).map((episode, index) => (
              <div key={episode.id} className="most-listened-card">
                <div className="card-image">
                  <img src={episode.coverImage} alt={episode.title} />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <span className="episode-number">EPISODE {String(index + 1).padStart(2, '0')}</span>
                    <span className="episode-category">{episode.category}</span>
                  </div>
                  <h3>{episode.title}</h3>
                  <div className="card-footer">
                    <button
                      className="play-button"
                      onClick={() => playEpisode(episode)}
                    >
                      <i className={`fas ${currentEpisode?.id === episode.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                      <span>Play</span>
                    </button>
                    <div className="author-info">
                      <i className="fas fa-user-circle"></i>
                      <span>{episode.guest}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="live-podcast-banner">
          <div className="live-podcast-content">
            <div className="live-podcast-text">
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span className="live-text">LIVE NOW</span>
              </div>
              <h2>Live Podcast Sessions</h2>
              <p>Join our live podcast sessions with industry leaders and innovators. Real conversations, real insights, real-time engagement.</p>
              <button className="live-podcast-btn">Join Live <i className="fas fa-play"></i></button>
            </div>
            <div className="live-podcast-image">
              <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=400&fit=crop" alt="Live Podcast" />
            </div>
          </div>
        </div>

        <div className="episodes-section">
          <div className="episodes-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Latest Episodes
              </h2>
            </div>
          </div>
          
          <div className="episodes-grid">
            {getVideoEpisodes().slice(0, 3).map(episode => (
              <div key={episode.id} className="episode-card" onClick={() => handleEpisodeClick(episode)} style={{ cursor: 'pointer' }}>
                <div className="card-image">
                  <div className="video-wrapper">
                    <img src={episode.coverImage} alt={episode.title} className="video-poster" />
                  </div>
                </div>
                <div className="card-content">
                  <p className="episode-description">{episode.description}</p>
                  <span className="episode-duration"><i className="far fa-clock"></i> {formatDurationHHMMSS(episode.duration)}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEpisodes.length === 0 && (
            <div className="no-results">
              <i className="fas fa-microphone-alt"></i>
              <h3>No episodes found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        <div className="hosts-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Meet Our Podcast Hosts
              </h2>
            </div>
          </div>
          <div className="hosts-grid">
            {hosts.length > 0 ? hosts.map((host) => (
              <div key={host.id} className="host-card">
                <div className="card-image">
                  <img 
                    src={host.photo_url || '/images/podcast-placeholder.jpg'} 
                    alt={host.name} 
                    onError={(e) => {
                      e.target.src = '/images/podcast-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3>{host.name}</h3>
                  <p className="host-title">{host.bio || 'Podcast Host'}</p>
                </div>
              </div>
            )) : (
              <div className="no-hosts">
                <p>No hosts available</p>
              </div>
            )}
          </div>
        </div>

        <div className="blog-posts-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> From the Best Blog Posts
              </h2>
            </div>
          </div>
          <div className="blog-posts-grid">
            <div className="blog-post-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop" alt="Blog Post" />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="blog-category">Technology</span>
                  <span className="blog-date">June 15, 2024</span>
                </div>
                <h3>The Future of African Tech Innovation</h3>
                <button className="read-more">Read More</button>
              </div>
            </div>
            <div className="blog-post-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop" alt="Blog Post" />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="blog-category">Business</span>
                  <span className="blog-date">June 12, 2024</span>
                </div>
                <h3>Building Sustainable Startups in Africa</h3>
                <button className="read-more">Read More</button>
              </div>
            </div>
            <div className="blog-post-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop" alt="Blog Post" />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="blog-category">Digital</span>
                  <span className="blog-date">June 10, 2024</span>
                </div>
                <h3>Digital Transformation in Nigerian Businesses</h3>
                <button className="read-more">Read More</button>
              </div>
            </div>
            <div className="blog-post-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop" alt="Blog Post" />
              </div>
              <div className="card-content">
                <div className="card-header">
                  <span className="blog-category">Finance</span>
                  <span className="blog-date">June 8, 2024</span>
                </div>
                <h3>Investment Opportunities in African Markets</h3>
                <button className="read-more">Read More</button>
              </div>
            </div>
          </div>
        </div>

        <div className="featured-guest-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Featured Guests
              </h2>
              <span className="guest-count">Amazing voices shaping Africa's future</span>
            </div>
          </div>
          <div className="featured-guests-grid">
            {featuredGuests.length > 0 ? featuredGuests.map((guest) => (
              <div key={guest.id || guest.name} className="guest-card">
                <div className="guest-image">
                  <img 
                    src={guest.image_url || '/images/podcast-placeholder.jpg'} 
                    alt={guest.name} 
                    onError={(e) => {
                      e.target.src = '/images/podcast-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="guest-info">
                  <h3>{guest.name}</h3>
                  <p className="guest-title">{guest.bio || 'Featured Guest'}</p>
                  <div className="guest-episode">
                    <span><i className="fas fa-microphone"></i> Featured in {guest.episode_count} episode{guest.episode_count !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="no-guests">
                <p>No featured guests available</p>
              </div>
            )}
          </div>
        </div>

        <div className="call-for-guest-banner">
          <div className="call-for-guest-content">
            <div className="call-for-guest-text">
              <h2>Be Our Next Guest</h2>
              <p>Share your story with thousands of listeners across Africa and beyond. We're looking for innovators, creators, and changemakers who are shaping the future.</p>
              <button className="call-for-guest-btn" onClick={openApplicationModal}>Apply Now <i className="fas fa-arrow-right"></i></button>
            </div>
            <div className="call-for-guest-icon">
              <i className="fas fa-microphone-alt"></i>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Mini Player */}
      {showMiniPlayer && currentEpisode && (
        <div className="mini-player">
          <div className="mini-player-content">
            <img src={currentEpisode.coverImage} alt={currentEpisode.title} className="mini-player-image" />
            <div className="mini-player-info">
              <h4>{currentEpisode.title}</h4>
              <p>{currentEpisode.guest}</p>
              {audioError && <span className="audio-error">{audioError}</span>}
            </div>
            <div className="mini-player-controls">
              <button className="control-btn" onClick={prevEpisode}>
                <i className="fas fa-step-backward"></i>
              </button>
              <button className="play-pause-btn" onClick={() => playEpisode(currentEpisode)} disabled={!!audioError}>
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <button className="control-btn" onClick={nextEpisode}>
                <i className="fas fa-step-forward"></i>
              </button>
            </div>
            <div className="mini-player-progress" onClick={handleSeek}>
              <div className="progress-bar" ref={progressRef}></div>
            </div>
            <div className="mini-player-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <button className="close-player" onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
              }
              setShowMiniPlayer(false);
              setCurrentEpisode(null);
              setIsPlaying(false);
              setAudioError(null);
            }}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Guest Application Modal */}
      {showApplicationModal && (
        <div className="modal-overlay" onClick={() => setShowApplicationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply to Be a Guest</h2>
              <button className="modal-close" onClick={() => setShowApplicationModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>Application Submitted!</h3>
                <p>Thank you for your interest. We'll review your application and get back to you soon.</p>
              </div>
            ) : (
              <form className="application-form" onSubmit={handleApplicationSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={applicationForm.name}
                    onChange={handleApplicationFormChange}
                    className={formErrors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={applicationForm.email}
                    onChange={handleApplicationFormChange}
                    className={formErrors.email ? 'error' : ''}
                    placeholder="Enter your email address"
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={applicationForm.phone}
                    onChange={handleApplicationFormChange}
                    placeholder="Enter your phone number (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">About You * (min. 50 characters)</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={applicationForm.bio}
                    onChange={handleApplicationFormChange}
                    className={formErrors.bio ? 'error' : ''}
                    placeholder="Tell us about yourself, your background, and what makes you unique..."
                    rows="4"
                  ></textarea>
                  {formErrors.bio && <span className="error-message">{formErrors.bio}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="topic">Podcast Topic * (min. 20 characters)</label>
                  <textarea
                    id="topic"
                    name="topic"
                    value={applicationForm.topic}
                    onChange={handleApplicationFormChange}
                    className={formErrors.topic ? 'error' : ''}
                    placeholder="What topic would you like to discuss on the podcast? What insights can you share?"
                    rows="3"
                  ></textarea>
                  {formErrors.topic && <span className="error-message">{formErrors.topic}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="social_media">Social Media Links</label>
                  <textarea
                    id="social_media"
                    name="social_media"
                    value={applicationForm.social_media}
                    onChange={handleApplicationFormChange}
                    placeholder="Share your LinkedIn, Twitter, Instagram, or other social media profiles (optional)"
                    rows="2"
                  ></textarea>
                </div>

                {formErrors.submit && <div className="submit-error">{formErrors.submit}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowApplicationModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastPage;