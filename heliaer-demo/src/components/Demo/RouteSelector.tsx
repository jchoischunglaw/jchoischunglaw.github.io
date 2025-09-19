import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { getAssetPath } from '../../utils/assets';
import type { SearchCriteria } from '../../types';
import { MOCK_LOCATIONS, PASSENGER_OPTIONS, TIME_SLOTS, DEFAULT_SEARCH_CRITERIA } from '../../data/mockData';

interface RouteSelectorProps {
  onSearch: (criteria: SearchCriteria) => void;
  loading?: boolean;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({ onSearch, loading = false }) => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(DEFAULT_SEARCH_CRITERIA);

  const handleLocationChange = (type: 'departure' | 'arrival', locationName: string) => {
    const location = MOCK_LOCATIONS.find(loc => loc.name === locationName);
    if (location) {
      setSearchCriteria(prev => ({
        ...prev,
        route: {
          ...prev.route,
          [type]: location,
          distance: type === 'departure' || type === 'arrival' 
            ? Math.floor(Math.random() * 100) + 50 // Random distance for demo
            : prev.route.distance,
          estimatedDuration: Math.floor(Math.random() * 20) + 10 // Random duration for demo
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchCriteria);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.img
          src={getAssetPath("images/logos/HeliaerLogo_wFont.png")}
          alt="HeliAer"
          className="h-16 md:h-20 w-auto mx-auto mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          AI-Powered Helicopter Matching
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Experience the future of aviation. Our AI instantly matches you with the perfect helicopter and pilot for your journey.
        </motion.p>
      </div>

      {/* Search Form */}
      <Card className="max-w-2xl mx-auto" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-sky-500" />
                From
              </label>
              <select
                value={searchCriteria.route.departure.name}
                onChange={(e) => handleLocationChange('departure', e.target.value)}
                className="input-field"
              >
                {MOCK_LOCATIONS.map(location => (
                  <option key={location.code} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-sky-500" />
                To
              </label>
              <select
                value={searchCriteria.route.arrival.name}
                onChange={(e) => handleLocationChange('arrival', e.target.value)}
                className="input-field"
              >
                {MOCK_LOCATIONS.map(location => (
                  <option key={location.code} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Passengers and Date/Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-2 text-sky-500" />
                Passengers
              </label>
              <select
                value={searchCriteria.passengers}
                onChange={(e) => setSearchCriteria(prev => ({
                  ...prev,
                  passengers: parseInt(e.target.value)
                }))}
                className="input-field"
              >
                {PASSENGER_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-sky-500" />
                Date
              </label>
              <input
                type="date"
                value={searchCriteria.departureDate}
                onChange={(e) => setSearchCriteria(prev => ({
                  ...prev,
                  departureDate: e.target.value
                }))}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-sky-500" />
                Time
              </label>
              <select
                value={searchCriteria.departureTime}
                onChange={(e) => setSearchCriteria(prev => ({
                  ...prev,
                  departureTime: e.target.value
                }))}
                className="input-field"
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center pt-4">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full md:w-auto px-12"
            >
              {loading ? 'Finding Your Helicopter...' : 'Find My Helicopter'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Features Preview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="text-center" padding="md">
          <div className="text-sky-500 text-3xl mb-3">🚁</div>
          <h3 className="font-semibold text-gray-900 mb-2">Premium Fleet</h3>
          <p className="text-gray-600 text-sm">Latest helicopter models with top safety ratings</p>
        </Card>

        <Card className="text-center" padding="md">
          <div className="text-sky-500 text-3xl mb-3">👨‍✈️</div>
          <h3 className="font-semibold text-gray-900 mb-2">Expert pilots</h3>
          <p className="text-gray-600 text-sm">Certified professionals with thousands of flight hours</p>
        </Card>

        <Card className="text-center" padding="md">
          <div className="text-sky-500 text-3xl mb-3">⚡</div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Matching</h3>
          <p className="text-gray-600 text-sm">AI-powered matching in seconds, not hours</p>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RouteSelector;