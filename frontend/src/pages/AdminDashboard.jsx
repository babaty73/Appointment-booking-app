import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';
import CalendarView from '../components/CalendarView';
import AdminTable from '../components/AdminTable';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ date: '', status: '', service: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.data);
    } catch (err) {
      setError('Failed to load appointments.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/appointments/${id}`, { status });
      setAppointments((prev) => prev.map((a) => (a._id === id ? res.data.data : a)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const requestDelete = (appointment) => {
    setConfirmDeleteId(appointment._id);
    setConfirmDeleteItem(appointment);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteItem(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      cancelDelete();
    } catch (err) {
      alert('Failed to delete appointment.', err);
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setFilters((prev) => ({ ...prev, date }));
  };

  const handleClearFilters = () => {
    setFilters({ date: '', status: '', service: '' });
    setSelectedDate('');
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filters.date && a.date !== filters.date) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (filters.service && a.service !== filters.service) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading appointments...</p>
        ) : (
          <>
            <StatsCards appointments={appointments} />
            <CalendarView appointments={appointments} onSelectDate={handleSelectDate} />
            <FilterBar filters={filters} onChange={setFilters} onClear={handleClearFilters} />
            {selectedDate && (
              <p className="text-sm text-gray-500 mb-3">
                Showing appointments for <span className="font-semibold">{selectedDate}</span>{' '}
                <button onClick={handleClearFilters} className="text-blue-600 underline ml-1">clear</button>
              </p>
            )}
            <AdminTable
              appointments={filteredAppointments}
              onStatusChange={handleStatusChange}
              onDelete={requestDelete}
            />
            {confirmDeleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Confirm delete</h2>
                  <p className="text-gray-600 mb-5">
                    Are you sure you want to delete the appointment for{' '}
                    <span className="font-semibold text-gray-900">{confirmDeleteItem?.name}</span> on{' '}
                    <span className="font-semibold text-gray-900">{confirmDeleteItem?.date}</span>?
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={cancelDelete}
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(confirmDeleteId)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;