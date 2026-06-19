const StatsCards = ({ appointments }) => {
  const today = new Date().toISOString().split('T')[0];

  const total = appointments.length;
  const todayCount = appointments.filter((a) => a.date === today).length;
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

  const cards = [
    { label: 'Total Appointments', value: total, color: 'bg-blue-50 text-blue-700' },
    { label: "Today's Appointments", value: todayCount, color: 'bg-purple-50 text-purple-700' },
    { label: 'Pending', value: pending, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Confirmed', value: confirmed, color: 'bg-green-50 text-green-700' },
    { label: 'Cancelled', value: cancelled, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-xl p-4 shadow-sm ${c.color}`}>
          <p className="text-2xl font-bold">{c.value}</p>
          <p className="text-sm font-medium mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;