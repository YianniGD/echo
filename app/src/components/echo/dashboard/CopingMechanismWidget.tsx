'use client';
import React from 'react';
import { CopingMechanism, View } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { LifeBuoy, PlusCircle, RefreshCw, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CopingMechanismWidgetProps {
  copingMechanisms: CopingMechanism[];
  onNavigate: (view: View) => void;
  className?: string;
}

const CopingMechanismWidget: React.FC<CopingMechanismWidgetProps> = ({ copingMechanisms, onNavigate, className = '' }) => {
  const [displayedMechanism, setDisplayedMechanism] = React.useState<CopingMechanism | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // This effect runs only on the client, ensuring server and client render match initially.
    setIsMounted(true);
  }, []);
  
  React.useEffect(() => {
    // Only select a random mechanism once the component is mounted on the client.
    if (isMounted && copingMechanisms.length > 0) {
      setDisplayedMechanism(copingMechanisms[Math.floor(Math.random() * copingMechanisms.length)]);
    } else {
      setDisplayedMechanism(null);
    }
  }, [isMounted, copingMechanisms]);


  const showNewMechanism = () => {
    if (copingMechanisms.length > 1) {
      let newMechanism = displayedMechanism;
      // Ensure the new one is different if possible
      while (newMechanism && newMechanism.id === displayedMechanism?.id) {
        newMechanism = copingMechanisms[Math.floor(Math.random() * copingMechanisms.length)];
      }
      setDisplayedMechanism(newMechanism);
    }
  };

  return (
    <div className={`bg-surface-container-low p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full ${className}`}>
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <LifeBuoy className="w-7 h-7 text-green-500" />
          <h3 className="font-serif text-headline-sm text-surface-on">
            My Coping Strategies
          </h3>
        </div>
        {!isMounted ? (
            <Skeleton className="h-[80px] w-full" />
        ) : displayedMechanism ? (
          <div className="mb-4 p-4 bg-surface rounded-lg min-h-[80px] flex items-center justify-center text-center">
            <p className="text-body-lg font-medium text-surface-on">
              "{displayedMechanism.text}"
            </p>
          </div>
        ) : (
          <p className="text-body-md text-surface-on-variant mb-4">
            Add your personal coping mechanisms in your profile to see them here.
          </p>
        )}
      </div>
      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
        {copingMechanisms.length > 0 ? (
          <ActionButton
            variant="tonal"
            size="md"
            leadingIcon={<RefreshCw />}
            onClick={showNewMechanism}
            aria-label="Show another coping mechanism"
            className="w-full"
            disabled={!isMounted || copingMechanisms.length < 2}
          >
            Show Another
          </ActionButton>
        ) : (
             <ActionButton
                variant="filled"
                size="md"
                leadingIcon={<PlusCircle />}
                onClick={() => onNavigate('profile')}
                aria-label="Add coping mechanisms"
                className="w-full sm:col-span-2"
              >
                Add Mechanisms
            </ActionButton>
        )}
        {copingMechanisms.length > 0 && (
             <ActionButton
                variant="filled"
                size="md"
                leadingIcon={<User />}
                onClick={() => onNavigate('profile')}
                aria-label="Manage your coping mechanisms"
                className="w-full"
              >
                Manage
            </ActionButton>
        )}
      </div>
    </div>
  );
};

export default CopingMechanismWidget;
