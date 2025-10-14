import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append('profilePicture', file);
      
      try {
        const response = await fetch('http://localhost:5000/api/users/profile/upload', {
          method: 'POST',
          credentials: 'include',
          body: formDataUpload
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({ ...formData, profilePicture: `http://localhost:5000${data.profilePicture}` });
          alert('Profile picture updated successfully!');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to upload profile picture');
        }
      } catch (error) {
        alert('Error uploading profile picture');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update user context if needed
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="sm:flex sm:items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 display-block m-auto overflow-hidden">
                {user?.profilePicture ? (
                  <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-medium">{user?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                     
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;