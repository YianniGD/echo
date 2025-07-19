'use client';
import React, { useState } from 'react';
import { Sound, SoundPlayerState } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import AudioPlayerControls from '@/components/echo/AudioPlayerControls';
import { StopCircle, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileAudioPlayerProps {
  activeSounds: Sound[];
  soundPlayerStates: Record<string, SoundPlayerState>;
  onPlayToggle: (soundId: string) => void;
  onVolumeChange: (soundId: string, volume: number) => void;
  onStopAll: () => void;
}

const MobileAudioPlayer: React.FC<MobileAudioPlayerProps> = ({
  activeSounds,
  soundPlayerStates,
  onPlayToggle,
  onVolumeChange,
  onStopAll,
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface-container-high/95 backdrop-blur-sm shadow-[0_-4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)] border-t border-outline-variant animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between gap-3 py-3 cursor-pointer"
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
          role="button"
          aria-expanded={isPanelExpanded}
          aria-controls="active-sounds-controls-mobile"
        >
          <div className="flex-grow min-w-0">
            <h4 className="font-archivoBlack text-title-md text-surface-on">Now Playing ({activeSounds.length})</h4>
            <p className="text-sm text-surface-on-variant truncate">
              {activeSounds.map(s => s.name).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ActionButton
              variant="filled"
              size="md"
              leadingIcon={<StopCircle />}
              onClick={(e) => { e.stopPropagation(); onStopAll(); }}
              aria-label="Stop all playing sounds"
            >
              Stop All
            </ActionButton>
            <ActionButton
              variant="text"
              size="sm"
              isIconOnly
              aria-label={isPanelExpanded ? 'Collapse panel' : 'Expand panel'}
              className="transition-transform duration-300"
              style={{ transform: isPanelExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <ChevronUp />
            </ActionButton>
          </div>
        </div>
        <div
          id="active-sounds-controls-mobile"
          className={cn(
            "transition-all duration-500 ease-in-out overflow-y-hidden",
            isPanelExpanded ? "max-h-[50vh]" : "max-h-0"
          )}
        >
          <AudioPlayerControls
            activeSounds={activeSounds}
            soundPlayerStates={soundPlayerStates}
            onPlayToggle={onPlayToggle}
            onVolumeChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAudioPlayer;
