import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Plane, 
  Star, 
  CreditCard,
  Shield,
  CheckCircle,
  User
} from 'lucide-react';
import Card from '../UI/Card';
import type { HelicopterOption, SearchCriteria, PassengerInfo } from '../../types';

interface BookingSummaryProps {
  selectedOption: HelicopterOption;
  searchCriteria: SearchCriteria;
  passengers: PassengerInfo[];
  currentStep: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedOption,
  searchCriteria,
  passengers,
  currentStep
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateTotalPrice = () => {
    // In a real app, this might include additional fees, taxes, etc.
    return selectedOption.price;
  };

  return (
    <div className="space-y-6">
      {/* Flight Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Summary</h3>
        
        {/* Route */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {searchCriteria.route.departure.name} → {searchCriteria.route.arrival.name}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDateTime(searchCriteria.departureDate, searchCriteria.departureTime)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{selectedOption.duration} minutes flight time</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>{searchCriteria.passengers} passenger{searchCriteria.passengers !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Helicopter Info */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={selectedOption.helicopter.photo}
              alt={selectedOption.helicopter.model}
              className="w-16 h-12 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium text-gray-900">{selectedOption.helicopter.model}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <Plane className="w-3 h-3 mr-1" />
                <span>{selectedOption.helicopter.capacity} seats</span>
                {selectedOption.helicopter.year && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{selectedOption.helicopter.year}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pilot Info */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-3">
            <img
              src={selectedOption.pilot.photo}
              alt={selectedOption.pilot.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{selectedOption.pilot.name}</h4>
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(selectedOption.pilot.rating)}</div>
                <span className="text-sm text-gray-600">({selectedOption.pilot.rating})</span>
              </div>
              <p className="text-xs text-gray-500">{selectedOption.pilot.experience}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Passenger Summary */}
      {currentStep >= 1 && passengers.some(p => p.firstName || p.lastName) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Passengers</h3>
            <div className="space-y-3">
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      {passenger.firstName || passenger.lastName ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">
                            {passenger.firstName} {passenger.lastName}
                          </p>
                          {passenger.email && (
                            <p className="text-xs text-gray-500">{passenger.email}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Passenger {index + 1} - Pending
                        </p>
                      )}
                    </div>
                  </div>
                  {passenger.firstName && passenger.lastName && passenger.email && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Price Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Helicopter Service ({searchCriteria.passengers} passenger{searchCriteria.passengers !== 1 ? 's' : ''})
            </span>
            <span className="text-gray-900">{formatPrice(selectedOption.price)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fuel & Operating Costs</span>
            <span className="text-gray-900">Included</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pilot & Crew</span>
            <span className="text-gray-900">Included</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Insurance & Safety</span>
            <span className="text-gray-900">Included</span>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(calculateTotalPrice())}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-700">
            <p className="font-medium mb-1">Secure Booking</p>
            <p>Your information is protected with bank-level encryption and security.</p>
          </div>
        </div>
      </Card>

      {/* Demo Notice */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start space-x-3">
          <CreditCard className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-700">
            <p className="font-medium mb-1">Demo Mode</p>
            <p>This is a demonstration. No real payment will be processed.</p>
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <Card className="p-4 bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Need assistance?</p>
          <p className="text-sm font-medium text-gray-900">
            Call: <a href="tel:+1-555-HELI-AIR" className="text-sky-600 hover:text-sky-700">+1 (555) HELI-AIR</a>
          </p>
          <p className="text-sm text-gray-600">
            Email: <a href="mailto:book@heliaer.com" className="text-sky-600 hover:text-sky-700">book@heliaer.com</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default BookingSummary;