import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MusicPage.css';

const MusicPage = () => {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [latestTracks, setLatestTracks] = useState([]);
  const [musicGenres, setMusicGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');

  // Mock data - in production, this would come from an API
  useEffect(() => {
    const loadMusicData = () => {
      // Simulate API loading
      setTimeout(() => {
        setFeaturedArtists([
          {
            id: 1,
            name: 'Afrobeat Collective',
            genre: 'Afrobeat',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
            followers: '125K',
            verified: true
          },
          {
            id: 2,
            name: 'Soul Harmonics',
            genre: 'Soul',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
            followers: '89K',
            verified: true
          },
          {
            id: 3,
            name: 'Urban Sounds',
            genre: 'Hip-Hop',
            image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
            followers: '67K',
            verified: false
          },
          {
            id: 4,
            name: 'Traditional Rhythms',
            genre: 'Traditional',
            image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
            followers: '45K',
            verified: true
          }
        ]);

        setLatestTracks([
          {
            id: 1,
            title: 'African Sunrise',
            artist: 'Afrobeat Collective',
            duration: '3:45',
            plays: '1.2M',
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
            genre: 'Afrobeat'
          },
          {
            id: 2,
            title: 'City Lights',
            artist: 'Urban Sounds',
            duration: '4:12',
            plays: '890K',
            cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop',
            genre: 'Hip-Hop'
          },
          {
            id: 3,
            title: 'Soulful Journey',
            artist: 'Soul Harmonics',
            duration: '5:30',
            plays: '756K',
            cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
            genre: 'Soul'
          },
          {
            id: 4,
            title: 'Drum Circle',
            artist: 'Traditional Rhythms',
            duration: '6:15',
            plays: '432K',
            cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
            genre: 'Traditional'
          },
          {
            id: 5,
            title: 'Digital Dreams',
            artist: 'Urban Sounds',
            duration: '3:58',
            plays: '678K',
            cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
            genre: 'Electronic'
          },
          {
            id: 6,
            title: 'Roots Revival',
            artist: 'Traditional Rhythms',
            duration: '4:45',
            plays: '345K',
            cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
            genre: 'Traditional'
          }
        ]);

        setMusicGenres([
          { id: 'all', name: 'All Genres', count: 156 },
          { id: 'afrobeat', name: 'Afrobeat', count: 45 },
          { id: 'hip-hop', name: 'Hip-Hop', count: 38 },
          { id: 'soul', name: 'Soul', count: 28 },
          { id: 'traditional', name: 'Traditional', count: 22 },
          { id: 'electronic', name: 'Electronic', count: 15 },
          { id: 'jazz', name: 'Jazz', count: 8 }
        ]);

        setLoading(false);
      }, 1000);
    };

    loadMusicData();
  }, []);

  const filteredTracks = selectedGenre === 'all' 
    ? latestTracks 
    : latestTracks.filter(track => track.genre.toLowerCase() === selectedGenre.toLowerCase());

  return (
    <div className="music-page">
      {/* Hero Section */}
      <section className="music-hero">
        <div className="container">
          <div className="music-hero-content">
            <span className="music-hero-tag">🎵 MUSIC COMMUNITY</span>
            <h1>Discover African Music</h1>
            <p>Explore the vibrant sounds of African music, from traditional rhythms to contemporary beats. Connect with artists, discover new tracks, and celebrate the continent's musical heritage.</p>
            <div className="music-hero-stats">
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Artists</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Tracks</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25+</span>
                <span className="stat-label">Genres</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <section className="music-genres">
        <div className="container">
          <div className="genre-filter">
            {musicGenres.map(genre => (
              <button
                key={genre.id}
                className={`genre-btn ${selectedGenre === genre.id ? 'active' : ''}`}
                onClick={() => setSelectedGenre(genre.id)}
              >
                {genre.name}
                <span className="genre-count">{genre.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="music-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Artists</h2>
            <Link to="/community/artists" className="view-all-link">View All Artists →</Link>
          </div>
          
          {loading ? (
            <div className="music-loading">Loading artists...</div>
          ) : (
            <div className="artists-grid">
              {featuredArtists.map(artist => (
                <div key={artist.id} className="artist-card">
                  <div className="artist-image">
                    <img src={artist.image} alt={artist.name} />
                    {artist.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="artist-info">
                    <h3>{artist.name}</h3>
                    <p className="artist-genre">{artist.genre}</p>
                    <p className="artist-followers">{artist.followers} followers</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Tracks */}
      <section className="music-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Tracks</h2>
            <Link to="/community/tracks" className="view-all-link">View All Tracks →</Link>
          </div>
          
          {loading ? (
            <div className="music-loading">Loading tracks...</div>
          ) : (
            <div className="tracks-list">
              {filteredTracks.map((track, index) => (
                <div key={track.id} className="track-item">
                  <div className="track-number">{index + 1}</div>
                  <div className="track-cover">
                    <img src={track.cover} alt={track.title} />
                  </div>
                  <div className="track-info">
                    <h3 className="track-title">{track.title}</h3>
                    <p className="track-artist">{track.artist}</p>
                  </div>
                  <div className="track-genre">{track.genre}</div>
                  <div className="track-plays">{track.plays}</div>
                  <div className="track-duration">{track.duration}</div>
                  <button className="track-play-btn">▶</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Music Community CTA */}
      <section className="music-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Join the Music Community</h2>
            <p>Share your music, connect with fellow artists, and discover new sounds from across the continent.</p>
            <div className="cta-buttons">
              <button className="cta-primary">Upload Your Music</button>
              <button className="cta-secondary">Join as Listener</button>
            </div>
          </div>
        </div>
      </section>

      {/* Music Events */}
      <section className="music-section">
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Music Events</h2>
            <Link to="/events" className="view-all-link">View All Events →</Link>
          </div>
          
          <div className="events-grid">
            <div className="event-card">
              <div className="event-date">
                <span className="event-day">15</span>
                <span className="event-month">OCT</span>
              </div>
              <div className="event-info">
                <h3>Afrobeat Night Live</h3>
                <p>Live performances from top Afrobeat artists</p>
                <p className="event-location">Nairobi, Kenya</p>
              </div>
              <button className="event-register">Register</button>
            </div>
            
            <div className="event-card">
              <div className="event-date">
                <span className="event-day">22</span>
                <span className="event-month">OCT</span>
              </div>
              <div className="event-info">
                <h3>Traditional Music Festival</h3>
                <p>Celebrating African musical heritage</p>
                <p className="event-location">Lagos, Nigeria</p>
              </div>
              <button className="event-register">Register</button>
            </div>
            
            <div className="event-card">
              <div className="event-date">
                <span className="event-day">05</span>
                <span className="event-month">NOV</span>
              </div>
              <div className="event-info">
                <h3>Urban Sounds Showcase</h3>
                <p>Emerging hip-hop and R&B talents</p>
                <p className="event-location">Johannesburg, SA</p>
              </div>
              <button className="event-register">Register</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicPage;