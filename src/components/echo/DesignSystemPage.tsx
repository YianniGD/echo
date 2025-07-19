
'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Layers, Palette as PaletteIcon, Type, ToyBrick, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Palette } from '@/lib/types';

interface DesignSystemPageProps {
  currentPalette: Palette;
  onChangePalette: (palette: Palette) => void;
}

const palettes: { name: Palette; label: string; bgColor: string, textColor: string }[] = [
    { name: 'echo', label: 'Echo', bgColor: 'hsl(205 75% 45%)', textColor: 'hsl(0 0% 100%)' },
    { name: 'forest', label: 'Forest', bgColor: 'hsl(110 35% 45%)', textColor: 'hsl(110 35% 98%)' },
    { name: 'buttercup', label: 'Buttercup', bgColor: 'hsl(45 80% 60%)', textColor: 'hsl(45 25% 15%)' },
    { name: 'sunset', label: 'Sunset', bgColor: 'hsl(20 80% 45%)', textColor: 'hsl(20 80% 98%)' },
];

const colorCategories = [
    {
        name: 'Primary',
        colors: [
            { name: 'Primary', var: 'hsl(var(--primary))', text: 'hsl(var(--primary-foreground))' },
            { name: 'Primary Container', var: 'hsl(var(--primary-container))', text: 'hsl(var(--on-primary-container))' },
        ]
    },
    {
        name: 'Secondary',
        colors: [
            { name: 'Secondary', var: 'hsl(var(--secondary))', text: 'hsl(var(--secondary-foreground))' },
            { name: 'Secondary Container', var: 'hsl(var(--secondary-container))', text: 'hsl(var(--on-secondary-container))' },
        ]
    },
    {
        name: 'Tertiary',
        colors: [
            { name: 'Tertiary', var: 'hsl(var(--tertiary))', text: 'hsl(var(--on-tertiary))' },
            { name: 'Tertiary Container', var: 'hsl(var(--tertiary-container))', text: 'hsl(var(--on-tertiary-container))' },
        ]
    },
    {
        name: 'Surface',
        colors: [
            { name: 'Background', var: 'hsl(var(--background))', text: 'hsl(var(--foreground))' },
            { name: 'Surface', var: 'hsl(var(--surface))', text: 'hsl(var(--on-surface))' },
            { name: 'Surface Variant', var: 'hsl(var(--surface-variant))', text: 'hsl(var(--on-surface-variant))' },
            { name: 'Surface Container Low', var: 'hsl(var(--surface-container-low))', text: 'hsl(var(--on-surface))' },
            { name: 'Surface Container', var: 'hsl(var(--surface-container))', text: 'hsl(var(--on-surface))' },
            { name: 'Surface Container High', var: 'hsl(var(--surface-container-high))', text: 'hsl(var(--on-surface))' },
        ]
    },
    {
        name: 'Utility',
        colors: [
            { name: 'Error Container', var: 'hsl(var(--error-container))', text: 'hsl(var(--on-error-container))' },
            { name: 'Outline', var: 'hsl(var(--outline))', text: 'hsl(var(--background))', border: true },
            { name: 'Outline Variant', var: 'hsl(var(--outline-variant))', text: 'hsl(var(--background))', border: true },
        ]
    }
];

const typographyStyles = [
  { name: 'Display Large', class: 'font-serif text-display-lg' },
  { name: 'Display Medium', class: 'font-serif text-display-md' },
  { name: 'Display Small', class: 'font-serif text-display-sm' },
  { name: 'Headline Large', class: 'font-serif text-headline-lg' },
  { name: 'Headline Medium', class: 'font-serif text-headline-md' },
  { name: 'Headline Small', class: 'font-serif text-headline-sm' },
  { name: 'Title Large', class: 'font-serif text-title-lg' },
  { name: 'Title Medium', class: 'font-serif text-title-md' },
  { name: 'Title Small', class: 'font-serif text-title-sm' },
  { name: 'Body Large', class: 'text-body-lg' },
  { name: 'Body Medium', class: 'text-body-md' },
  { name: 'Body Small', class: 'text-body-sm' },
  { name: 'Label Large', class: 'text-label-lg' },
  { name: 'Label Medium', class: 'text-label-md' },
  { name: 'Label Small', class: 'text-label-sm' },
];


