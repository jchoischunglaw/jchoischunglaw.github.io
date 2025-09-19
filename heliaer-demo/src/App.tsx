import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout/Layout';
import AuthContainer from './components/Auth/AuthContainer';
import RouteSelector from './components/Demo/RouteSelector';
import MatchingAnimation from './components/Demo/MatchingAnimation';
import ResultsDisplay from './components/Demo/ResultsDisplay';
import { BookingForm, BookingConfirmation } from './components/Booking';
import { useMatching } from './hooks/useMatching';
import { useAuth } from './hooks/useAuth';
import type { AppScreen, SearchCriteria, HelicopterOption, BookingFormData, BookingData } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [selectedOption, setSelectedOption] = useState<HelicopterOption | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const { matchingState, startMatching, resetMatching, selectOption } = useMatching();
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  // Update screen based on authentication status
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setCurrentScreen('auth');
      } else {
        // Only switch to search if we're currently on auth screen
        if (currentScreen === 'auth') {
          setCurrentScreen('search');
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleSearch = async (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setCurrentScreen('matching');
    
    await startMatching(criteria);
    
    // Automatically transition to results after matching completes
    setTimeout(() => {
      setCurrentScreen('results');
    }, 500); // Small delay for better UX
  };

  const handleAuthenticated = (authenticatedUser: any) => {
    login(authenticatedUser);
  };

  const handleLogout = () => {
    logout();
    resetMatching();
    setSearchCriteria(null);
    setCurrentScreen('auth');
  };

  const handleAuthClick = () => {
    setCurrentScreen('auth');
  };

  const handleSelectOption = (option: HelicopterOption) => {
    selectOption(option);
    setSelectedOption(option);
    setCurrentScreen('booking');
  };

  const generateBookingReference = (): string => {
    const prefix = 'HA';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleBookingSubmit = (formData: BookingFormData) => {
    if (!selectedOption || !searchCriteria) return;

    const newBookingData: BookingData = {
      id: `booking-${Date.now()}`,
      selectedOption,
      searchCriteria,
      passengers: formData.passengers,
      bookingReference: generateBookingReference(),
      totalPrice: selectedOption.price,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      specialInstructions: formData.specialInstructions
    };

    setBookingData(newBookingData);
    setCurrentScreen('confirmation');
  };

  const handleBackToResults = () => {
    setCurrentScreen('results');
    setSelectedOption(null);
  };

  const handleNewSearch = () => {
    resetMatching();
    setCurrentScreen('search');
    setSearchCriteria(null);
    setSelectedOption(null);
    setBookingData(null);
  };

  const handleNewBooking = () => {
    setCurrentScreen('search');
    setSearchCriteria(null);
    setSelectedOption(null);
    setBookingData(null);
    resetMatching();
  };

  const handleBackToHome = () => {
    setCurrentScreen('search');
    setSearchCriteria(null);
    setSelectedOption(null);
    setBookingData(null);
    resetMatching();
  };

  const renderCurrentScreen = () => {
    // Show loading screen while checking authentication
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading HeliAer...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'auth':
        return <AuthContainer onAuthenticated={handleAuthenticated} />;
      
      case 'search':
        return (
          <RouteSelector 
            onSearch={handleSearch}
            loading={false}
          />
        );
      
      case 'matching':
        return null; // Matching animation is rendered as overlay
      
      case 'results':
        return searchCriteria && matchingState.results.length > 0 ? (
          <ResultsDisplay
            results={matchingState.results}
            searchCriteria={searchCriteria}
            onSelectOption={handleSelectOption}
            onNewSearch={handleNewSearch}
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any helicopters matching your criteria.
              </p>
              <button
                onClick={handleNewSearch}
                className="btn-primary"
              >
                Try Another Search
              </button>
            </div>
          </div>
        );
      
      case 'booking':
        return selectedOption && searchCriteria ? (
          <BookingForm
            selectedOption={selectedOption}
            searchCriteria={searchCriteria}
            onSubmitBooking={handleBookingSubmit}
            onBack={handleBackToResults}
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Error</h2>
              <p className="text-gray-600 mb-6">
                Unable to load booking information. Please try again.
              </p>
              <button
                onClick={handleNewSearch}
                className="btn-primary"
              >
                Start New Search
              </button>
            </div>
          </div>
        );
      
      case 'confirmation':
        return bookingData ? (
          <BookingConfirmation
            bookingData={bookingData}
            onNewBooking={handleNewBooking}
            onBackToHome={handleBackToHome}
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Error</h2>
              <p className="text-gray-600 mb-6">
                Unable to load booking confirmation. Please contact support.
              </p>
              <button
                onClick={handleNewSearch}
                className="btn-primary"
              >
                Start New Search
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout 
      showFooter={currentScreen === 'search'}
      user={user}
      onLogout={handleLogout}
      onAuthClick={handleAuthClick}
    >
      <AnimatePresence mode="wait">
        {renderCurrentScreen()}
      </AnimatePresence>
      
      {/* Matching Animation Overlay */}
      <AnimatePresence>
        {currentScreen === 'matching' && (
          <MatchingAnimation matchingState={matchingState} />
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;