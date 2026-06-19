import BookingForm from '../components/BookingForm';
import AppointmentList from '../components/AppointmentList';

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <BookingForm />
      <AppointmentList />
    </div>
  );
};

export default BookingPage;