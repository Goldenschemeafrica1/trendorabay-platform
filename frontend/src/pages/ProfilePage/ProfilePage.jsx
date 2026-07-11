import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+254 700 000 000',
    bio: 'Passionate reader and storyteller. Love exploring African literature and culture.',
    location: 'Nairobi, Kenya',
    website: '',
    joinDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
  });

  const [editForm, setEditForm] = useState({ ...user });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setEditForm({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser({ ...editForm });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              <button className="avatar-edit-btn">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            <div className="profile-info">
              <h1>{user.firstName} {user.lastName}</h1>
              <p className="profile-username">@{user.username}</p>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-meta">
                <span className="meta-item">
                  <i className="fas fa-map-marker-alt"></i>
                  {user.location}
                </span>
                <span className="meta-item">
                  <i className="fas fa-calendar"></i>
                  Joined {user.joinDate}
                </span>
              </div>
            </div>
            <button 
              className={`edit-profile-btn ${isEditing ? 'hidden' : ''}`}
              onClick={handleEdit}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Stats Section */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5</div>
              <div className="stat-label">Subscriptions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">28</div>
              <div className="stat-label">Magazines</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">156</div>
              <div className="stat-label">Points</div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="edit-form-section">
              <h2>Edit Profile</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editForm.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={editForm.website}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {!isEditing && (
            <div className="profile-section">
              <h2>Contact Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{user.phone}</p>
                </div>
                <div className="info-item">
                  <label>Location</label>
                  <p>{user.location}</p>
                </div>
                {user.website && (
                  <div className="info-item">
                    <label>Website</label>
                    <p>
                      <a href={user.website} target="_blank" rel="noopener noreferrer">
                        {user.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Actions */}
          {!isEditing && (
            <div className="profile-section">
              <h2>Account Actions</h2>
              <div className="action-buttons">
                <button className="action-btn secondary">
                  <i className="fas fa-download"></i>
                  Download My Data
                </button>
                <button className="action-btn secondary">
                  <i className="fas fa-shield-alt"></i>
                  Privacy Settings
                </button>
                <button className="action-btn danger">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
