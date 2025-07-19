
'use client';
import React, { useState, useEffect } from 'react';
import { ProfileData, View } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { Sunrise, PlusCircle, Plus, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AffirmationsWidgetProps {
  profileData: ProfileData;
  onUpdateProfile: (newProfileData: ProfileData) => void;
  onNavigate: (view: View) => void;
  className?: string;
}

const AffirmationsWidget: React.FC<AffirmationsWidgetProps> = ({ profileData, onUpdateProfile, onNavigate, className = '' }) => {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const favoriteAffirmations = profileData?.favoriteAffirmations || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (favoriteAffirmations.length > 1) {
      const intervalId = setInterval(() => {
        setAffirmationIndex(prevIndex => (prevIndex + 1) % favoriteAffirmations.length);
      }, 7000); // Change affirmation every 7 seconds

      return () => clearInterval(intervalId);
    }
  }, [favoriteAffirmations.length]);
  
  const handleAddAffirmation = () => {
    if (!newAffirmation.trim()) return;
    const updatedAffirmations = [...favoriteAffirmations, newAffirmation.trim()];
    onUpdateProfile({ ...profileData, favoriteAffirmations: updatedAffirmations });
    setNewAffirmation('');
    toast({ title: "Custom affirmation added!" });
  };


  if (!isMounted) {
    return <Skeleton className={`bg-surface-container-low p-8 rounded-xl h-[230px] ${className}`} />;
  }
  
  const hasFavorites = favoriteAffirmations && favoriteAffirmations.length > 0;

  return (
    <div className={`bg-surface-container-low p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full ${className}`}>
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Sunrise className="w-7 h-7 text-yellow-500" />
          <h3 className="font-serif text-headline-sm text-surface-on">
            My Affirmations
          </h3>
        </div>
        <div className="mb-4 p-4 bg-surface rounded-lg min-h-[80px] flex items-center justify-center text-center">
            {hasFavorites ? (
                <AnimatePresence mode="wait">
                    <motion.p
                        key={affirmationIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="text-body-lg font-medium text-surface-on"
                    >
                        "{favoriteAffirmations[affirmationIndex]}"
                    </motion.p>
                </AnimatePresence>
            ) : (
                <p className="text-body-md text-surface-on-variant">
                    Add or favorite some affirmations to see them here.
                </p>
            )}
        </div>
      </div>
      <div className="mt-auto space-y-3">
         <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Write your own affirmation..."
              value={newAffirmation}
              onChange={e => setNewAffirmation(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddAffirmation()}
              className="h-10 bg-surface border-outline-variant"
            />
            <ActionButton
              variant="tonal"
              size="md"
              isIconOnly
              onClick={handleAddAffirmation}
              disabled={!newAffirmation.trim()}
              title="Add Custom Affirmation"
            >
              <Plus />
            </ActionButton>
          </div>
          <ActionButton
            variant="tonal"
            size="md"
            leadingIcon={<PlusCircle />}
            onClick={() => onNavigate('affirmations')}
            aria-label="Find more affirmations to favorite"
            className="w-full"
          >
            {hasFavorites ? 'Manage & Find More' : 'Find Affirmations'}
          </ActionButton>
      </div>
    </div>
  );
};

export default AffirmationsWidget;
