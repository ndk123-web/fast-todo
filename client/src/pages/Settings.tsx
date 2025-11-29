import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserInfo';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { userInfo, signOutUser } = useUserStore();
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(userInfo?.fullName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async () => {
    if (newName.trim() && newName !== userInfo?.fullName) {
      setIsSaving(true);
      // TODO: Implement API call to save name to backend
      // await updateUserNameApi(userInfo.userId, newName);
      setTimeout(() => {
        setEditName(false);
        setIsSaving(false);
      }, 500);
    }
  };

  const handleLogout = async () => {
    signOutUser();
    navigate('/');
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <header className="settings-header">
        <div className="settings-header-content">
          <Link to="/dashboard" className="settings-back-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </Link>
          <div className="settings-title">
            <h1>Settings</h1>
            <p>Manage your account and preferences</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="settings-main">
        <div className="settings-container">
          {/* User Profile Section */}
          <section className="settings-card">
            <div className="settings-card-header">
              <h2>User Profile</h2>
              <p>Your account information</p>
            </div>
            
            <div className="settings-card-body">
              <div className="profile-section">
                <div className="profile-avatar">
                  {userInfo?.fullName?.charAt(0) || '✨'}
                </div>
                <div className="profile-info">
                  <div className="info-group">
                    <label>Full Name</label>
                    {editName ? (
                      <div className="edit-name-group">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="edit-name-input"
                          placeholder="Enter your full name"
                          autoFocus
                        />
                        <div className="edit-name-buttons">
                          <button 
                            className="btn-save"
                            onClick={handleSaveName}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={() => {
                              setEditName(false);
                              setNewName(userInfo?.fullName || '');
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-display">
                        <p>{userInfo?.fullName || 'Not set'}</p>
                        <button 
                          className="btn-edit"
                          onClick={() => setEditName(true)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="info-group">
                    <label>Email Address</label>
                    <p className="info-email">{userInfo?.email || 'No email'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Current Plan Section */}
          <section className="settings-card plan-card-special">
            <div className="plan-card-glow"></div>
            
            <div className="settings-card-body">
              <div className="plan-section">
                <div className="plan-header-new">
                  <div className="plan-badge-container">
                    <div className="plan-badge-glow"></div>
                    <div className="plan-badge-free">
                      <span className="plan-badge-icon">💎</span>
                      <span className="plan-badge-text">FREE</span>
                    </div>
                  </div>
                  <div className="plan-text-new">
                    <h3>Free Tier</h3>
                    <p>Perfect for getting started with TaskPlexus</p>
                  </div>
                  <div className="plan-status-indicator">
                    <div className="status-dot active"></div>
                    <span>Active</span>
                  </div>
                </div>
                
                <div className="plan-features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">🏢</div>
                    <div className="feature-details">
                      <span className="feature-number">5</span>
                      <span className="feature-label">Workspaces</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">✅</div>
                    <div className="feature-details">
                      <span className="feature-number">15</span>
                      <span className="feature-label">Todos each</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🎯</div>
                    <div className="feature-details">
                      <span className="feature-number">5</span>
                      <span className="feature-label">Goals each</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <div className="feature-details">
                      <span className="feature-number">∞</span>
                      <span className="feature-label">Analytics</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🌐</div>
                    <div className="feature-details">
                      <span className="feature-number">✓</span>
                      <span className="feature-label">Offline Mode</span>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🔗</div>
                    <div className="feature-details">
                      <span className="feature-number">✓</span>
                      <span className="feature-label">Flowchart View</span>
                    </div>
                  </div>
                </div>

                <div className="plan-upgrade-section">
                  <div className="premium-preview">
                    <div className="premium-header">
                      <span className="premium-icon">⚡</span>
                      <span className="premium-text">Premium Coming Soon</span>
                      <span className="premium-badge">AI-Powered</span>
                    </div>
                    <p className="premium-description">
                      Unlimited everything + AI task suggestions, smart scheduling, and advanced analytics
                    </p>
                  </div>
                  <button className="btn-upgrade-new">
                    <span className="upgrade-icon">🚀</span>
                    Get Notified for Premium
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Account Settings Section */}
          <section className="settings-card">
            <div className="settings-card-header">
              <h2>Account</h2>
              <p>Account security and preferences</p>
            </div>
            
            <div className="settings-card-body">
              <div className="account-section">
                <div className="account-item">
                  <div className="account-info">
                    <h3>Email Notifications</h3>
                    <p>Receive updates about your tasks and goals</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone - Logout */}
          <section className="settings-card settings-card-danger">
            <div className="settings-card-header">
              <h2>Session</h2>
              <p>Sign out from your account</p>
            </div>
            
            <div className="settings-card-body">
              <div className="danger-section">
                <p>You'll need to sign in again to access TaskPlexus after signing out.</p>
                <button 
                  className="btn-logout"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7.5 15.75H3.75C3.34218 15.75 2.95065 15.5955 2.65901 15.3284C2.36737 15.0614 2.25 14.6989 2.25 14.3125V3.6875C2.25 3.30109 2.36737 2.9386 2.65901 2.67159C2.95065 2.40457 3.34218 2.25 3.75 2.25H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.25 12.375L15.75 9L11.25 5.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.75 9H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="settings-footer">
        <p>© 2025 TaskPlexus. All your data is encrypted and secure.</p>
      </footer>
    </div>
  );
};

export default Settings;
