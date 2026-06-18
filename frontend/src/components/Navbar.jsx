import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold text-gray-800">📅 BookEase</span>
        <div className="flex gap-2">
          <Link to="/" className={linkClasses('/')}>Book Appointment</Link>
          <Link to="/admin" className={linkClasses('/admin')}>Admin Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;