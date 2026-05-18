import React from 'react';

const TeamSection = () => {
  const teamMembers = [
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
  ];

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
