import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const statusColors = {
  pending: '#eab308',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

const CalendarView = ({ appointments, onSelectDate }) => {
  const events = appointments.map((a) => {
    const start = moment(`${a.date} ${a.time}`, 'YYYY-MM-DD HH:mm').toDate();
    const end = moment(start).add(30, 'minutes').toDate();
    return {
      id: a._id,
      title: `${a.name} - ${a.service}`,
      start,
      end,
      status: a.status,
      date: a.date,
    };
  });

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: statusColors[event.status] || '#6b7280',
      borderRadius: '6px',
      color: 'white',
      border: 'none',
      fontSize: '12px',
      padding: '2px 4px',
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Calendar View</h3>
      <div className="flex gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: statusColors.confirmed }}></span>
          Confirmed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: statusColors.pending }}></span>
          Pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: statusColors.cancelled }}></span>
          Cancelled
        </span>
      </div>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          defaultView="month"
          eventPropGetter={eventStyleGetter}
          onSelectSlot={(slotInfo) => onSelectDate(moment(slotInfo.start).format('YYYY-MM-DD'))}
          onSelectEvent={(event) => onSelectDate(event.date)}
          selectable
          popup
        />
      </div>
    </div>
  );
};

export default CalendarView;