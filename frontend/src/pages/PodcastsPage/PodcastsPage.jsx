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
    coverImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    date: "2026-04-20",
    trending: true,
    plays: 12450
  },
  {
    id: 2,
    title: "The Creative Economy Renaissance",
    guest: "Eliud Kipchoge (artist)",
    duration: "38:42",
    category: "Culture & Lifestyle",
    series: "Culture Talks",
    description: "Exploring how African artists are reshaping global culture and building sustainable careers.",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop",
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
    guest: "Makena Njeri (music exec)",
    duration: "47:12",
    category: "Culture & Lifestyle",
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
  {
    id: 4,
    name: "Culture Talks",
    description: "Art, music & modern African identity",
    icon: "🎨",
    color: "#E67E22",
    episodeCount: 27,
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop"
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

      {/* Live Podcast Section */}
      <section className="live-podcast-section">
        <div className="container">
          <div className="live-header">
                                              </div>
          
          <div className="live-content">
            <div className="live-video-container">
              <div className="live-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/OMRVcaWzYFc"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen>
                </iframe>
              </div>
              <div className="live-controls">
                <button className="live-control-btn">
                  <i className="fas fa-expand"></i>
                </button>
                <button className="live-control-btn">
                  <i className="fas fa-volume-up"></i>
                </button>
                <button className="live-control-btn">
                  <i className="fas fa-cog"></i>
                </button>
              </div>
            </div>
            
            <div className="live-sidebar">
              <div className="live-info-card">
                <h3>MUSIC</h3>
                <div className="episode-info">
                  <h4>Tech Innovation in Nairobi</h4>
                  <p>with guest speakers from Kenya's thriving startup ecosystem</p>
                  </div>
              </div>
              
                          </div>
          </div>
        </div>
      </section>

      
      {/* Main Content */}
      <div className="container">

        {/* Featured Series Section - Expanded */}
        <div className="featured-series-section">
          <div className="section-header">
            <h2>Featured Series</h2>
            <button className="view-all">View All Series <i className="fas fa-arrow-right"></i></button>
          </div>
          <div className="featured-series-grid">
            {featuredSeriesList.map(series => (
              <div key={series.id} className="featured-series-card">
                <div className="series-image-wrapper">
                  <img src={series.coverImage} alt={series.name} className="series-cover" />
                </div>
                <div className="series-info">
                  <h3>{series.name}</h3>
                  <p>{series.description}</p>
                  <div className="series-meta">
                    <span><i className="fas fa-headphones"></i> {series.episodeCount} episodes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="episodes-section">
          <div className="section-header">
            <h2>Latest Episodes</h2>
            <span className="episode-count">{filteredEpisodes.length} episodes available</span>
          </div>
          
          <div className="episodes-grid">
            {filteredEpisodes.map(episode => (
              <div key={episode.id} className="episode-card">
                <div className="card-image">
                  <img src={episode.coverImage} alt={episode.title} />
                  <button 
                    className="play-overlay"
                    onClick={() => playEpisode(episode)}
                  >
                    <i className={`fas ${currentEpisode?.id === episode.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <span className="episode-duration-badge">{episode.duration}</span>
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

        
        {/* Featured Guest Section */}
        <div className="featured-guest-section">
          <div className="section-header">
            <h2>Featured Guests</h2>
            <span className="guest-count">Amazing voices shaping Africa's future</span>
          </div>
          <div className="featured-guests-grid">
            <div className="guest-card">
              <div className="guest-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" alt="Kingsley George" />
              </div>
              <div className="guest-info">
                <h3>Kingsley George</h3>
                <p className="guest-title">Tech Innovator & CEO</p>
                <p className="guest-description">Leading Africa's digital transformation with groundbreaking fintech solutions.</p>
                <div className="guest-episode">
                  <span><i className="fas fa-microphone"></i> Featured in: "Fintech Disruptors"</span>
                </div>
              </div>
            </div>
            <div className="guest-card">
              <div className="guest-image">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" alt="Declan Okeya" />
              </div>
              <div className="guest-info">
                <h3>Declan Okeya</h3>
                <p className="guest-title">Entrepreneur & Investor</p>
                <p className="guest-description">From startup founder to venture capitalist, funding the next generation of African innovators.</p>
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
                <p className="guest-description">Redefining African art and culture on the global stage through innovative creative expression.</p>
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
                <p className="guest-description">Championing environmental justice and sustainable solutions across the African continent.</p>
                <div className="guest-episode">
                  <span><i className="fas fa-microphone"></i> Featured in: "Climate Warriors: Youth Taking Action"</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Host Section */}
        <div className="host-section">
          <div className="host-card">
            <div className="host-image">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" alt="Akinyi Ochieng" />
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop" alt="Brian Otieno" className="host-second" />
            </div>
            <div className="host-info">
              <h2>Meet Your Hosts</h2>
              <h3>Akinyi Ochieng <span>&</span> Brian Otieno</h3>
              <p>Storytellers, entrepreneurs, and passionate advocates for African innovation. With combined decades of media and tech experience, Akinyi and Brian bring you unfiltered conversations with the continent's most exciting voices.</p>
              <div className="host-quote">
                <i className="fas fa-quote-left"></i>
                <p>"We don't just interview — we archive the African dream. Every story shared is a seed planted for future generations."</p>
              </div>
              <div className="host-social">
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>

        
        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Never Miss an Episode</h3>
            <p>Get the latest stories delivered straight to your inbox</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" id="podcast-newsletter-email" name="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe <i className="fas fa-arrow-right"></i></button>
            </form>
          </div>
          <div className="community-grid">
            <div className="community-card">
              <h4>Call for Guests</h4>
              <p>Have a story worth sharing? Apply to be featured on the show.</p>
            </div>
            <div className="community-card">
              <h4>Submit Your Story</h4>
              <p>Share your journey, impact, or idea with our global audience.</p>
            </div>
            <div className="community-card">
              <h4>Partner With Us</h4>
              <p>Align your brand with Africa's most exciting voices.</p>
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