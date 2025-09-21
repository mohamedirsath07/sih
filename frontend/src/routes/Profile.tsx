import React, { useEffect, useState } from 'react';
import './Profile.css';

// Indian Education Boards (Alphabetically Sorted)
const boardOptions = [
  { value: 'state-andhra', label: 'Andhra Pradesh State Board' },
  { value: 'state-assam', label: 'Assam Higher Secondary Education Council' },
  { value: 'state-bihar', label: 'Bihar School Examination Board' },
  { value: 'state-haryana', label: 'Board of School Education Haryana' },
  { value: 'state-odisha', label: 'Board of Secondary Education Odisha' },
  { value: 'state-rajasthan', label: 'Board of Secondary Education Rajasthan' },
  { value: 'cbse', label: 'CBSE (Central Board of Secondary Education)' },
  { value: 'state-chhattisgarh', label: 'Chhattisgarh Board of Secondary Education' },
  { value: 'state-manipur', label: 'Council of Higher Secondary Education Manipur' },
  { value: 'state-delhi', label: 'Delhi Board of School Education' },
  { value: 'state-goa', label: 'Goa Board of Secondary & Higher Secondary Education' },
  { value: 'state-gujarat', label: 'Gujarat Secondary & Higher Secondary Education Board' },
  { value: 'state-himachal', label: 'Himachal Pradesh Board of School Education' },
  { value: 'icse', label: 'ICSE (Indian Certificate of Secondary Education)' },
  { value: 'state-jharkhand', label: 'Jharkhand Academic Council' },
  { value: 'state-karnataka', label: 'Karnataka Secondary Education Examination Board' },
  { value: 'state-kerala', label: 'Kerala Board of Higher Secondary Education' },
  { value: 'state-madhya', label: 'Madhya Pradesh Board of Secondary Education' },
  { value: 'state-maharashtra', label: 'Maharashtra State Board of Secondary Education' },
  { value: 'state-meghalaya', label: 'Meghalaya Board of School Education' },
  { value: 'state-mizoram', label: 'Mizoram Board of School Education' },
  { value: 'state-nagaland', label: 'Nagaland Board of School Education' },
  { value: 'state-punjab', label: 'Punjab School Education Board' },
  { value: 'state-sikkim', label: 'Sikkim Board of Secondary Education' },
  { value: 'state-tamil', label: 'Tamil Nadu State Board' },
  { value: 'state-telangana', label: 'Telangana State Board of Intermediate Education' },
  { value: 'state-tripura', label: 'Tripura Board of Secondary Education' },
  { value: 'state-up', label: 'Uttar Pradesh Madhyamik Shiksha Parishad' },
  { value: 'state-uttarakhand', label: 'Uttarakhand Board of School Education' },
  { value: 'state-west', label: 'West Bengal Board of Secondary Education' }
];

// Stream options based on education level and board
const getStreamOptions = (educationLevel: string, board: string) => {
  if (educationLevel === 'UG') {
    return [
      { value: 'engineering', label: 'Engineering & Technology' },
      { value: 'medical', label: 'Medical & Health Sciences' },
      { value: 'commerce', label: 'Commerce & Management' },
      { value: 'arts', label: 'Arts & Humanities' },
      { value: 'science', label: 'Pure Sciences' },
      { value: 'law', label: 'Law' },
      { value: 'education', label: 'Education' },
      { value: 'agriculture', label: 'Agriculture & Allied Sciences' }
    ];
  }
  
  // For 11th and 12th classes
  if (board === 'cbse' || board === 'icse') {
    return [
      { value: 'science-pcm', label: 'Science (Physics, Chemistry, Mathematics)' },
      { value: 'science-pcb', label: 'Science (Physics, Chemistry, Biology)' },
      { value: 'science-pcmb', label: 'Science (Physics, Chemistry, Math, Biology)' },
      { value: 'commerce', label: 'Commerce' },
      { value: 'humanities', label: 'Humanities/Arts' }
    ];
  }
  
  // For state boards (varies by state but these are common)
  return [
    { value: 'science', label: 'Science Stream' },
    { value: 'commerce', label: 'Commerce Stream' },
    { value: 'arts', label: 'Arts Stream' },
    { value: 'vocational', label: 'Vocational Stream' }
  ];
};

