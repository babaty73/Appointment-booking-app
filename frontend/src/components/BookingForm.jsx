import { useState, useEffect } from 'react';
import api from '../api/axios';
import { SERVICE_TYPES } from '../constants/services';
import { generateTimeSlots, formatTimeLabel } from '../Utils/timeSlots';

const allSlots = generateTimeSlots();

const todayStr = () => new Date().toISOString().split('T')[0];

const BookingForm = ({ onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: SERVICE_TYPES[0],
    date: '',
    time: '',
  });
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!formData.date) {
        setBookedTimes([]);
        return;
      }
      setLoadingSlots(true);
      try {
        const res = await api.get(`/appointments/date/${formData.date}`);
        const taken = res.data.data
          .filter((a) => a.status !== 'cancelled')
          .map((a) => a.time);
        setBookedTimes(taken);
      } catch (err) {
        console.log("Error:", err)
        setBookedTimes([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchBookedSlots();
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'date' ? { time: '' } : {}),
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.service || !formData.date || !formData.time) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      setFormData({ name: '', email: '', service: SERVICE_TYPES[0], date: '', time: '' });
      setBookedTimes([]);
      if (onBookingSuccess) onBookingSuccess(res.data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(', ') ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Book an Appointment</h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Add your email to look up your bookings later.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            min={todayStr()}
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
          {!formData.date && (
            <p className="text-sm text-gray-400">Select a date first to see available slots.</p>
          )}
          {formData.date && loadingSlots && (
            <p className="text-sm text-gray-400">Loading available slots...</p>
          )}
          {formData.date && !loadingSlots && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {allSlots.map((slot) => {
                const isBooked = bookedTimes.includes(slot);
                const isSelected = formData.time === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                    className={`text-sm py-2 rounded-lg border transition
                      ${isBooked ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through' : ''}
                      ${!isBooked && isSelected ? 'bg-blue-600 text-white border-blue-600' : ''}
                      ${!isBooked && !isSelected ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-400' : ''}
                    `}
                  >
                    {formatTimeLabel(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition"
        >
          {submitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;