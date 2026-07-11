import React, { useState, useEffect } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [saveMessage, setSaveMessage] = useState('');
  
  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: ''
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    newsletter: false,
    promotional: false,
    pushNotifications: true
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false
  });

  useEffect(() => {
    // Load user data from API
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        console.log('Fetched user data:', data);
        
        if (data.success) {
          setAccountSettings({
            firstName: data.data.first_name || '',
            lastName: data.data.last_name || '',
            email: data.data.email || '',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            profileImage: data.data.profile_image || ''
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAccountChange = (e) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just store the file object and upload it when saving
      setAccountSettings({
        ...accountSettings,
        profileImage: file
      });
    }
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const handlePrivacyChange = (e) => {
    setPrivacySettings({
      ...privacySettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (section) => {
    try {
      const token = localStorage.getItem('token');
      
      if (section === 'account') {
        const formData = new FormData();
        formData.append('first_name', accountSettings.firstName);
        formData.append('last_name', accountSettings.lastName);
        
        // Only append profile image if it's a file object (not a string URL)
        if (accountSettings.profileImage instanceof File) {
          formData.append('profile_image', accountSettings.profileImage);
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Update localStorage user data
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          userData.first_name = accountSettings.firstName;
          userData.last_name = accountSettings.lastName;
          if (data.data.profile_image) {
            userData.profile_image = data.data.profile_image;
          }
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Update the profile image in state if it was updated
          if (data.data.profile_image) {
            setAccountSettings({
              ...accountSettings,
              profileImage: data.data.profile_image
            });
          }
          
          setSaveMessage('Settings saved successfully!');
          setTimeout(() => setSaveMessage(''), 3000);
        } else {
          setSaveMessage('Error saving settings: ' + (data.error || 'Unknown error'));
        }
      } else {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences</p>
        </div>

        {/* Settings Navigation */}
        <div className="settings-nav">
          <button 
            className={`nav-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fas fa-user"></i>
            Account
          </button>
          <button 
            className={`nav-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i>
            Notifications
          </button>
          <button 
            className={`nav-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <i className="fas fa-shield-alt"></i>
            Privacy
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {saveMessage && (
            <div className="save-message">
              <i className="fas fa-check-circle"></i>
              {saveMessage}
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Information</h2>
              
              {/* Profile Image Upload */}
              <div className="profile-image-upload">
                <div className="current-image">
                  {accountSettings.profileImage && accountSettings.profileImage !== '' ? (
                    <img 
                      src={accountSettings.profileImage} 
                      alt="Profile" 
                      className="profile-preview"
                    />
                  ) : (
                    <div className="profile-preview placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="image-upload-controls">
                  <label className="upload-btn">
                    <i className="fas fa-camera"></i>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p className="upload-hint">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={accountSettings.firstName}
                  onChange={handleAccountChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={accountSettings.lastName}
                  onChange={handleAccountChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={accountSettings.email}
                  onChange={handleAccountChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={accountSettings.phone}
                  onChange={handleAccountChange}
                />
              </div>

              <h3>Change Password</h3>
              
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={accountSettings.currentPassword}
                  onChange={handleAccountChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={accountSettings.newPassword}
                  onChange={handleAccountChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={accountSettings.confirmPassword}
                  onChange={handleAccountChange}
                  placeholder="Confirm new password"
                />
              </div>

              <button className="save-btn" onClick={() => handleSave('account')}>
                Save Changes
              </button>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Email Notifications</h3>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Order Updates</h3>
                    <p>Get notified about your order status</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="orderUpdates"
                      checked={notificationSettings.orderUpdates}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Newsletter</h3>
                    <p>Receive our weekly newsletter</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={notificationSettings.newsletter}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Promotional Emails</h3>
                    <p>Receive special offers and promotions</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="promotional"
                      checked={notificationSettings.promotional}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Push Notifications</h3>
                    <p>Receive push notifications in browser</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <button className="save-btn" onClick={() => handleSave('notifications')}>
                Save Preferences
              </button>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              
              <div className="form-group">
                <label>Profile Visibility</label>
                <select
                  name="profileVisibility"
                  value={privacySettings.profileVisibility}
                  onChange={handlePrivacyChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="friends">Friends Only</option>
                </select>
              </div>

              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Show Email</h3>
                    <p>Allow others to see your email address</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={privacySettings.showEmail}
                      onChange={(e) => setPrivacySettings({
                        ...privacySettings,
                        showEmail: e.target.checked
                      })}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h3>Show Phone</h3>
                    <p>Allow others to see your phone number</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="showPhone"
                      checked={privacySettings.showPhone}
                      onChange={(e) => setPrivacySettings({
                        ...privacySettings,
                        showPhone: e.target.checked
                      })}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="delete-btn">Delete Account</button>
              </div>

              <button className="save-btn" onClick={() => handleSave('privacy')}>
                Save Privacy Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
