import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Download,
  Mail,
  MapPin,
  Clock,
  Users,
  Calendar,
  Plane,
  Star,
  PrinterIcon,
  MessageSquare,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import type { BookingData } from '../../types';

interface BookingConfirmationProps {
  bookingData: BookingData;
  onNewBooking: () => void;
  onBackToHome: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  onNewBooking,
  onBackToHome
}) => {

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const flightInfo = formatDateTime(
    bookingData.searchCriteria.departureDate, 
    bookingData.searchCriteria.departureTime
  );

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert('In production, this would download your helicopter ticket as a PDF.');
  };

  const handlePrintTicket = () => {
    // In a real app, this would open a print dialog
    window.print();
  };

  const handleSendEmail = () => {
    // In a real app, this would send confirmation email
    alert('Confirmation email has been sent to ' + bookingData.passengers[0].email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Booking Confirmed!
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Your helicopter flight has been successfully booked
          </motion.p>
          
          <motion.div
            className="text-lg font-medium text-sky-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Confirmation #: <span className="font-mono">{bookingData.bookingReference}</span>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button onClick={handleDownloadTicket} variant="primary" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          
          <Button onClick={handlePrintTicket} variant="outline" size="lg">
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
          
          <Button onClick={handleSendEmail} variant="outline" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Email Copy
          </Button>
        </motion.div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Flight Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                Flight Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Route</p>
                      <p className="text-sm text-gray-600">
                        {bookingData.searchCriteria.route.departure.name} → {bookingData.searchCriteria.route.arrival.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Date</p>
                      <p className="text-sm text-gray-600">{flightInfo.date}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Departure Time</p>
                      <p className="text-sm text-gray-600">{flightInfo.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Passengers</p>
                      <p className="text-sm text-gray-600">
                        {bookingData.passengers.length} passenger{bookingData.passengers.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Flight Duration</p>
                      <p className="text-sm text-gray-600">{bookingData.selectedOption.duration} minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Helicopter & Pilot */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Aircraft & Pilot</h2>
              
              {/* Helicopter */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={bookingData.selectedOption.helicopter.photo}
                    alt={bookingData.selectedOption.helicopter.model}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {bookingData.selectedOption.helicopter.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {bookingData.selectedOption.helicopter.capacity} seats • {bookingData.selectedOption.helicopter.year}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pilot */}
              <div className="border-t pt-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={bookingData.selectedOption.pilot.photo}
                    alt={bookingData.selectedOption.pilot.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {bookingData.selectedOption.pilot.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex">{renderStars(bookingData.selectedOption.pilot.rating)}</div>
                      <span className="text-sm text-gray-600">({bookingData.selectedOption.pilot.rating})</span>
                    </div>
                    <p className="text-sm text-gray-600">{bookingData.selectedOption.pilot.experience}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Passenger List */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Passenger Information</h2>
            
            <div className="space-y-4">
              {bookingData.passengers.map((passenger, index) => (
                <div key={passenger.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{passenger.email}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {passenger.identification.type.charAt(0).toUpperCase() + passenger.identification.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">{passenger.identification.number}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Important Information */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
              Important Flight Information
            </h2>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Check-in:</strong> Please arrive 30 minutes before your scheduled departure time
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Documentation:</strong> Bring valid government-issued photo ID matching your booking information
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Weather Policy:</strong> Flights may be rescheduled due to weather conditions for your safety
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>
                  <strong>Contact:</strong> Any questions? Call us at{' '}
                  <a href="tel:+1-555-HELI-AIR" className="text-blue-600 hover:text-blue-700">
                    +1 (555) HELI-AIR
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Demo Notice */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-amber-900">Investor Demo Complete</h2>
            </div>
            
            <div className="text-amber-800 space-y-2">
              <p>
                <strong>🎉 Congratulations!</strong> You've just experienced HeliAer's complete booking flow.
              </p>
              <p>
                This demonstration showcases our AI-powered matching system, professional booking interface, 
                and investor-ready user experience.
              </p>
              <p className="pt-2">
                <strong>Ready to invest?</strong> Contact us at{' '}
                <a href="mailto:invest@heliaer.com" className="text-amber-700 hover:text-amber-800 underline">
                  invest@heliaer.com
                </a>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Button onClick={onNewBooking} variant="primary" size="lg">
            Book Another Flight
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button onClick={onBackToHome} variant="outline" size="lg">
            Back to Home
          </Button>
          
          <Button
            onClick={() => window.open('mailto:invest@heliaer.com?subject=HeliAer Investment Opportunity')}
            variant="outline"
            size="lg"
          >
            Contact for Investment
            <Mail className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;