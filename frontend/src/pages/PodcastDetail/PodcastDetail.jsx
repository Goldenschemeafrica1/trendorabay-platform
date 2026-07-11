import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import podcastService from '../../services/podcastService';
import './PodcastDetail.css';

const PodcastDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(null);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const data = await podcastService.getPodcastById(id);
        setPodcast(data);
      } catch (err) {
        setError('Failed to load podcast details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error('Audio play error:', err);
          setAudioError('Failed to play audio');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDurationHHMMSS = (durationStr) => {
    if (!durationStr) return '0:00';
    return durationStr;
  };

  if (loading) {
    return (
      <div className="podcast-detail-page">
        <div className="container">
          <div className="loading">Loading podcast details...</div>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="podcast-detail-page">
        <div className="container">
          <div className="error">{error || 'Podcast not found'}</div>
          <button onClick={() => navigate('/podcast')} className="back-button">
            <i className="fas fa-arrow-left"></i> Back to Podcasts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-detail-page">
      <div className="container">
        <button onClick={() => navigate('/podcast')} className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Podcasts
        </button>

        <div className="podcast-detail-header">
          <div className="podcast-detail-info">
            <h1>{podcast.title}</h1>
            <p className="podcast-detail-description">{podcast.description}</p>
            <div className="podcast-detail-people">
              <p className="podcast-detail-host">
                <i className="fas fa-microphone"></i> Host: {podcast.host || 'N/A'}
              </p>
              <p className="podcast-detail-guest">
                <i className="fas fa-user"></i> Guest: {podcast.guest || 'N/A'}
              </p>
              <p className="podcast-detail-series">
                <i className="fas fa-podcast"></i> Series: {podcast.series || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="podcast-detail-body">
          
          {podcast.videoUrl ? (
            <div className="podcast-detail-video">
              <video
                src={podcast.videoUrl}
                controls
                className="detail-video-player"
              />
            </div>
          ) : (
            <div className="podcast-detail-audio">
              {podcast.audioUrl && (
                <>
                  <audio
                    ref={audioRef}
                    src={podcast.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleTimeUpdate}
                    onError={() => {
                      console.error('Audio loading error');
                      setAudioError('Failed to load audio');
                      setIsPlaying(false);
                    }}
                  />
                  
                  <div className="audio-player">
                    <button className="play-button" onClick={togglePlay}>
                      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    
                    <div className="progress-container" ref={progressRef} onClick={handleSeek}>
                      <div 
                        className="progress-bar" 
                        style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="time-display">
                      <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                      <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  
                  {audioError && <div className="audio-error">{audioError}</div>}
                </>
              )}
              
              {!podcast.audioUrl && (
                <div className="no-audio">
                  <i className="fas fa-volume-mute"></i>
                  <p>Audio not available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastDetail;
