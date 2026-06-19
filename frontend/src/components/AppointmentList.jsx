import { useState } from 'react';
import api from '../api/axios';
import { formatTimeLabel } from '../Utils/timeSlots';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmed: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

const AppointmentList = () => {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter the email you used to book.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/appointments', {
        params: { email: email.trim().toLowerCase() },
      });
      setAppointments(res.data.data);
    } catch (err) {
      setError('Could not fetch appointments. Please try again.', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Appointments</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Search
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {!loading && searched && appointments.length === 0 && !error && (
        <p className="text-sm text-gray-400">No appointments found for this email.</p>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div key={a._id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{a.service}</p>
              <p className="text-sm text-gray-500">{a.date} · {formatTimeLabel(a.time)}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${statusStyles[a.status]}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;