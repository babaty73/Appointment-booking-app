require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const appointmentRoutes = require('./routes/appointmentRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});