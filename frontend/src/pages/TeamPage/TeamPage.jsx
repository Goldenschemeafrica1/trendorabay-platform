import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeamPage.css';

// Team data - same as AboutPage but focused on team
const teamMembers = [
  {
    id: 1,
    name: 'Kingsley George',
    role: 'Founder & Editor-in-Chief',
    bio: 'Former Vogue Africa editor with 15 years experience in African media. Passionate about telling authentic African stories.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Editorial', 'Media Strategy', 'Content Curation'],
    location: 'Lagos, Nigeria',
    joined: '2022'
  },
  {
    id: 8,
    name: 'Declan Okeya',
    role: 'Photography Director',
    bio: 'Award-winning photographer capturing authentic African stories. Work featured in National Geographic and Time Magazine.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Photography', 'Visual Storytelling', 'Photo Editing'],
    location: 'Nairobi, Kenya',
    joined: '2022'
  },
  {
    id: 7,
    name: 'Ibrahim Ndeje',
    role: 'Senior Writer',
    bio: 'Investigative journalist covering politics and social issues across East Africa. Pulitzer Prize nominee.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Investigative Journalism', 'Political Analysis', 'Long-form Writing'],
    location: 'Dar es Salaam, Tanzania',
    joined: '2023'
  },
  {
    id: 2,
    name: 'Kwame Mensah',
    role: 'Creative Director',
    bio: 'Award-winning designer from Accra. His work has been featured in Communication Arts and Wallpaper*.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Graphic Design', 'Brand Strategy', 'Creative Direction'],
    location: 'Accra, Ghana',
    joined: '2022'
  },
  {
    id: 3,
    name: 'Zola Ndlovu',
    role: 'Head of Business & Strategy',
    bio: 'Former McKinsey consultant specializing in African markets. Leads our business hub and real estate section.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Business Strategy', 'Market Analysis', 'Partnerships'],
    location: 'Johannesburg, South Africa',
    joined: '2022'
  },
  {
    id: 4,
    name: 'Efia Asante',
    role: 'Culture & Lifestyle Editor',
    bio: 'Writer and curator based in Lagos. Covers art, fashion, and urban culture across the continent.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Cultural Journalism', 'Art Curation', 'Fashion Writing'],
    location: 'Lagos, Nigeria',
    joined: '2023'
  },
  {
    id: 5,
    name: 'James Mwangi',
    role: 'Tech & Innovation Editor',
    bio: 'Tech journalist covering African startups and innovation. Previously at TechCrunch and Forbes Africa.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Tech Journalism', 'Startup Coverage', 'Innovation Analysis'],
    location: 'Nairobi, Kenya',
    joined: '2023'
  },
  {
    id: 6,
    name: 'Fatima Diop',
    role: 'Community Manager',
    bio: 'Builds and nurtures our creator community. Organizes TRENDORAFEST and monthly meetups.',
    image: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=400&auto=format',
    social: {
      twitter: '#',
      linkedin: '#',
      instagram: '#',
    },
    expertise: ['Community Building', 'Event Management', 'Creator Relations'],
    location: 'Dakar, Senegal',
    joined: '2023'
  },
];

const TeamPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredMembers = filter === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.expertise.includes(filter));

  const expertiseFilters = ['all', ...new Set(teamMembers.flatMap(member => member.expertise))];

  return (
    <div className="team-page">
      {/* Hero Section */}
      <section className="team-hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="accent">✦</span> 
              Meet Our Team
            </h1>
            <p className="hero-subtitle">
              Passionate storytellers, creators, and innovators from across Africa 
              working together to elevate African voices.
            </p>
            <div className="team-stats">
              <div className="stat">
                <span className="number">{teamMembers.length}</span>
                <span className="label">Team Members</span>
              </div>
              <div className="stat">
                <span className="number">8</span>
                <span className="label">Countries</span>
              </div>
              <div className="stat">
                <span className="number">50+</span>
                <span className="label">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Filter Section */}
      <section className="team-filters">
        <div className="container">
          <div className="filter-tabs">
            {expertiseFilters.map((expertise) => (
              <button
                key={expertise}
                className={`filter-tab ${filter === expertise ? 'active' : ''}`}
                onClick={() => setFilter(expertise)}
              >
                {expertise === 'all' ? 'All Team' : expertise}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="team-grid-section">
        <div className="container">
          <div className="team-grid">
            {filteredMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="member-header">
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                    <div className="member-overlay">
                      <button 
                        className="view-profile-btn"
                        onClick={() => setSelectedMember(member)}
                      >
                        <i className="fas fa-eye"></i>
                        View Profile
                      </button>
                    </div>
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <div className="member-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {member.location}
                    </div>
                  </div>
                </div>
                
                <div className="member-details">
                  <p className="member-bio">{member.bio}</p>
                  
                  <div className="member-expertise">
                    <h4>Expertise</h4>
                    <div className="expertise-tags">
                      {member.expertise.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="member-footer">
                    <div className="joined-date">
                      <i className="fas fa-calendar-alt"></i>
                      Joined {member.joined}
                    </div>
                    <div className="member-social">
                      <a href={member.social.twitter} className="social-link">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href={member.social.linkedin} className="social-link">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href={member.social.instagram} className="social-link">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team CTA */}
      <section className="join-team-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Want to Join Our Team?</h2>
            <p>
              We're always looking for talented individuals who are passionate about African stories 
              and want to make a difference.
            </p>
            <div className="cta-buttons">
              <Link to="/careers" className="btn btn-primary">
                <i className="fas fa-briefcase"></i>
                View Openings
              </Link>
              <Link to="/contribute" className="btn btn-secondary">
                <i className="fas fa-feather-alt"></i>
                Contribute as Writer
              </Link>
            </div>
          </div>
        </div>
        <div className="cta-pattern"></div>
      </section>

      {/* Member Modal */}
      {selectedMember && (
        <div className="member-modal" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedMember(null)}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              <img src={selectedMember.image} alt={selectedMember.name} />
              <div className="modal-info">
                <h2>{selectedMember.name}</h2>
                <p className="modal-role">{selectedMember.role}</p>
                <div className="modal-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {selectedMember.location}
                </div>
              </div>
            </div>
            
            <div className="modal-body">
              <p className="modal-bio">{selectedMember.bio}</p>
              
              <div className="modal-expertise">
                <h3>Areas of Expertise</h3>
                <div className="expertise-tags">
                  {selectedMember.expertise.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div className="modal-social">
                <h3>Connect</h3>
                <div className="social-links">
                  <a href={selectedMember.social.twitter} className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href={selectedMember.social.linkedin} className="social-link">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href={selectedMember.social.instagram} className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
