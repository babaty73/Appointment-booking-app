export const generateTimeSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;
  while (hour < 17 || (hour === 17 && minute === 0)) {
    const hh = hour.toString().padStart(2, '0');
    const mm = minute.toString().padStart(2, '0');
    slots.push(`${hh}:${mm}`);
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  return slots;
};

export const formatTimeLabel = (time) => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
};