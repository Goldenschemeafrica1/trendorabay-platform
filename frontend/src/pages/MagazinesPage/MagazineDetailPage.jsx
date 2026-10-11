import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MagazineDetails from '../../components/magazines/MagazineDetails';
import magazineService from '../../services/magazineService';

const MagazineDetailPage = () => {
  const { slug } = useParams();
  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('Fetching magazine with slug:', slug);
        }
        setLoading(true);
        const data = await magazineService.getMagazineBySlug(slug);
        if (import.meta.env.DEV) {
          console.log('Magazine data received:', data);
        }
        setMagazine(data);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching magazine:', err);
        }
        setError('Failed to load magazine details');
      } finally {
        setLoading(false);
      }
    };

    if (slug && slug !== 'undefined') {
      fetchMagazine();
    } else {
      if (import.meta.env.DEV) {
        console.log('Invalid slug:', slug);
      }
      setLoading(false);
      setError('Invalid magazine slug');
    }
  }, [slug]);

  useEffect(() => {
    document.body.classList.add('magazine-detail-page-body');
    return () => {
      document.body.classList.remove('magazine-detail-page-body');
    };
  }, []);

  if (loading) {
    return (
      <div className="magazine-detail-page">
        <div className="container">
          <div className="loading">Loading magazine details...</div>
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="magazine-detail-page">
        <div className="container">
          <div className="error">{error || 'Magazine not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-detail-page">
      <div className="container">
        <MagazineDetails magazine={magazine} />
      </div>
    </div>
  );
};

export default MagazineDetailPage;
