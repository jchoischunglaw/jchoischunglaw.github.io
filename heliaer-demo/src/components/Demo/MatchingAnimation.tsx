import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserCheck, CloudSun, Calculator, Check } from 'lucide-react';
import { LogoSpinner } from '../UI/LoadingSpinner';
import Card from '../UI/Card';
import type { MatchingState } from '../../types';

interface MatchingAnimationProps {
  matchingState: MatchingState;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  'user-check': UserCheck,
  'cloud-sun': CloudSun,
  calculator: Calculator
};

const MatchingAnimation: React.FC<MatchingAnimationProps> = ({ matchingState }) => {
  const { isMatching, currentStep, steps } = matchingState;

  if (!isMatching && currentStep === 0) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card className="w-full max-w-md text-center" padding="lg">
        <div className="mb-8">
          <LogoSpinner 
            size="lg" 
            message="AI helicopter matching in progress..."
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-sky-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(currentStep / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Matching Steps */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon];
              const isActive = index < currentStep;
              const isCurrent = index === currentStep - 1;
              
              return (
                <motion.div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-sky-50 border border-sky-200' 
                      : isActive 
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.5,
                    x: 0 
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.1 
                  }}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.completed ? (
                      <Check className="w-4 h-4" />
                    ) : IconComponent ? (
                      <IconComponent className="w-4 h-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${
                      step.completed
                        ? 'text-green-700'
                        : isCurrent
                        ? 'text-sky-700'
                        : 'text-gray-600'
                    }`}>
                      {step.message}
                    </p>
                  </div>

                  {isCurrent && (
                    <motion.div
                      className="flex-shrink-0"
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Completion Message */}
        {!isMatching && currentStep === steps.length && (
          <motion.div
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">Matching Complete!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Found {matchingState.results.length} perfect helicopter matches for your journey
            </p>
          </motion.div>
        )}

        {/* Demo Notice */}
        <motion.p
          className="text-xs text-gray-400 mt-6 border-t pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🤖 This is an AI simulation for investor demo purposes
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default MatchingAnimation;