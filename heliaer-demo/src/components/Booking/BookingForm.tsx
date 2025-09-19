import React, { useReducer } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Shield, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import PassengerInfoForm from './PassengerInfoForm';
import BookingSummary from './BookingSummary';
import type { 
  HelicopterOption, 
  SearchCriteria, 
  PassengerInfo, 
  BookingFormData, 
  BookingFormErrors 
} from '../../types';

interface BookingFormProps {
  selectedOption: HelicopterOption;
  searchCriteria: SearchCriteria;
  onSubmitBooking: (bookingData: BookingFormData) => void;
  onBack: () => void;
}

// Booking form reducer
interface BookingFormState {
  currentStep: number;
  formData: BookingFormData;
  errors: BookingFormErrors;
  isSubmitting: boolean;
}

type BookingFormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_PASSENGER'; payload: { index: number; passenger: PassengerInfo } }
  | { type: 'ADD_PASSENGER' }
  | { type: 'REMOVE_PASSENGER'; payload: number }
  | { type: 'UPDATE_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_ERRORS'; payload: BookingFormErrors }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' };

const generateEmptyPassenger = (index: number): PassengerInfo => ({
  id: `passenger-${index}-${Date.now()}`,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  identification: {
    type: 'passport',
    number: '',
    expiryDate: '',
    issuingAuthority: ''
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  },
  specialRequirements: ''
});

const bookingFormReducer = (state: BookingFormState, action: BookingFormAction): BookingFormState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_PASSENGER':
      const updatedPassengers = [...state.formData.passengers];
      updatedPassengers[action.payload.index] = action.payload.passenger;
      return {
        ...state,
        formData: { ...state.formData, passengers: updatedPassengers }
      };
    
    case 'ADD_PASSENGER':
      return {
        ...state,
        formData: {
          ...state.formData,
          passengers: [...state.formData.passengers, generateEmptyPassenger(state.formData.passengers.length)]
        }
      };
    
    case 'REMOVE_PASSENGER':
      return {
        ...state,
        formData: {
          ...state.formData,
          passengers: state.formData.passengers.filter((_, index) => index !== action.payload)
        }
      };
    
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.payload.field]: action.payload.value }
      };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'RESET_FORM':
      return {
        currentStep: 1,
        formData: {
          passengers: [generateEmptyPassenger(0)],
          specialInstructions: '',
          agreeToTerms: false,
          agreeToSafety: false
        },
        errors: {},
        isSubmitting: false
      };
    
    default:
      return state;
  }
};

