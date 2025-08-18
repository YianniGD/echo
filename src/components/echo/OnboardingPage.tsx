'use client';
import React, { useState } from 'react';
import { ProfileData, CopingMechanism } from '@/lib/types';
import { PREDEFINED_STRATEGIES } from '@/lib/predefined-strategies';
import { STRENGTHS_LIST } from '@/lib/strengths';
import ActionButton from './ActionButton';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Cloud } from 'lucide-react';

interface OnboardingPageProps {
  onOnboardingComplete: (profileData: ProfileData) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onOnboardingComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [selectedMechanisms, setSelectedMechanisms] = useState<CopingMechanism[]>([]);

  const handleStrengthToggle = (strength: string) => {
    setSelectedStrengths(prev =>
      prev.includes(strength)
        ? prev.filter(s => s !== strength)
        : [...prev, strength]
    );
  };

  const handleMechanismToggle = (mechanism: CopingMechanism) => {
    setSelectedMechanisms(prev =>
      prev.some(m => m.id === mechanism.id)
        ? prev.filter(m => m.id !== mechanism.id)
        : [...prev, mechanism]
    );
  };

  const handleNextStep = () => {
    if (step === 1 && !name.trim()) {
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleFinish = () => {
    onOnboardingComplete({
      name: name.trim(),
      strengths: selectedStrengths,
      copingMechanisms: selectedMechanisms,
      dashboardWidgets: { planner: true, medication: true, copingMechanisms: true },
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Welcome
        return (
          <motion.div key={0} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <Cloud className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-display-md text-surface-on">Welcome to Echo</h1>
            <p className="text-body-lg text-surface-on-variant mt-4 max-w-xl mx-auto">A calm, introspective space to organize your thoughts, track your well-being, and reflect on your daily life.</p>
            <ActionButton onClick={handleNextStep} size="lg" className="mt-10" trailingIcon={<ArrowRight />}>
              Get Started
            </ActionButton>
          </motion.div>
        );
      case 1: // Name
        return (
          <motion.div key={1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full max-w-md">
            <h1 className="font-serif text-headline-lg text-surface-on">What should we call you?</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-8 w-full p-4 bg-surface-container border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-surface-on placeholder-surface-on-variant text-center text-xl"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleNextStep()}
            />
            <ActionButton onClick={handleNextStep} size="lg" className="mt-8" disabled={!name.trim()}>
              Next
            </ActionButton>
          </motion.div>
        );
      case 2: // Strengths
        return (
          <motion.div key={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full max-w-3xl">
            <h1 className="font-serif text-headline-lg text-surface-on">Let's celebrate your strengths, {name}.</h1>
            <p className="text-body-md text-surface-on-variant mt-2 mb-8">What are some of your best qualities? Select a few that resonate with you.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {STRENGTHS_LIST.map(strength => {
                const isSelected = selectedStrengths.includes(strength);
                return (
                  <button
                    key={strength}
                    onClick={() => handleStrengthToggle(strength)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                      isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-surface-container border-outline-variant hover:border-outline text-surface-on-variant'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                       {strength}
                       {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <ActionButton onClick={handleNextStep} size="lg" className="mt-10">
              Continue
            </ActionButton>
          </motion.div>
        );
      case 3: // Coping Mechanisms
        return (
          <motion.div key={3} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full max-w-3xl">
            <h1 className="font-serif text-headline-lg text-surface-on">Select a few starting coping strategies.</h1>
            <p className="text-body-md text-surface-on-variant mt-2 mb-8">You can always change these later in your profile.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PREDEFINED_STRATEGIES.map(mechanism => {
                const isSelected = selectedMechanisms.some(m => m.id === mechanism.id);
                return (
                  <button
                    key={mechanism.id}
                    onClick={() => handleMechanismToggle(mechanism)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                      isSelected
                        ? 'bg-primary-container border-primary'
                        : 'bg-surface-container border-outline-variant hover:border-outline'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isSelected ? 'text-on-primary-container' : 'text-surface-on'}`}>{mechanism.text}</span>
                      {isSelected && <Check className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-transparent'}`} />}
                    </div>
                  </button>
                );
              })}
            </div>
            <ActionButton onClick={handleNextStep} size="lg" className="mt-8">
              Continue
            </ActionButton>
          </motion.div>
        );
      case 4: // Finish
        return (
          <motion.div key={4} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="font-serif text-display-sm text-surface-on">You're all set, {name}!</h1>
            <p className="text-body-lg text-surface-on-variant mt-4">Your personal wellness dashboard is ready.</p>
            <ActionButton onClick={handleFinish} size="lg" className="mt-10">
              Enter Echo
            </ActionButton>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingPage;
