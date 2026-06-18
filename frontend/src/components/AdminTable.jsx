import { formatTimeLabel } from '../utils/timeSlots';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmed: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

const AdminTable = ({ appointments, onStatusChange, onDelete }) => {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
        No appointments match the current filters.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a._id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
              <td className="px-4 py-3 text-gray-500">{a.email || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{a.service}</td>
              <td className="px-4 py-3 text-gray-600">{a.date}</td>
              <td className="px-4 py-3 text-gray-600">{formatTimeLabel(a.time)}</td>
              <td className="px-4 py-3">
                <select
                  value={a.status}
                  onChange={(e) => onStatusChange(a._id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize cursor-pointer ${statusStyles[a.status]}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(a._id)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;