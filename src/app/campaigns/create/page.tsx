import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export const CreateCampaignPage: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Campaign</h1>
          <p className="text-slate-600">Follow the steps to create your AI-powered sustainable campaign</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">Campaign Details</span>
            <span className="text-xs text-slate-600">AI Generation</span>
            <span className="text-xs text-slate-600">Targeting</span>
            <span className="text-xs text-slate-600">Review</span>
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>Step {step}: Campaign Setup</CardTitle>
            <CardDescription className="py-8 text-center">
              Campaign creation flow will be implemented here. This includes AI-powered content generation,
              audience targeting, budget settings, and sustainability metrics.
            </CardDescription>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              <Button
                variant="default"
                onClick={() => setStep(Math.min(4, step + 1))}
              >
                {step === 4 ? 'Launch Campaign' : 'Next'}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

