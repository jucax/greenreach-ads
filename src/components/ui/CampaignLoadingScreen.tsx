import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CampaignLoadingScreenProps {
  onComplete?: () => void;
}

export const CampaignLoadingScreen: React.FC<CampaignLoadingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const loadingSteps = [
    "Analyzing campaign parameters...",
    "Connecting to advertising platforms...",
    "Scheduling Instagram posts...",
    "Scheduling Facebook ads...",
    "Configuring Google Display campaign...",
    "Optimizing for renewable energy windows...",
    "Finalizing sustainability calculations...",
    "Campaign launching...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          // Loading complete, redirect after a short delay
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
            navigate('/campaign/success');
          }, 1500);
          return prev;
        }
      });
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, [loadingSteps.length, navigate, onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        {/* Loading Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Launching Your Campaign
          </h2>
          
          <div className="space-y-3">
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 transition-all duration-500 ${
                  index <= currentStep
                    ? 'text-emerald-600 font-medium'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    index < currentStep
                      ? 'bg-emerald-600 text-white'
                      : index === currentStep
                      ? 'bg-emerald-100 text-emerald-600 animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : index === currentStep ? (
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></div>
                  ) : (
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  )}
                </div>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {Math.round(((currentStep + 1) / loadingSteps.length) * 100)}% Complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
