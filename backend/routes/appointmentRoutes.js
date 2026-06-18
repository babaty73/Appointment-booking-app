const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  getAppointmentsByDate,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

const validateAppointment = require('../middleware/validateAppointment');

router.post('/', validateAppointment, createAppointment);
router.get('/', getAppointments);
router.get('/date/:date', getAppointmentsByDate);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;