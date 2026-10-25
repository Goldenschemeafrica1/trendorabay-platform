import React from 'react';

const CommunityMembers = ({ members, followingMembers, toggleFollow }) => {
  return (
    <div className="members-section">
      <h2>Members</h2>
      {members.length === 0 ? (
        <p className="empty-state">No members yet</p>
      ) : (
        <div className="members-grid">
          {members.map((member, idx) => (
            <div key={idx} className="member-card">
              <div className="member-avatar">{member.initial}</div>
              <div className="member-info">
                <h4>{member.name}</h4>
                <p className="member-role">{member.role}</p>
                <p className="member-location">{member.location}</p>
                <p className="member-posts">{member.posts} posts</p>
              </div>
              <button 
                className={`follow-btn ${followingMembers.has(member.name) ? 'following' : ''}`}
                onClick={() => toggleFollow(member.name)}
              >
                {followingMembers.has(member.name) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityMembers;