const BookingForm: React.FC<BookingFormProps> = ({
  selectedOption,
  searchCriteria,
  onSubmitBooking,
  onBack
}) => {
  const [state, dispatch] = useReducer(bookingFormReducer, {
    currentStep: 1,
    formData: {
      passengers: Array.from({ length: searchCriteria.passengers }, (_, i) => generateEmptyPassenger(i)),
      specialInstructions: '',
      agreeToTerms: false,
      agreeToSafety: false
    },
    errors: {},
    isSubmitting: false
  });

  const steps = [
    { number: 1, title: 'Passenger Information', icon: Users },
    { number: 2, title: 'Terms & Conditions', icon: Shield },
    { number: 3, title: 'Review & Book', icon: CheckCircle }
  ];

  const validateForm = (): boolean => {
    const errors: BookingFormErrors = {};
    
    // Validate passengers
    state.formData.passengers.forEach((passenger, index) => {
      const passengerErrors: any = {};
      
      if (!passenger.firstName.trim()) passengerErrors.firstName = 'First name is required';
      if (!passenger.lastName.trim()) passengerErrors.lastName = 'Last name is required';
      if (!passenger.email.trim()) passengerErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        passengerErrors.email = 'Please enter a valid email address';
      }
      if (!passenger.phone.trim()) passengerErrors.phone = 'Phone number is required';
      if (!passenger.dateOfBirth) passengerErrors.dateOfBirth = 'Date of birth is required';
      
      // Validate identification
      if (!passenger.identification.number.trim()) {
        passengerErrors.identification = { number: 'Document number is required' };
      }
      if (!passenger.identification.expiryDate) {
        passengerErrors.identification = { 
          ...passengerErrors.identification, 
          expiryDate: 'Expiry date is required' 
        };
      }
      if (!passenger.identification.issuingAuthority.trim()) {
        passengerErrors.identification = { 
          ...passengerErrors.identification, 
          issuingAuthority: 'Issuing authority is required' 
        };
      }
      
      // Validate emergency contact
      if (!passenger.emergencyContact.name.trim()) {
        passengerErrors.emergencyContact = { name: 'Emergency contact name is required' };
      }
      if (!passenger.emergencyContact.phone.trim()) {
        passengerErrors.emergencyContact = { 
          ...passengerErrors.emergencyContact, 
          phone: 'Emergency contact phone is required' 
        };
      }
      
      if (Object.keys(passengerErrors).length > 0) {
        errors[`passenger-${index}`] = passengerErrors;
      }
    });
    
    // Validate terms and conditions
    if (!state.formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    if (!state.formData.agreeToSafety) {
      errors.agreeToSafety = 'You must acknowledge the safety briefing';
    }
    
    dispatch({ type: 'SET_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (state.currentStep === 1) {
      // Validate passenger information
      const hasValidPassengers = state.formData.passengers.every(passenger => 
        passenger.firstName && passenger.lastName && passenger.email && passenger.phone
      );
      if (!hasValidPassengers) {
        validateForm();
        return;
      }
    }
    
    if (state.currentStep < steps.length) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const handlePrevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmitBooking(state.formData);
    dispatch({ type: 'SET_SUBMITTING', payload: false });
  };

  const updatePassenger = (index: number, passenger: PassengerInfo) => {
    dispatch({ type: 'UPDATE_PASSENGER', payload: { index, passenger } });
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Passenger Information</h2>
              <p className="text-gray-600">
                Please provide details for all {searchCriteria.passengers} passenger{searchCriteria.passengers !== 1 ? 's' : ''}
              </p>
            </div>
            
            {state.formData.passengers.map((passenger, index) => (
              <PassengerInfoForm
                key={passenger.id}
                passenger={passenger}
                index={index}
                onUpdate={(updatedPassenger) => updatePassenger(index, updatedPassenger)}
                errors={state.errors[`passenger-${index}`] as BookingFormErrors}
                isFirst={index === 0}
                totalPassengers={state.formData.passengers.length}
              />
            ))}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms & Safety</h2>
              <p className="text-gray-600">Please review and accept our terms and safety requirements</p>
            </div>
            
            <Card className="p-6">
              <div className="space-y-6">
                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={state.formData.specialInstructions || ''}
                    onChange={(e) => dispatch({ 
                      type: 'UPDATE_FIELD', 
                      payload: { field: 'specialInstructions', value: e.target.value }
                    })}
                    placeholder="Any special requests, dietary requirements, or accessibility needs..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                    rows={4}
                  />
                </div>
                
                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={state.formData.agreeToTerms}
                      onChange={(e) => dispatch({ 
                        type: 'UPDATE_FIELD', 
                        payload: { field: 'agreeToTerms', value: e.target.checked }
                      })}
                      className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-sky-600 hover:text-sky-700 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-sky-600 hover:text-sky-700 underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToSafety"
                      checked={state.formData.agreeToSafety}
                      onChange={(e) => dispatch({ 
                        type: 'UPDATE_FIELD', 
                        payload: { field: 'agreeToSafety', value: e.target.checked }
                      })}
                      className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToSafety" className="ml-3 text-sm text-gray-700">
                      I acknowledge that I have read and understood the helicopter safety briefing and 
                      weather contingency policies. I understand that flights may be cancelled or rescheduled 
                      due to weather conditions for passenger safety.
                    </label>
                  </div>
                </div>
                
                {/* Error messages */}
                {(state.errors.agreeToTerms || state.errors.agreeToSafety) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-600 space-y-1">
                      {state.errors.agreeToTerms && <div>{String(state.errors.agreeToTerms)}</div>}
                      {state.errors.agreeToSafety && <div>{String(state.errors.agreeToSafety)}</div>}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
              <p className="text-gray-600">Please review all details before confirming your helicopter booking</p>
            </div>
            
            {/* Booking review content will be handled by BookingSummary */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-amber-700 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Investor Demo Mode</span>
              </div>
              <p className="text-sm text-amber-600">
                This is a demonstration booking. No actual payment will be processed and no real helicopter reservation will be made.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Results
          </button>
          
          <div className="text-sm text-gray-500">
            Step {state.currentStep} of {steps.length}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-4 md:space-x-8">
              {steps.map((step) => (
                <li key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${state.currentStep >= step.number
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-gray-300 text-gray-500'
                    }
                  `}>
                    {state.currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`
                    ml-2 text-sm font-medium hidden md:block
                    ${state.currentStep >= step.number ? 'text-sky-600' : 'text-gray-500'}
                  `}>
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={state.currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                disabled={state.currentStep === 1}
              >
                Previous
              </Button>
              
              {state.currentStep < steps.length ? (
                <Button onClick={handleNextStep} variant="primary">
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  loading={state.isSubmitting}
                  disabled={!state.formData.agreeToTerms || !state.formData.agreeToSafety}
                >
                  {state.isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </Button>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingSummary
                selectedOption={selectedOption}
                searchCriteria={searchCriteria}
                passengers={state.formData.passengers}
                currentStep={state.currentStep}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;