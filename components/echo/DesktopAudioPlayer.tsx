'use client';
import React from 'react';
import { Sound, SoundPlayerState } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import AudioPlayerControls from '@/components/echo/AudioPlayerControls';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Waves, StopCircle } from 'lucide-react';

interface DesktopAudioPlayerProps {
  activeSounds: Sound[];
  soundPlayerStates: Record<string, SoundPlayerState>;
  onPlayToggle: (soundId: string) => void;
  onVolumeChange: (soundId: string, volume: number) => void;
  onStopAll: () => void;
}

const DesktopAudioPlayer: React.FC<DesktopAudioPlayerProps> = ({
  activeSounds,
  soundPlayerStates,
  onPlayToggle,
  onVolumeChange,
  onStopAll
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <ActionButton
          variant="tonal"
          size="md"
          title="Now Playing"
          aria-label="Show currently playing sounds"
          leadingIcon={<Waves />}
        >
          Now Playing ({activeSounds.length})
        </ActionButton>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4">
            <div className="flex items-center justify-between">
                 <h4 className="font-serif text-title-md text-surface-on">Now Playing</h4>
                 <ActionButton
                    variant="filled"
                    size="sm"
                    leadingIcon={<StopCircle />}
                    onClick={onStopAll}
                    aria-label="Stop all playing sounds"
                >
                    Stop All
                </ActionButton>
            </div>
             <p className="text-sm text-surface-on-variant truncate mt-1">
                {activeSounds.map(s => s.name).join(', ')}
            </p>
        </div>
        <AudioPlayerControls
            activeSounds={activeSounds}
            soundPlayerStates={soundPlayerStates}
            onPlayToggle={onPlayToggle}
            onVolumeChange={onVolumeChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DesktopAudioPlayer;
