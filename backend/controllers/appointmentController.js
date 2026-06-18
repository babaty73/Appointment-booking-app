const Appointment = require('../models/Appointment');

const createAppointment = async (req, res, next) => {
  try {
    const { name, email, service, date, time } = req.body;

    const existing = await Appointment.findOne({
      date,
      time,
      status: { $ne: 'cancelled' },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    const appointment = await Appointment.create({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : '',
      service: service.trim(),
      date,
      time,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const filter = {};
    const { email, date, status, service } = req.query;

    if (email) filter.email = email.toLowerCase();
    if (date) filter.date = date;
    if (status) filter.status = status;
    if (service) filter.service = service;

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

const getAppointmentsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;

    const appointments = await Appointment.find({ date }).sort({ time: 1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentsByDate,
  updateAppointment,
  deleteAppointment,
};