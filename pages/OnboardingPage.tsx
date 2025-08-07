import React, { useState } from 'react';
import { useStrengths } from '../hooks/useStrengths';
import { useCopingMechanisms } from '../hooks/useCopingMechanisms';
import { ALL_STRENGTHS, PREDEFINED_STRATEGIES } from '../constants';
import SelectableChip from '../components/ui/SelectableChip';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';

interface OnboardingPageProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 3;

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { strengths, toggleStrength } = useStrengths();
  const { mechanisms, addMechanism, removeMechanism, isMechanismAdded } = useCopingMechanisms();

  const handleToggleMechanism = (strategy: typeof PREDEFINED_STRATEGIES[0]) => {
    if (isMechanismAdded(strategy.id)) {
        removeMechanism(strategy.id);
    } else {
        addMechanism(strategy);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-3xl">
        <div className="mb-8 px-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">Step {step} of {TOTAL_STEPS}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300">
            {step === 1 && <StepWelcome nextStep={nextStep} />}
            {step === 2 && <StepStrengths nextStep={nextStep} prevStep={prevStep} strengths={strengths} toggleStrength={toggleStrength} />}
            {step === 3 && <StepCoping prevStep={prevStep} onComplete={onComplete} isMechanismAdded={isMechanismAdded} toggleMechanism={handleToggleMechanism} />}
        </div>
      </div>
    </div>
  );
};

const StepWelcome: React.FC<{ nextStep: () => void }> = ({ nextStep }) => (
    <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
            welcome to <span className="text-primary-600 dark:text-primary-400">echo</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personal companion for mental well-being. Let's personalize your experience.
        </p>
        <div className="mt-8">
            <button
                onClick={nextStep}
                className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
            >
                Let's Get Started
            </button>
        </div>
    </div>
);

const StepStrengths: React.FC<{ nextStep: () => void; prevStep: () => void; strengths: string[]; toggleStrength: (s: string) => void; }> = ({ nextStep, prevStep, strengths, toggleStrength }) => (
    <div className="animate-fade-in-up">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight text-center">Select Your Strengths</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">Choose a few that resonate with you. You can change these later.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ALL_STRENGTHS.map(strength => (
                <SelectableChip key={strength} isSelected={strengths.includes(strength)} onSelect={() => toggleStrength(strength)}>
                    {strength}
                </SelectableChip>
            ))}
        </div>
        <div className="mt-10 flex justify-between items-center">
            <button onClick={prevStep} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Back</button>
            <button onClick={nextStep} className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700">Next</button>
        </div>
    </div>
);

const StepCoping: React.FC<{ prevStep: () => void; onComplete: () => void; isMechanismAdded: (id: string) => boolean; toggleMechanism: (s: any) => void; }> = ({ prevStep, onComplete, isMechanismAdded, toggleMechanism }) => (
    <div className="animate-fade-in-up">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white tracking-tight text-center">Choose Your Coping Tools</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">Select any techniques you'd like to add to your personal toolkit.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PREDEFINED_STRATEGIES.map(strategy => (
                <button 
                    key={strategy.id} 
                    onClick={() => toggleMechanism(strategy)}
                    className={`p-4 rounded-lg text-left border-2 transition-all duration-200 ${isMechanismAdded(strategy.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{strategy.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{strategy.description}</p>
                        </div>
                        {isMechanismAdded(strategy.id) 
                            ? <CheckCircleIcon className="w-6 h-6 text-primary-500 flex-shrink-0" /> 
                            : <PlusCircleIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />}
                    </div>
                </button>
            ))}
        </div>
         <div className="mt-10 flex justify-between items-center">
            <button onClick={prevStep} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:underline">Back</button>
            <button onClick={onComplete} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">All Done! Finish Setup</button>
        </div>
    </div>
);


export default OnboardingPage;
