'use client';

import React from 'react';
import { OrderStatus } from '@/types/order';

interface OrderProgressBarProps {
  currentStatus: OrderStatus;
}

const statusSteps: OrderStatus[] = [
  'Preparation',
  'In Production',
  'Post-Production Processing',
  'Ready for Shipping',
  'Shipped',
  'Delivered'
];

export default function OrderProgressBar({ currentStatus }: OrderProgressBarProps) {
  const currentStepIndex = statusSteps.indexOf(currentStatus);
  
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'current': return 'bg-blue-600';
      case 'upcoming': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'current': return 'text-blue-600';
      case 'upcoming': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStepIcon = (stepIndex: number, status: string) => {
    if (status === 'completed') {
      return (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
      );
    }
    return <span className="text-xs font-medium text-white">{stepIndex + 1}</span>;
  };

  const getShortStatusName = (status: OrderStatus) => {
    switch (status) {
      case 'Preparation': return 'Prep';
      case 'In Production': return 'Production';
      case 'Post-Production Processing': return 'Processing';
      case 'Ready for Shipping': return 'Ready';
      case 'Shipped': return 'Shipped';
      case 'Delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const isLast = index === statusSteps.length - 1;
          
          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepColor(stepStatus)} relative z-10`}>
                  {getStepIcon(index, stepStatus)}
                </div>
                <div className={`mt-2 text-xs font-medium ${getTextColor(stepStatus)} text-center max-w-16`}>
                  {getShortStatusName(step)}
                </div>
              </div>
              
              {!isLast && (
                <div className="flex-1 mx-2 h-0.5 bg-gray-300 relative">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                      stepStatus === 'completed' ? 'bg-green-600 w-full' : 
                      stepStatus === 'current' ? 'bg-blue-600 w-1/2' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm font-medium text-gray-900">
          Current Status: {currentStatus}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Step {currentStepIndex + 1} of {statusSteps.length}
        </div>
      </div>
    </div>
  );
}