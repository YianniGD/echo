
'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Settings, Download, Info, Trash2, Moon, Sun, Server, AlertTriangle, Palette as PaletteIcon, Check, Layers } from 'lucide-react';
import { Palette, Theme, View } from '@/lib/types';
import { cn } from '@/lib/utils';


interface SettingsPageProps {
  currentTheme: Theme;
  currentPalette: Palette;
  onToggleTheme: () => void;
  onChangePalette: (palette: Palette) => void;
  onDownloadJournal: () => void;
  onShowDriveInfo: () => void;
  onClearJournal: () => void;
  onClearPlanner: () => void;
  onClearMedication: () => void;
  onClearAllData: () => void;
  onNavigateToView: (view: View) => void;
}

const palettes: { name: Palette; label: string; bgColor: string, textColor: string }[] = [
    { name: 'echo', label: 'Echo', bgColor: '#2185D0', textColor: '#FFFFFF' },
    { name: 'forest', label: 'Forest', bgColor: '#6a994e', textColor: '#f5fcf4' },
    { name: 'buttercup', label: 'Buttercup', bgColor: '#F2C05C', textColor: '#3a3221' },
    { name: 'sunset', label: 'Sunset', bgColor: '#CF5221', textColor: '#fef5f2' },
];

const SettingsPage: React.FC<SettingsPageProps> = ({
  currentTheme,
  currentPalette,
  onToggleTheme,
  onChangePalette,
  onDownloadJournal,
  onShowDriveInfo,
  onClearJournal,
  onClearPlanner,
  onClearMedication,
  onClearAllData,
  onNavigateToView,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in-0 duration-750 max-w-3xl w-full">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-primary" />
        <h2 className="font-serif text-headline-lg text-surface-on">Settings</h2>
      </div>

      <section aria-labelledby="appearance-heading">
        <div className="flex items-start gap-4">
          <div className="text-primary mt-1"><PaletteIcon className="w-6 h-6" /></div>
          <div className="flex-grow space-y-6">
            <div>
              <h3 id="appearance-heading" className="font-serif text-headline-sm text-surface-on">Appearance</h3>
              <p className="text-body-md text-surface-on-variant mt-1">Customize the look, feel, and color scheme of the application.</p>
            </div>
            
            <div className="space-y-6 pl-2">
              <div>
                <h4 className="text-title-md font-medium text-surface-on mb-3">Theme</h4>
                <div className="flex flex-wrap gap-3 items-center">
                  <ActionButton
                    variant="tonal"
                    size="md"
                    leadingIcon={currentTheme === 'light' ? <Moon /> : <Sun />}
                    onClick={onToggleTheme}
                  >
                    Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
                  </ActionButton>
                </div>
              </div>
              
              <div>
                <h4 className="text-title-md font-medium text-surface-on mb-3">Color Palette</h4>
                <div className="flex flex-wrap gap-3">
                    {palettes.map(p => (
                         <button
                            key={p.name}
                            onClick={() => onChangePalette(p.name)}
                            style={{ backgroundColor: p.bgColor, color: p.textColor }}
                            className={cn(
                                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium px-6 h-10 transition-all duration-200",
                                "hover:brightness-110 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-background",
                                currentPalette === p.name && "ring-2 ring-offset-2 ring-ring ring-offset-background"
                            )}
                            aria-pressed={currentPalette === p.name}
                        >
                            <span>{p.label}</span>
                            {currentPalette === p.name && <Check className="w-5 h-5" />}
                        </button>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      
      <hr className="border-t border-outline-variant" />

      <section aria-labelledby="data-heading">
        <div className="flex items-start gap-4">
          <div className="text-primary mt-1"><Server className="w-6 h-6" /></div>
          <div className="flex-grow">
            <h3 id="data-heading" className="font-serif text-headline-sm text-surface-on">Data Export</h3>
            <p className="text-body-md text-surface-on-variant mt-1 mb-4">Export your journal data to a PDF file.</p>
            <div className="flex flex-wrap gap-3 items-center">
              <ActionButton variant="tonal" size="md" leadingIcon={<Download />} onClick={onDownloadJournal}>
                Export Journal as PDF
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t border-outline-variant" />

      <section aria-labelledby="info-heading">
        <div className="flex items-start gap-4">
          <div className="text-primary mt-1"><Info className="w-6 h-6" /></div>
          <div className="flex-grow">
            <h3 id="info-heading" className="font-serif text-headline-sm text-surface-on">Information</h3>
            <p className="text-body-md text-surface-on-variant mt-1 mb-4">Learn about cloud backup or view the application's design system.</p>
            <div className="flex flex-wrap gap-3 items-center">
                <ActionButton variant="tonal" size="md" leadingIcon={<Layers />} onClick={() => onNavigateToView('designSystem')}>
                    View Design System
                </ActionButton>
                <ActionButton variant="outlined" size="md" leadingIcon={<Info />} onClick={onShowDriveInfo}>
                    Cloud Backup Info
                </ActionButton>
            </div>
          </div>
        </div>
      </section>

       <hr className="border-t border-outline-variant" />

      <section aria-labelledby="danger-zone-heading">
        <div className="flex items-start gap-4">
          <div className="text-error mt-1"><AlertTriangle className="w-6 h-6" /></div>
          <div className="flex-grow">
            <h3 id="danger-zone-heading" className="font-serif text-headline-sm text-error">Danger Zone</h3>
            <p className="text-body-md text-error/80 mt-1 mb-6">These actions are irreversible. Please be certain before proceeding.</p>
            <ul className="space-y-4">
              <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-surface-container rounded-lg">
                <div>
                  <h4 className="text-title-md text-surface-on">Clear Journal Data</h4>
                  <p className="text-sm text-surface-on-variant">Permanently delete all journal entries.</p>
                </div>
                <ActionButton variant="outlined" size="sm" onClick={onClearJournal} className="text-error hover:bg-error-container/20 border-error">Clear Journal</ActionButton>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-surface-container rounded-lg">
                <div>
                  <h4 className="text-title-md text-surface-on">Clear Planner Data</h4>
                  <p className="text-sm text-surface-on-variant">Permanently delete all daily and weekly plans.</p>
                </div>
                <ActionButton variant="outlined" size="sm" onClick={onClearPlanner} className="text-error hover:bg-error-container/20 border-error">Clear Planner</ActionButton>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-surface-container rounded-lg">
                <div>
                  <h4 className="text-title-md text-surface-on">Clear Medication Data</h4>
                  <p className="text-sm text-surface-on-variant">Permanently delete all meds, bundles, and logs.</p>
                </div>
                <ActionButton variant="outlined" size="sm" onClick={onClearMedication} className="text-error hover:bg-error-container/20 border-error">Clear Medication</ActionButton>
              </li>
              <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-error-container/40 rounded-lg mt-6">
                <div>
                  <h4 className="text-title-md text-on-error-container">Clear All Application Data</h4>
                  <p className="text-sm text-on-error-container/80">Permanently delete EVERYTHING. This cannot be undone.</p>
                </div>
                <ActionButton variant="filled" size="sm" onClick={onClearAllData} leadingIcon={<Trash2 />} className="!bg-error !text-on-error">Clear All Data</ActionButton>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
