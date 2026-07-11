import React, { useState, useEffect } from 'react';
import teamService from '../../services/teamService';

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
        }

        // Transform data to match frontend expectations
        const transformed = members.map(member => ({
          id: member.id,
          name: member.name || member.full_name,
          role: member.role || member.position || member.title,
          avatar: member.avatar || member.avatar_url || member.image_url || member.profile_image || '/images/team/default-avatar.jpg',
          bio: member.bio || member.description || member.about || ''
        }));

        setTeamMembers(transformed);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError('Failed to load team members');
        // Set fallback data if API fails
        setTeamMembers([
          {
            id: 1,
            name: "Amina Johnson",
            role: "Founder & Editor-in-Chief",
            avatar: "/images/team/amina-johnson.jpg",
            bio: "Award-winning journalist with 15+ years of experience covering African culture and development."
          },
          {
            id: 2,
            name: "Kofi Mensah",
            role: "Creative Director",
            avatar: "/images/team/kofi-mensah.jpg",
            bio: "Visual artist and designer specializing in contemporary African aesthetics and brand development."
          },
          {
            id: 3,
            name: "Zara Patel",
            role: "Community Manager",
            avatar: "/images/team/zara-patel.jpg",
            bio: "Community builder passionate about creating inclusive spaces for cultural exchange and dialogue."
          },
          {
            id: 4,
            name: "David Okafor",
            role: "Business Development",
            avatar: "/images/team/david-okafor.jpg",
            bio: "Entrepreneur focused on sustainable business models for creative and cultural enterprises."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <p className="team-intro">Loading team members...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <p className="team-intro">{error}</p>
      </section>
    );
  }

  return (
    <section className="team-section">
      <h2>Meet Our Team</h2>
      <p className="team-intro">
        The passionate individuals behind Trendorabay, working to bring you the best of African culture
      </p>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member">
            <div className="member-avatar">
              <img src={member.avatar} alt={member.name} />
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
