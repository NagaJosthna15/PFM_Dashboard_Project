import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
              PFM Dashboard
            </Link>
          </div>
          <div className="flex items-center">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;