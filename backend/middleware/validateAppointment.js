const validateAppointment = (req, res, next) => {
  const { name, service, date, time, email } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!service || typeof service !== 'string' || service.trim().length === 0) {
    errors.push('Service type is required');
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push('Date must be in YYYY-MM-DD format');
  }

  if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    errors.push('Time must be in HH:mm format');
  }

  if (email && email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = validateAppointment;