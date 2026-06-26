import React, { useState, useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [stats, setStats] = useState({
    readers: 0,
    countries: 0,
    creators: 0,
    stories: 0
  });

  // Team member data
  const teamData = [
    {
      id: 1,
      name: "Kingsley George",
      role: "Founder & Editor-in-Chief",
      bio: "Former financial journalist turned media entrepreneur. Kingsley founded Trendorabay to amplify African voices in business and culture. He has been featured in Forbes Africa and serves on the board of the African Media Initiative.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
      social: {
        twitter: "@wanjikumwangi",
        linkedin: "wanjiku-mwangi",
        instagram: "@wanjiku.creates"
      },
      expertise: ["Editorial Strategy", "Business Journalism", "Brand Development"],
      quote: "Storytelling is the most powerful tool we have to shape Africa's narrative."
    }
  ];

  // Impact statistics (animated counter)
  const targetStats = {
    readers: 50000,
    countries: 35,
    creators: 250,
    stories: 1200
  };

  useEffect(() => {
    setTeamMembers(teamData);
    
    // Animated counter for stats
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        readers: Math.floor(targetStats.readers * progress),
        countries: Math.floor(targetStats.countries * progress),
        creators: Math.floor(targetStats.creators * progress),
        stories: Math.floor(targetStats.stories * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, interval);
    
    setLoading(false);
    
    return () => clearInterval(timer);
  }, []);

  // Timeline milestones
  const milestones = [
    {
      year: "2019",
      title: "The Beginning",
      description: "Trendorabay Magazine launches as a digital-first publication spotlighting emerging Kenyan entrepreneurs."
    },
    {
      year: "2020",
      title: "Expansion Across Africa",
      description: "Expanded coverage to 15 African countries, launching our first physical edition."
    },
    {
      year: "2021",
      title: "TRENDORAFEST Launch",
      description: "Hosted our first annual festival celebrating African creativity and innovation in Nairobi."
    },
    {
      year: "2022",
      title: "Creator Hub",
      description: "Launched the Creator Hub platform, connecting 200+ African content creators."
    },
    {
      year: "2023",
      title: "Global Recognition",
      description: "Featured in international media and recognized as a leading voice in African media."
    },
    {
      year: "2024",
      title: "The Future",
      description: "Continuing to amplify African stories, launch new initiatives, and shape tomorrow's narrative."
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanded to new markets and launched innovative digital platforms."
    },
    {
      year: "2026",
      title: "Present Day",
      description: "Growing our community and expanding our reach across Africa and beyond."
    }
  ];

  // Values
  const values = [
    {
      title: "Authenticity",
      description: "We tell real stories from real people, celebrating genuine African voices and experiences."
    },
    {
      title: "Innovation",
      description: "We embrace new ideas, technologies, and approaches to storytelling and media."
    },
    {
      title: "Community",
      description: "We believe in the power of connection and collaboration across the continent."
    },
    {
      title: "Impact",
      description: "We measure success by the positive change we create in our communities."
    }
  ];

  // Press mentions
  const press = [
    {
      outlet: "Forbes Africa",
      title: "30 Under 30: Media Innovators Shaping the Continent",
      year: "2024",
      link: "#"
    },
    {
      outlet: "BBC News",
      title: "How Digital Magazines Are Changing African Narratives",
      year: "2025",
      link: "#"
    },
    {
      outlet: "TechCabal",
      title: "Trendorabay's Rise as a Media Powerhouse",
      year: "2025",
      link: "#"
    },
    {
      outlet: "Nation Media",
      title: "Kenyan Platform Making Waves Globally",
      year: "2026",
      link: "#"
    }
  ];

  // Open modal for team member
  const openTeamModal = (member) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeTeamModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="about-loading">
        <div className="loading-spinner"></div>
        <p>Discovering our story...</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="about-content">
        {/* Our Story Section */}
        <div className="story-tab">
            <div className="story-intro">
              <h2>A Movement, Not Just a Magazine</h2>
              <p>
                Trendorabay Magazine was born from a simple yet powerful idea: Africa's stories deserve 
                to be told with the same sophistication, depth, and premium quality as any global publication. 
                What started as a small digital newsletter in Nairobi has grown into a continent-wide platform 
                that reaches hundreds of thousands of readers monthly.
              </p>
            </div>

            <div className="story-milestones">
              <h3>Our Journey</h3>
              <div className="timeline">
                {milestones.map((milestone, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-content">
                      <div className="timeline-year">{milestone.year}</div>
                      <h4>{milestone.title}</h4>
                      <p>{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="story-values">
              <h3>What We Stand For</h3>
              <div className="values-grid">
                {values.map((value, index) => (
                  <div key={index} className="value-card">
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* Mission & Vision Section */}
        <div className="mission-tab">
            <div className="mission-vision-grid">
              <div className="mission-card">
                <h2>Our Mission</h2>
                <p>
                  To be the ultimate platform for emerging businesses and trendsetters in Africa, 
                  providing a space where innovative ideas meet impactful storytelling.
                </p>
                <div className="mission-points">
                  <div className="mission-point">
                    <span>✨</span>
                    <span>Amplify underrepresented African voices and stories</span>
                  </div>
                  <div className="mission-point">
                    <span>📈</span>
                    <span>Connect entrepreneurs with resources and opportunities</span>
                  </div>
                  <div className="mission-point">
                    <span>🌍</span>
                    <span>Build bridges across African markets and global audiences</span>
                  </div>
                </div>
              </div>

              <div className="vision-card">
                <h2>Our Vision</h2>
                <p>
                  Shaping tomorrow's African narrative through stories, style, and solutions — 
                  becoming the most trusted media partner for Africa's next generation of leaders.
                </p>
                <div className="vision-goals">
                  <div className="vision-goal">
                    <h4>2027</h4>
                    <p>Reach 1 million monthly readers across all platforms</p>
                  </div>
                  <div className="vision-goal">
                    <h4>2028</h4>
                    <p>Launch Trendorabay Foundation to support young storytellers</p>
                  </div>
                  <div className="vision-goal">
                    <h4>2030</h4>
                    <p>Become Africa's leading media brand for business and culture</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="commitment-section">
              <h3>Our Commitment</h3>
              <div className="commitment-grid">
                <div className="commitment-item">
                  <div className="commitment-check">✓</div>
                  <div>
                    <strong>Editorial Integrity</strong>
                    <p>Fact-checked, authentic journalism you can trust</p>
                  </div>
                </div>
                <div className="commitment-item">
                  <div className="commitment-check">✓</div>
                  <div>
                    <strong>Diversity & Inclusion</strong>
                    <p>Representing voices from every corner of Africa</p>
                  </div>
                </div>
                <div className="commitment-item">
                  <div className="commitment-check">✓</div>
                  <div>
                    <strong>Sustainable Growth</strong>
                    <p>Building a media business that lasts</p>
                  </div>
                </div>
                <div className="commitment-item">
                  <div className="commitment-check">✓</div>
                  <div>
                    <strong>Community First</strong>
                    <p>Putting our audience at the center of everything</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Team Section */}
        <div className="team-tab">
            <div className="team-intro">
              <h2>The People Behind Trendorabay</h2>
              <p>
                Our team is a diverse group of storytellers, strategists, and creatives united by 
                a shared passion for African excellence. Meet the minds shaping our narrative.
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map(member => (
                <div key={member.id} className="team-card" onClick={() => openTeamModal(member)}>
                  <div className="team-card-image">
                    <img src={member.image} alt={member.name} />
                    <div className="team-card-overlay">
                      <span>View Profile →</span>
                    </div>
                  </div>
                  <div className="team-card-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="join-team-section">
              <h3>Join Our Team</h3>
              <p>We're always looking for passionate storytellers, creatives, and innovators to join our growing team.</p>
              <button className="join-team-btn">View Open Positions →</button>
            </div>
          </div>

        {/* Impact Section */}
        <div className="impact-tab">
            <div className="impact-stories">
              <h3>Success Stories</h3>
              <div className="impact-stories-grid">
                <div className="impact-story-card">
                  <h4>Startup Spotlight</h4>
                  <p>Featured 50+ startups that went on to raise over $2.5M in combined funding</p>
                </div>
                <div className="impact-story-card">
                  <h4>Creator Program</h4>
                  <p>Trained 200+ creators across 12 African countries through our workshops</p>
                </div>
                <div className="impact-story-card">
                  <h4>Media Recognition</h4>
                  <p>Cited by global publications and academic institutions for our reporting</p>
                </div>
                <div className="impact-story-card">
                  <h4>Partnerships</h4>
                  <p>Collaborated with 75+ brands and organizations across the continent</p>
                </div>
              </div>
            </div>

            <div className="press-section">
              <h3>Press & Recognition</h3>
              <div className="press-grid">
                {press.map((item, index) => (
                  <a key={index} href={item.link} className="press-card">
                    <div className="press-outlet">{item.outlet}</div>
                    <div className="press-title">{item.title}</div>
                    <div className="press-year">{item.year}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
      </div>

      {/* Team Member Modal */}
      {selectedMember && (
        <div className="team-modal" onClick={closeTeamModal}>
          <div className="team-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeTeamModal}>×</button>
            <div className="modal-grid">
              <div className="modal-image">
                <img src={selectedMember.image} alt={selectedMember.name} />
              </div>
              <div className="modal-info">
                <h2>{selectedMember.name}</h2>
                <p className="modal-role">{selectedMember.role}</p>
                <p className="modal-bio">{selectedMember.bio}</p>
                <div className="modal-expertise">
                  <strong>Expertise:</strong>
                  <div className="expertise-tags">
                    {selectedMember.expertise.map((exp, i) => (
                      <span key={i} className="expertise-tag">{exp}</span>
                    ))}
                  </div>
                </div>
                <div className="modal-quote">
                  <span className="quote-mark">"</span>
                  {selectedMember.quote}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;