const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ currentPalette, onChangePalette }) => {
    const [sliderValue, setSliderValue] = React.useState([50]);
    const [isChecked, setIsChecked] = React.useState(false);

    return (
        <div className="space-y-12 animate-in fade-in-0 duration-750 max-w-5xl w-full">
            <div className="flex items-center space-x-3">
                <Layers className="w-8 h-8 text-primary" />
                <h2 className="font-serif text-headline-lg text-surface-on">Design System</h2>
            </div>
            
            <section aria-labelledby="colors-heading" className="space-y-6">
                <div className="flex items-center space-x-3">
                    <PaletteIcon className="w-7 h-7 text-secondary" />
                    <h3 id="colors-heading" className="font-serif text-headline-md text-surface-on">Color Palette</h3>
                </div>

                <div className="bg-surface-container-low p-6 rounded-lg shadow-sm">
                    <h4 className="text-title-md font-medium text-surface-on mb-3">Live Theme Selector</h4>
                    <p className="text-body-md text-surface-on-variant mb-4">Select a palette to see it applied to this page and the entire app instantly.</p>
                    <div className="flex flex-wrap gap-3">
                        {palettes.map(p => (
                            <button
                                key={p.name}
                                onClick={() => onChangePalette(p.name)}
                                style={{ backgroundColor: p.bgColor, color: p.textColor }}
                                className={cn(
                                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium px-6 h-10 transition-all duration-200",
                                    "hover:brightness-110 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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

                {colorCategories.map(category => (
                    <div key={category.name}>
                        <h4 className="font-serif text-title-lg text-surface-on-variant mb-3">{category.name}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {category.colors.map(color => (
                                <div key={color.name} style={{ backgroundColor: color.var, color: color.text, borderColor: color.border ? 'hsl(var(--outline))' : 'transparent' }} className="p-4 rounded-lg shadow-sm border">
                                    <p className="font-medium text-sm">{color.name}</p>
                                    <p className="text-xs opacity-80">{color.var}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
            
            <section aria-labelledby="typography-heading" className="space-y-6">
                <div className="flex items-center space-x-3">
                    <Type className="w-7 h-7 text-secondary" />
                    <h3 id="typography-heading" className="font-serif text-headline-md text-surface-on">Typography</h3>
                </div>
                <div className="bg-surface-container-low p-6 rounded-lg shadow-sm space-y-4">
                    {typographyStyles.map(style => (
                        <div key={style.name} className="flex flex-col sm:flex-row sm:items-baseline gap-x-6">
                            <p className="text-sm text-surface-on-variant w-40 shrink-0">{style.name}</p>
                            <p className={cn('text-surface-on truncate', style.class)}>The five boxing wizards jump quickly.</p>
                        </div>
                    ))}
                </div>
            </section>

            <section aria-labelledby="components-heading" className="space-y-6">
                 <div className="flex items-center space-x-3">
                    <ToyBrick className="w-7 h-7 text-secondary" />
                    <h3 id="components-heading" className="font-serif text-headline-md text-surface-on">Components</h3>
                </div>
                <div className="space-y-8">
                    <div>
                        <h4 className="font-serif text-title-lg text-surface-on-variant mb-3">Action Buttons</h4>
                        <div className="bg-surface-container-low p-6 rounded-lg shadow-sm flex flex-wrap items-center justify-center gap-4">
                            <ActionButton variant="filled">Filled Button</ActionButton>
                            <ActionButton variant="tonal">Tonal Button</ActionButton>
                            <ActionButton variant="outlined">Outlined Button</ActionButton>
                            <ActionButton variant="text">Text Button</ActionButton>
                            <ActionButton variant="elevated">Elevated Button</ActionButton>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-serif text-title-lg text-surface-on-variant mb-3">Inputs & Controls</h4>
                        <div className="bg-surface-container-low p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <Label htmlFor="ds-input">Text Input</Label>
                                <Input id="ds-input" type="text" placeholder="Type something..." className="mt-1" />
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="ds-checkbox" checked={isChecked} onCheckedChange={(checked) => setIsChecked(!!checked)} />
                                <Label htmlFor="ds-checkbox">Checkbox</Label>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="ds-slider">Slider</Label>
                                <Slider
                                    id="ds-slider"
                                    value={[sliderValue[0]]}
                                    onValueChange={setSliderValue}
                                    max={100}
                                    step={1}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DesignSystemPage;
