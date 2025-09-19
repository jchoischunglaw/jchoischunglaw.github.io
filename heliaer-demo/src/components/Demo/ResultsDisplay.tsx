import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Users, MapPin, Award, Plane } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import type { HelicopterOption, SearchCriteria } from '../../types';

interface ResultsDisplayProps {
  results: HelicopterOption[];
  searchCriteria: SearchCriteria;
  onSelectOption: (option: HelicopterOption) => void;
  onNewSearch: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  searchCriteria,
  onSelectOption,
  onNewSearch
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
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

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Perfect Matches Found
        </motion.h1>
        <motion.div
          className="text-gray-600 text-lg mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center space-x-4 flex-wrap">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {searchCriteria.route.departure.name} → {searchCriteria.route.arrival.name}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {searchCriteria.passengers} passenger{searchCriteria.passengers !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {searchCriteria.departureTime}
            </span>
          </div>
        </motion.div>
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Our AI analyzed {results.length * 8} helicopters and {results.length * 12} pilots to find your perfect helicopter matches
        </motion.p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {results.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="h-full" hover={true}>
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {Math.round(option.matchScore * 100)}% Match
                </div>
              </div>

              {/* Helicopter Image */}
              <div className="relative h-48 mb-4 -m-6 -mt-6 mb-4">
                <img
                  src={option.helicopter.photo}
                  alt={option.helicopter.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Helicopter Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {option.helicopter.model}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm space-x-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {option.helicopter.capacity} seats
                    </span>
                    <span className="flex items-center">
                      <Plane className="w-4 h-4 mr-1" />
                      {option.helicopter.year}
                    </span>
                  </div>
                </div>

                {/* Pilot Info */}
                <div className="flex items-center space-x-3 py-3 border-t border-gray-100">
                  <img
                    src={option.pilot.photo}
                    alt={option.pilot.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{option.pilot.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(option.pilot.rating)}</div>
                      <span className="text-sm text-gray-600">({option.pilot.rating})</span>
                    </div>
                    <p className="text-xs text-gray-500">{option.pilot.experience}</p>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(option.price)}
                    </div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {option.duration}m
                    </div>
                    <div className="text-sm text-gray-600">Flight Time</div>
                  </div>
                </div>

                {/* Specializations */}
                {option.pilot.specializations && (
                  <div className="flex flex-wrap gap-1">
                    {option.pilot.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-sky-50 text-sky-700 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => onSelectOption(option)}
                  variant="primary"
                  className="w-full"
                >
                  Select This Helicopter
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={onNewSearch}
          variant="outline"
          size="lg"
          className="px-8"
        >
          Try Another Search
        </Button>
        
        <div className="text-sm text-gray-500">
          Need help? Contact our aviation specialists at{' '}
          <a href="mailto:invest@heliaer.com" className="text-sky-600 hover:text-sky-700">
            invest@heliaer.com
          </a>
        </div>
      </motion.div>

      {/* Demo Notice */}
      <motion.div
        className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex items-center justify-center space-x-2 text-amber-700 mb-2">
          <Award className="w-5 h-5" />
          <span className="font-medium">Investor Demo</span>
        </div>
        <p className="text-sm text-amber-600">
          This is a demonstration of our AI matching capabilities. 
          In production, booking would integrate with real helicopter operators and payment systems.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDisplay;