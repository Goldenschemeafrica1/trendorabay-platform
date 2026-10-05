import React, { useState, useEffect } from 'react';
import teamService from '../../services/teamService';
import './AboutPage.css';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await teamService.getTeamMembers();

        let members = [];

        if (Array.isArray(response)) {
          members = response;
        } else if (response && Array.isArray(response.data)) {
          members = response.data;
        } else if (response && response.data && Array.isArray(response.data.data)) {
          members = response.data.data;
        }

        // Transform data to match frontend expectations
        const transformed = members.map(member => ({
          id: member.id,
          name: member.name || member.full_name,
          role: member.role || member.position || member.title,
          avatar: member.avatar_url || member.avatar || member.image_url || member.profile_image || 'https://i.pravatar.cc/400?img=' + (member.id || 1),
          bio: member.bio || member.description || member.about || ''
        }));

        setTeamMembers(transformed);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">The team</div>
            <h2>People behind the platform.</h2>
            <p>Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">The team</div>
            <h2>People behind the platform.</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">The team</div>
          <h2>People behind the platform.</h2>
          <p>A small, distributed team of storytellers, builders and creators spread across Africa and the diaspora.</p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">
                <img src={member.avatar} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
