import React, { useState, useEffect, useRef } from 'react';
import './PodcastsPage.css';

// Expanded podcast data with more featured series content
const episodesData = [
  {
    id: 1,
    title: "From Kibera to Silicon Savannah",
    guest: "Wanjiru Mwangi",
    duration: "42:15",
    category: "Startup Stories",
    series: "Startup Stories",
    description: "How a Nairobi-based fintech startup raised $2M and changed local savings. Raw, inspiring, and real.",
    coverImage: "/assets/story1.jpeg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    date: "2026-04-20",
    trending: true,
    plays: 12450
  },
  {
    id: 2,
    title: "The Creative Economy Renaissance",
    guest: "Eliud Kipchoge",
    duration: "38:42",
    category: "Culture & Lifestyle",
    series: "Culture Talks",
    description: "Exploring how African artists are reshaping global culture and building sustainable careers.",
    coverImage: "/assets/musicstory.jpeg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    date: "2026-04-15",
    trending: true,
    plays: 8920
  },
  {
    id: 3,
    title: "Fintech Disruptors: The African Wave",
    guest: "Tumaini Mboya",
    duration: "51:08",
    category: "Innovation & Tech",
    series: "Young Founders",
    description: "Inside the minds building Africa's most innovative financial solutions for the unbanked.",
    coverImage: "/assets/story2.jpeg",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    date: "2026-04-10",
    trending: false,
    plays: 5670
  },
  {
    id: 4,
    title: "Climate Warriors: Youth Taking Action",
    guest: "Vanessa Nakat",
    duration: "46:22",
    category: "Impact Stories",
    series: "Voices of Africa",
    description: "Young activists leading climate movements across the continent and inspiring global change.",
    coverImage: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    date: "2026-04-05",
    trending: true,
    plays: 7340
  },
  {
    id: 5,
    title: "From Side Hustle to CEO",
    guest: "James Maina",
    duration: "55:30",
    category: "Business & Entrepreneurship",
    series: "Startup Stories",
    description: "The untold journey of scaling a small business into a multi-million dollar enterprise.",
    coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    date: "2026-03-28",
    trending: false,
    plays: 4450
  },
  {
    id: 6,
    title: "EdTech: Reimagining African Classrooms",
    guest: "Dr. Aisha Kenyatta",
    duration: "49:18",
    category: "Youth & Education",
    series: "Young Founders",
    description: "How technology is bridging education gaps across the continent.",
    coverImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    date: "2026-03-22",
    trending: false,
    plays: 3210
  },
  {
    id: 7,
    title: "Afrobeat to the World",
    guest: "Makena Njeri",
    duration: "47:12",
    category: "music",
    series: "Culture Talks",
    description: "How African music conquered global charts and built a new industry.",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    date: "2026-03-15",
    trending: true,
    plays: 15680
  },
  {
    id: 8,
    title: "AI for Social Good",
    guest: "Dr. Kwame Asante",
    duration: "52:45",
    category: "Innovation & Tech",
    series: "Tech Unboxed",
    description: "How artificial intelligence is solving real problems across Africa.",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    date: "2026-03-08",
    trending: false,
    plays: 2890
  }
];

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
  const [episodes, setEpisodes] = useState(episodesData);
  const [filteredEpisodes, setFilteredEpisodes] = useState(episodesData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

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
    if (currentEpisode?.id === episode.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentEpisode(episode);
      setShowMiniPlayer(true);
      setIsPlaying(true);
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = episode.audioUrl;
          audioRef.current.play();
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
    const parts = dur.split(':');
    if (parts.length === 2) {
      const mins = parts[0].padStart(2, '0');
      const secs = parts[1].padStart(2, '0');
      return `00:${mins}:${secs}`;
    }
    return dur;
  };

  const getTrendingEpisodes = () => {
    return [...episodes].sort((a, b) => b.plays - a.plays).slice(0, 5);
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

  return (
    <div className="podcast-page">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEpisodeEnd}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Hero Section */}
      <section className="hero-section">
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
      </section>

      {/* Main Content */}
      <div className="container">

        {/* Most Listened Episodes */}
        <div className="most-listened-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Most Listened Episodes
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

        {/* Live Podcast Banner */}
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

        {/* Episodes Grid */}
        <div className="episodes-section">
          <div className="episodes-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Latest Episodes
              </h2>
            </div>
          </div>
          
          <div className="episodes-grid">
            {filteredEpisodes.slice(0, 3).map(episode => (
              <div key={episode.id} className="episode-card">
                <div className="card-image">
                  <img src={episode.coverImage} alt={episode.title} />
                  <button
                    className="play-overlay"
                    onClick={() => playEpisode(episode)}
                  >
                    <i className={`fas ${currentEpisode?.id === episode.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>

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

        {/* Meet Our Podcast Hosts */}
        <div className="hosts-section">
          <div className="section-header">
            <div className="header-left">
              <h2>
                <span className="accent">✦</span> Meet Our Podcast Hosts
              </h2>
            </div>
          </div>
          <div className="hosts-grid">
            <div className="host-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" alt="Host" />
              </div>
              <div className="card-content">
                <h3>Kingsley George</h3>
                <p className="host-title">Lead Host</p>
              </div>
            </div>
            <div className="host-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" alt="Host" />
              </div>
              <div className="card-content">
                <h3>Sarah Chen</h3>
                <p className="host-title">Co-Host</p>
              </div>
            </div>
            <div className="host-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" alt="Host" />
              </div>
              <div className="card-content">
                <h3>David Okonkwo</h3>
                <p className="host-title">Guest Host</p>
              </div>
            </div>
            <div className="host-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop" alt="Host" />
              </div>
              <div className="card-content">
                <h3>Amara Okafor</h3>
                <p className="host-title">Producer</p>
              </div>
            </div>
          </div>
        </div>

        
        {/* From the Best Blog Posts */}
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

        {/* Featured Guest Section */}
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
            <div className="guest-card">
              <div className="guest-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" alt="Kingsley George" />
              </div>
              <div className="guest-info">
                <h3>Kingsley George</h3>
                <p className="guest-title">Tech Innovator & CEO</p>
                <div className="guest-episode">
                  <span><i className="fas fa-microphone"></i> Featured in: "Fintech Disruptors"</span>
                </div>
              </div>
            </div>
            <div className="guest-card">
              <div className="guest-image">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" alt="Maria Kim" />
              </div>
              <div className="guest-info">
                <h3>Maria Kim</h3>
                <p className="guest-title">Entrepreneur & Investor</p>
                <div className="guest-episode">
                  <span><i className="fas fa-microphone"></i> Featured in: "From Side Hustle to CEO"</span>
                </div>
              </div>
            </div>
            <div className="guest-card">
              <div className="guest-image">
                <img src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop" alt="Nia Johnson" />
              </div>
              <div className="guest-info">
                <h3>Nia Johnson</h3>
                <p className="guest-title">Creative Director</p>
                <div className="guest-episode">
                  <span><i className="fas fa-microphone"></i> Featured in: "The Creative Economy Renaissance"</span>
                </div>
              </div>
            </div>
            <div className="guest-card">
              <div className="guest-image">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop" alt="Michael Okonkwo" />
              </div>
              <div className="guest-info">
                <h3>Michael Okonkwo</h3>
                <p className="guest-title">Climate Activist</p>
                <div className="guest-episode">
                  <span><i className="fas fa-microphone"></i> Featured in: "Climate Warriors: Youth Taking Action"</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call for Guest Banner */}
        <div className="call-for-guest-banner">
          <div className="call-for-guest-content">
            <div className="call-for-guest-text">
              <h2>Be Our Next Guest</h2>
              <p>Share your story with thousands of listeners across Africa and beyond. We're looking for innovators, creators, and changemakers who are shaping the future.</p>
              <button className="call-for-guest-btn">Apply Now <i className="fas fa-arrow-right"></i></button>
            </div>
            <div className="call-for-guest-icon">
              <i className="fas fa-microphone-alt"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Player */}
      {showMiniPlayer && currentEpisode && (
        <div className="mini-player">
          <div className="mini-player-content">
            <img src={currentEpisode.coverImage} alt={currentEpisode.title} className="mini-player-image" />
            <div className="mini-player-info">
              <h4>{currentEpisode.title}</h4>
              <p>{currentEpisode.guest}</p>
            </div>
            <div className="mini-player-controls">
              <button className="control-btn" onClick={prevEpisode}>
                <i className="fas fa-step-backward"></i>
              </button>
              <button className="play-pause-btn" onClick={() => playEpisode(currentEpisode)}>
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
            }}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastPage;