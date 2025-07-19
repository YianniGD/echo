
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileData, CopingMechanism, View, Theme, Palette } from '@/lib/types';
import ActionButton from '@/components/echo/ActionButton';
import { 
    User, Save, Plus, Trash2, Check, Layers, Palette as PaletteIcon, 
    Moon, Sun, Download, Info, AlertTriangle, Server, RefreshCw, Heart, DownloadCloud, LogOut, XCircle
} from 'lucide-react';
import { STRENGTHS_LIST } from '@/lib/strengths';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { usePWAInstall } from '@/hooks/usePWAInstall';

interface ProfilePageProps {
    profileData: ProfileData;
    onUpdateProfile: (newProfileData: ProfileData) => void;
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
    onReOnboard: () => void;
}

const widgetConfig = {
    planner: { label: 'Planner Widget', description: "Shows today's goals and progress." },
    affirmations: { label: 'Affirmations Widget', description: 'Displays your favorite affirmations.' },
    medication: { label: 'Medication Widget', description: 'Tracks medication counts and bundles.' },
    copingMechanisms: { label: 'Coping Strategies Widget', description: "Displays one of your quick strategies." },
};

const palettes: { name: Palette; label: string; bgColor: string, textColor: string }[] = [
    { name: 'echo', label: 'Echo', bgColor: 'hsl(205 75% 45%)', textColor: 'hsl(0 0% 100%)' },
    { name: 'forest', label: 'Forest', bgColor: 'hsl(110 35% 45%)', textColor: 'hsl(110 35% 98%)' },
    { name: 'buttercup', label: 'Buttercup', bgColor: 'hsl(45 80% 60%)', textColor: 'hsl(45 25% 15%)' },
    { name: 'sunset', label: 'Sunset', bgColor: 'hsl(20 80% 45%)', textColor: 'hsl(20 80% 98%)' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({
    profileData, onUpdateProfile, currentTheme, currentPalette, onToggleTheme, onChangePalette,
    onDownloadJournal, onShowDriveInfo, onClearJournal, onClearPlanner, onClearMedication,
    onClearAllData, onNavigateToView, onReOnboard
}) => {
    const [name, setName] = useState('');
    const [strengths, setStrengths] = useState<string[]>([]);
    const [mechanisms, setMechanisms] = useState<CopingMechanism[]>([]);
    const [widgets, setWidgets] = useState<Record<string, boolean>>({});
    const [favoriteAffirmations, setFavoriteAffirmations] = useState<string[]>([]);
    const [newMechanismText, setNewMechanismText] = useState('');
    const [isSaved, setIsSaved] = useState(true);
    const [isEditingStrengths, setIsEditingStrengths] = useState(false);
    const { installPrompt, handleInstallClick } = usePWAInstall();

    useEffect(() => {
        setName(profileData.name || '');
        setStrengths(profileData.strengths || []);
        setMechanisms(profileData.copingMechanisms || []);
        setWidgets(profileData.dashboardWidgets || {});
        setFavoriteAffirmations(profileData.favoriteAffirmations || []);
        setIsSaved(true); 
    }, [profileData]);

    const handleDataChange = useCallback(() => {
        setIsSaved(false);
    }, []);

    useEffect(() => {
        if (
            name !== profileData.name || 
            JSON.stringify(strengths.sort()) !== JSON.stringify(profileData.strengths?.sort() || []) ||
            JSON.stringify(mechanisms) !== JSON.stringify(profileData.copingMechanisms) ||
            JSON.stringify(widgets) !== JSON.stringify(profileData.dashboardWidgets) ||
            JSON.stringify(favoriteAffirmations) !== JSON.stringify(profileData.favoriteAffirmations)
        ) {
            handleDataChange();
        } else {
            setIsSaved(true);
        }
    }, [name, strengths, mechanisms, widgets, favoriteAffirmations, profileData, handleDataChange]);

    const handleStrengthToggle = (strength: string) => {
        setStrengths(prev =>
        prev.includes(strength)
            ? prev.filter(s => s !== strength)
            : [...prev, strength]
        );
    };

    const handleFavoriteAffirmationRemove = (affirmationToRemove: string) => {
        setFavoriteAffirmations(prev => prev.filter(fav => fav !== affirmationToRemove));
    };

    const handleWidgetToggle = (widgetKey: string) => setWidgets(prev => ({...prev, [widgetKey]: !prev[widgetKey]}));
    const handleSaveProfile = () => {
        onUpdateProfile({ name: name.trim(), strengths, copingMechanisms: mechanisms, dashboardWidgets: widgets, favoriteAffirmations });
        setIsSaved(true);
    };

    return (
        <div className="space-y-10 animate-in fade-in-0 duration-750 max-w-4xl w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-primary" />
                    <h2 className="font-serif text-headline-lg text-surface-on">Profile & Settings</h2>
                </div>
                <ActionButton onClick={handleSaveProfile} variant="filled" size="md" leadingIcon={<Save />} disabled={isSaved}>
                    {isSaved ? 'Saved' : 'Save Changes'}
                </ActionButton>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-surface-container-low shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5"/> Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-surface-on-variant mb-1">Your Name</label>
                            <input id="userName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="What should we call you?"
                                className="w-full p-4 bg-surface-container border border-outline-variant hover:border-outline focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-surface-on placeholder-surface-on-variant" 
                            />
                        </div>
                        <div>
                            <p className="block text-sm font-medium text-surface-on-variant mb-1">Account</p>
                            <p className="w-full p-4 bg-surface border border-outline-variant rounded-xl text-surface-on-variant truncate">
                                Guest Mode
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-surface-container-low shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PaletteIcon className="w-5 h-5"/> Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                            <h4 className="font-medium text-surface-on">Theme</h4>
                            <ActionButton variant="tonal" size="sm" leadingIcon={currentTheme === 'light' ? <Moon /> : <Sun />} onClick={onToggleTheme}>
                                Switch to {currentTheme === 'light' ? 'Dark' : 'Light'}
                            </ActionButton>
                        </div>
                        <div>
                            <h4 className="font-medium text-surface-on mb-3">Color Palette</h4>
                            <div className="flex flex-wrap gap-2">
                                {palettes.map(p => (
                                    <button key={p.name} onClick={() => onChangePalette(p.name)} style={{ backgroundColor: p.bgColor, color: p.textColor }}
                                        className={cn("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-xs font-medium px-4 h-8 transition-all", "hover:brightness-110 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", currentPalette === p.name && "ring-2 ring-offset-2 ring-ring")}>
                                        <span>{p.label}</span>
                                        {currentPalette === p.name && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-surface-container-low shadow-lg border-none">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5"/> My Strengths</CardTitle>
                        {!isEditingStrengths && (
                            <ActionButton variant="tonal" size="sm" onClick={() => setIsEditingStrengths(true)}>Edit</ActionButton>
                        )}
                    </div>
                    {!isEditingStrengths && (
                         <CardDescription>A reminder of your best qualities. Click "Edit" to update.</CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {isEditingStrengths ? (
                        <>
                            <p className="text-body-md text-surface-on-variant mb-4">Select the qualities that resonate with you.</p>
                            <div className="flex flex-wrap gap-2">
                                {STRENGTHS_LIST.map(strength => {
                                    const isSelected = strengths.includes(strength);
                                    return (
                                        <button
                                            key={strength}
                                            onClick={() => handleStrengthToggle(strength)}
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                                            isSelected
                                                ? 'bg-secondary-container border-secondary-container text-on-secondary-container'
                                                : 'bg-surface border-outline-variant hover:border-outline text-surface-on-variant'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                            {strength}
                                            {isSelected && <Check className="w-4 h-4" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <ActionButton variant="text" onClick={() => {
                                    setIsEditingStrengths(false);
                                    setStrengths(profileData.strengths || []); // Reset changes
                                }}>Cancel</ActionButton>
                                <ActionButton variant="tonal" onClick={() => setIsEditingStrengths(false)}>Done</ActionButton>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {strengths.length > 0 ? (
                                strengths.map(strength => (
                                    <Badge key={strength} variant="secondary" className="text-base px-3 py-1 bg-secondary-container text-on-secondary-container border-transparent">{strength}</Badge>
                                ))
                            ) : (
                                <p className="text-body-md text-surface-on-variant italic">No strengths selected yet. Click "Edit" to add some.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-yellow-500"/> My Affirmations</CardTitle>
                    <CardDescription>Manage your list of custom and favorite affirmations.</CardDescription>
                </CardHeader>
                <CardContent>
                    {favoriteAffirmations.length > 0 ? (
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {favoriteAffirmations.map((affirmation, index) => (
                                <li key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                    <p className="text-body-md text-surface-on flex-grow mr-2">"{affirmation}"</p>
                                    <ActionButton
                                        variant="text"
                                        size="sm"
                                        isIconOnly
                                        title="Remove affirmation"
                                        className="text-error hover:bg-error-container/20"
                                        onClick={() => handleFavoriteAffirmationRemove(affirmation)}
                                    >
                                        <Trash2 className="w-5 h-5"/>
                                    </ActionButton>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-body-md text-surface-on-variant italic">No affirmations favorited yet. Find some on the Affirmations page!</p>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5"/> Dashboard Customization</CardTitle>
                    <CardDescription>Choose which widgets appear on your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {Object.entries(widgetConfig).map(([key, config]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                            <div>
                                <h4 className="font-medium text-surface-on">{config.label}</h4>
                                <p className="text-sm text-surface-on-variant">{config.description}</p>
                            </div>
                            <Switch checked={!!widgets[key]} onCheckedChange={() => handleWidgetToggle(key)} aria-label={`Toggle ${config.label} widget`} />
                        </div>
                    ))}
                </CardContent>
            </Card>

             <Card className="bg-surface-container-low shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5"/> Data & Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {installPrompt && (
                        <ActionButton variant="filled" size="md" leadingIcon={<DownloadCloud />} onClick={handleInstallClick}>Install App</ActionButton>
                    )}
                    <ActionButton variant="tonal" size="md" leadingIcon={<Download />} onClick={onDownloadJournal}>Export Journal</ActionButton>
                    <ActionButton variant="tonal" size="md" leadingIcon={<Layers />} onClick={() => onNavigateToView('designSystem')}>View Design System</ActionButton>
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-error"/> Danger Zone</CardTitle>
                    <CardDescription className="!text-error/80">These actions are irreversible. Please be certain before proceeding.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-4 bg-surface rounded-lg border border-outline-variant space-y-2">
                        <h4 className="font-medium text-surface-on">Clear Journal & Planner</h4>
                        <p className="text-sm text-surface-on-variant">Permanently delete all entries, records, and plans.</p>
                        <div className="flex gap-2 pt-2">
                            <ActionButton variant="outlined" size="sm" onClick={onClearJournal} className="text-error hover:bg-error-container/20 border-error">Journal</ActionButton>
                            <ActionButton variant="outlined" size="sm" onClick={onClearPlanner} className="text-error hover:bg-error-container/20 border-error">Planner</ActionButton>
                        </div>
                    </div>
                     <div className="p-4 bg-surface rounded-lg border border-outline-variant space-y-2">
                        <h4 className="font-medium text-surface-on">Clear Medication Data</h4>
                        <p className="text-sm text-surface-on-variant">Permanently delete all meds, bundles, and logs.</p>
                         <ActionButton variant="outlined" size="sm" onClick={onClearMedication} className="text-error hover:bg-error-container/20 border-error mt-6">Clear Meds</ActionButton>
                    </div>
                    <div className="md:col-span-2 p-4 bg-error-container/40 rounded-lg mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <h4 className="font-bold text-on-error-container">Clear All Application Data</h4>
                            <p className="text-sm text-on-error-container/80">Permanently delete EVERYTHING. This cannot be undone.</p>
                        </div>
                        <ActionButton variant="filled" size="sm" onClick={onClearAllData} leadingIcon={<Trash2 />} className="!bg-error !text-on-error shrink-0">Clear All Data</ActionButton>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center pt-6 border-t border-outline-variant">
                 <ActionButton variant="text" size="sm" leadingIcon={<RefreshCw />} onClick={onReOnboard}>
                    Re-run Onboarding (for testing)
                </ActionButton>
            </div>
        </div>
    );
};

export default ProfilePage;
