import { useState, useCallback } from 'react';
import type { MatchingState, SearchCriteria, HelicopterOption } from '../types';
import { MATCHING_STEPS, MOCK_HELICOPTERS } from '../data/mockData';

export const useMatching = () => {
  const [matchingState, setMatchingState] = useState<MatchingState>({
    isMatching: false,
    currentStep: 0,
    steps: MATCHING_STEPS.map(step => ({ ...step })),
    results: [],
    error: undefined
  });

  const startMatching = useCallback(async (searchCriteria: SearchCriteria) => {
    setMatchingState(prev => ({
      ...prev,
      isMatching: true,
      currentStep: 0,
      steps: MATCHING_STEPS.map(step => ({ ...step, completed: false })),
      results: [],
      error: undefined
    }));

    // Simulate the 4-step matching process
    for (let i = 0; i < MATCHING_STEPS.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 750)); // 750ms per step
      
      setMatchingState(prev => ({
        ...prev,
        currentStep: i + 1,
        steps: prev.steps.map((step, index) => ({
          ...step,
          completed: index <= i
        }))
      }));
    }

    // Filter helicopters based on passenger capacity
    const filteredHelicopters = MOCK_HELICOPTERS.filter(
      helicopter => helicopter.helicopter.capacity >= searchCriteria.passengers
    );

    // Sort by match score and take top 3
    const sortedResults = filteredHelicopters
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    // Final update with results
    setMatchingState(prev => ({
      ...prev,
      isMatching: false,
      results: sortedResults
    }));
  }, []);

  const resetMatching = useCallback(() => {
    setMatchingState({
      isMatching: false,
      currentStep: 0,
      steps: MATCHING_STEPS.map(step => ({ ...step, completed: false })),
      results: [],
      error: undefined
    });
  }, []);

  const selectOption = useCallback((option: HelicopterOption) => {
    // In a real app, this would handle booking logic
    console.log('Selected helicopter option:', option);
    // You could add booking state management here
  }, []);

  return {
    matchingState,
    startMatching,
    resetMatching,
    selectOption
  };
};