const Profile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        class: '',
        board: '',
        stream: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Check for user session in localStorage
                const sessionData = localStorage.getItem('userSession');
                if (sessionData) {
                    const userData = JSON.parse(sessionData);
                    const profileData = {
                        name: userData.name || 'Demo User',
                        email: userData.email || 'demo@example.com',
                        phone: '',
                        age: null as number | null,
                        gender: '',
                        class: '',
                        board: '',
                        stream: ''
                    };
                    
                    // Check if we have saved profile data
                    const savedProfile = localStorage.getItem('userProfile');
                    if (savedProfile) {
                        const saved = JSON.parse(savedProfile);
                        Object.assign(profileData, saved);
                    }
                    
                    setProfile(profileData);
                    setFormData({
                        name: profileData.name,
                        email: profileData.email,
                        phone: profileData.phone || '',
                        age: profileData.age ? profileData.age.toString() : '',
                        gender: profileData.gender || '',
                        class: profileData.class || '',
                        board: profileData.board || '',
                        stream: profileData.stream || ''
                    });
                } else {
                    setError('Please log in to view your profile');
                }
            } catch (err: any) {
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Reset stream when class or board changes
        if (field === 'class' || field === 'board') {
            setFormData(prev => ({ ...prev, stream: '' }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        
        try {
            // Save profile data to localStorage
            const profileData = { 
                ...formData,
                age: formData.age ? parseInt(formData.age) : null
            };
            
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            setProfile({ ...profile, ...profileData });
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: any) {
            setError('Failed to save profile data');
        } finally {
            setSaving(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token'); // Clean up any old tokens
        window.location.href = '/login';
    };

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }

    const streamOptions = getStreamOptions(formData.class, formData.board);
    const showBoardSelection = formData.class === '11th' || formData.class === '12th';
    const showStreamSelection = (showBoardSelection && formData.board) || formData.class === 'UG';

    return (
        <div className="profile-wrap">
            <div className="profile-card">
                <div className="profile-header">
                    <h1>Profile</h1>
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: profile.name || '',
                                            email: profile.email || '',
                                            phone: profile.phone || '',
                                            age: profile.age?.toString() || '',
                                            gender: profile.gender || '',
                                            class: profile.class || '',
                                            board: profile.board || '',
                                            stream: profile.stream || ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="profile-content">
                    {!isEditing ? (
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">Name</span>
                                <span className="detail-value">{profile?.name || '—'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{profile?.email || '—'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Phone</span>
                                <span className="detail-value">{profile?.phone || '—'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Age</span>
                                <span className="detail-value">{profile?.age || '—'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Gender</span>
                                <span className="detail-value">{profile?.gender || '—'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Class</span>
                                <span className="detail-value">{profile?.class || '—'}</span>
                            </div>
                            {profile?.board && (
                                <div className="detail-row">
                                    <span className="detail-label">Board</span>
                                    <span className="detail-value">
                                        {boardOptions.find(b => b.value === profile.board)?.label || profile.board}
                                    </span>
                                </div>
                            )}
                            {profile?.stream && (
                                <div className="detail-row">
                                    <span className="detail-label">Stream</span>
                                    <span className="detail-value">{profile.stream}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="profile-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input
                                        id="age"
                                        type="number"
                                        min="10"
                                        max="50"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        placeholder="Age"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="class">Class/Education Level *</label>
                                <select
                                    id="class"
                                    value={formData.class}
                                    onChange={(e) => handleInputChange('class', e.target.value)}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    <option value="11th">11th Grade</option>
                                    <option value="12th">12th Grade</option>
                                    <option value="UG">Undergraduate (UG)</option>
                                </select>
                            </div>

                            {showBoardSelection && (
                                <div className="form-group">
                                    <label htmlFor="board">Education Board *</label>
                                    <select
                                        id="board"
                                        value={formData.board}
                                        onChange={(e) => handleInputChange('board', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Board</option>
                                        {boardOptions.map(board => (
                                            <option key={board.value} value={board.value}>
                                                {board.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {showStreamSelection && (
                                <div className="form-group">
                                    <label htmlFor="stream">Stream/Specialization</label>
                                    <select
                                        id="stream"
                                        value={formData.stream}
                                        onChange={(e) => handleInputChange('stream', e.target.value)}
                                    >
                                        <option value="">Select Stream</option>
                                        {streamOptions.map(stream => (
                                            <option key={stream.value} value={stream.value}>
                                                {stream.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="profile-footer">
                    <button className="btn btn-outline" onClick={logout}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;