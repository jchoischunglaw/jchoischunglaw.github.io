import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, CreditCard, Users, AlertCircle } from 'lucide-react';
import Card from '../UI/Card';
import type { PassengerInfo, BookingFormErrors } from '../../types';

interface PassengerInfoFormProps {
  passenger: PassengerInfo;
  index: number;
  onUpdate: (passenger: PassengerInfo) => void;
  errors?: BookingFormErrors;
  isFirst: boolean;
  totalPassengers: number;
}

const PassengerInfoForm: React.FC<PassengerInfoFormProps> = ({
  passenger,
  index,
  onUpdate,
  errors = {},
  isFirst,
  totalPassengers
}) => {
  const updateField = (field: string, value: any) => {
    const updatedPassenger = { ...passenger };
    
    // Handle nested field updates
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedPassenger[parent as keyof PassengerInfo] = {
        ...(updatedPassenger[parent as keyof PassengerInfo] as any),
        [child]: value
      };
    } else {
      (updatedPassenger as any)[field] = value;
    }
    
    onUpdate(updatedPassenger);
  };

  const getFieldError = (fieldPath: string): string | undefined => {
    const pathParts = fieldPath.split('.');
    let currentError: any = errors;
    
    for (const part of pathParts) {
      if (currentError && typeof currentError === 'object') {
        currentError = currentError[part];
      } else {
        return undefined;
      }
    }
    
    return typeof currentError === 'string' ? currentError : undefined;
  };

  const InputField: React.FC<{
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    icon?: React.ReactNode;
  }> = ({ label, type = 'text', value, onChange, placeholder, required = false, error, icon }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  const SelectField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    error?: string;
  }> = ({ label, value, onChange, options, required = false, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-3 py-2 border rounded-lg focus:ring-sky-500 focus:border-sky-500
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );

  const documentTypeOptions = [
    { value: 'passport', label: 'Passport' },
    { value: 'license', label: 'Driver\'s License' },
    { value: 'national-id', label: 'National ID Card' }
  ];

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4 text-sky-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isFirst ? 'Primary Passenger' : `Passenger ${index + 1}`}
            {totalPassengers > 1 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({index + 1} of {totalPassengers})
              </span>
            )}
          </h3>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={passenger.firstName}
                onChange={(value) => updateField('firstName', value)}
                placeholder="Enter first name"
                required
                error={getFieldError('firstName')}
                icon={<User className="w-4 h-4" />}
              />
              
              <InputField
                label="Last Name"
                value={passenger.lastName}
                onChange={(value) => updateField('lastName', value)}
                placeholder="Enter last name"
                required
                error={getFieldError('lastName')}
                icon={<User className="w-4 h-4" />}
              />
              
              <InputField
                label="Email Address"
                type="email"
                value={passenger.email}
                onChange={(value) => updateField('email', value)}
                placeholder="Enter email address"
                required
                error={getFieldError('email')}
                icon={<Mail className="w-4 h-4" />}
              />
              
              <InputField
                label="Phone Number"
                type="tel"
                value={passenger.phone}
                onChange={(value) => updateField('phone', value)}
                placeholder="+1 (555) 123-4567"
                required
                error={getFieldError('phone')}
                icon={<Phone className="w-4 h-4" />}
              />
              
              <InputField
                label="Date of Birth"
                type="date"
                value={passenger.dateOfBirth}
                onChange={(value) => updateField('dateOfBirth', value)}
                required
                error={getFieldError('dateOfBirth')}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Identification */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Identification Document
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Document Type"
                value={passenger.identification.type}
                onChange={(value) => updateField('identification.type', value)}
                options={documentTypeOptions}
                required
                error={getFieldError('identification.type')}
              />
              
              <InputField
                label="Document Number"
                value={passenger.identification.number}
                onChange={(value) => updateField('identification.number', value)}
                placeholder="Enter document number"
                required
                error={getFieldError('identification.number')}
                icon={<CreditCard className="w-4 h-4" />}
              />
              
              <InputField
                label="Expiry Date"
                type="date"
                value={passenger.identification.expiryDate}
                onChange={(value) => updateField('identification.expiryDate', value)}
                required
                error={getFieldError('identification.expiryDate')}
                icon={<Calendar className="w-4 h-4" />}
              />
              
              <InputField
                label="Issuing Authority"
                value={passenger.identification.issuingAuthority}
                onChange={(value) => updateField('identification.issuingAuthority', value)}
                placeholder="e.g., United States, Ontario, etc."
                required
                error={getFieldError('identification.issuingAuthority')}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Contact Name"
                value={passenger.emergencyContact.name}
                onChange={(value) => updateField('emergencyContact.name', value)}
                placeholder="Enter contact name"
                required
                error={getFieldError('emergencyContact.name')}
                icon={<User className="w-4 h-4" />}
              />
              
              <SelectField
                label="Relationship"
                value={passenger.emergencyContact.relationship}
                onChange={(value) => updateField('emergencyContact.relationship', value)}
                options={relationshipOptions}
                required
                error={getFieldError('emergencyContact.relationship')}
              />
              
              <InputField
                label="Phone Number"
                type="tel"
                value={passenger.emergencyContact.phone}
                onChange={(value) => updateField('emergencyContact.phone', value)}
                placeholder="+1 (555) 123-4567"
                required
                error={getFieldError('emergencyContact.phone')}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements (Optional)
            </label>
            <textarea
              value={passenger.specialRequirements || ''}
              onChange={(e) => updateField('specialRequirements', e.target.value)}
              placeholder="Any special needs, dietary restrictions, mobility assistance, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
              rows={3}
            />
          </div>
        </div>

        {/* Important Notice for First Passenger */}
        {isFirst && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All passengers must present valid government-issued photo ID before flight</li>
                  <li>Documents must match the information provided in this form</li>
                  <li>International passengers may require additional documentation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PassengerInfoForm;