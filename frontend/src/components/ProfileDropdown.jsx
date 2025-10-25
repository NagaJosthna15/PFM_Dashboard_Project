import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture ? `http://localhost:5000${user.profilePicture}` : ''
  });
  const fileInputRef = useRef(null);

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
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to upload profile picture');
        }
      } catch (error) {
        alert('Error uploading profile picture');
      }
    }
  };

  const handleSave = async () => {
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
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="relative">
      <div className='flex items-center space-x-2'>
      <span className="hidden md:block">Welcome, {user?.username}</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900"
      > 
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {user?.profilePicture ? (
            <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium">{user?.username?.[0]?.toUpperCase()}</span>
          )}
        </div>
      </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative">
                {user?.profilePicture ? (
                  <img src={`http://localhost:5000${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-medium">{user?.username?.[0]?.toUpperCase()}</span>
                )}
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black bg-opacity-50 text-white text-xs flex items-center justify-center"
                  >
                    Change
                  </button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                ) : (
                  <h3 className="font-medium text-gray-900">{user?.username}</h3>
                )}
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded text-sm mt-1"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{user?.email}</p>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-col space-y-2">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
                  >
                    Edit Profile
                  </button>
                  <a
                    href="/profile"
                    className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 text-center block"
                  >
                    View Full Profile
                  </a>
                </>
              )}
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;