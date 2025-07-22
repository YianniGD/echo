
'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { AlertTriangle, ArrowLeft, ExternalLink, Phone } from 'lucide-react';

interface CrisisSupportPageProps {
    onNavigateBack: () => void;
}

const CrisisSupportPage: React.FC<CrisisSupportPageProps> = ({ onNavigateBack }) => {
    return (
        <div className="space-y-8 animate-in fade-in-0 duration-750 max-w-3xl w-full">
            <ActionButton onClick={onNavigateBack} variant="text" size="sm" leadingIcon={<ArrowLeft />} className="mb-4">
                Back to Resources
            </ActionButton>
            
            <div className="bg-error-container/40 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-error flex-shrink-0" />
                    <div>
                        <h2 className="font-serif text-headline-md sm:text-headline-lg text-on-error-container">Immediate Support</h2>
                        <p className="text-body-lg text-on-error-container/80 mt-1">If you are in a crisis or any other person may be in danger, please use these resources.</p>
                    </div>
                </div>

                <div className="space-y-4 text-left">
                    <a href="tel:988" className="block w-full text-left p-4 bg-surface rounded-lg hover:bg-surface-container transition-colors">
                        <h3 className="font-bold text-title-lg text-surface-on flex items-center gap-2"><Phone className="w-5 h-5"/> Call or Text 988</h3>
                        <p className="text-surface-on-variant">The 988 Suicide & Crisis Lifeline provides 24/7, free, and confidential support.</p>
                    </a>
                    <a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="block w-full text-left p-4 bg-surface rounded-lg hover:bg-surface-container transition-colors">
                        <h3 className="font-bold text-title-lg text-surface-on flex items-center gap-2">Crisis Text Line <ExternalLink className="w-4 h-4"/></h3>
                        <p className="text-surface-on-variant">Text HOME to 741741 from anywhere in the US, anytime, about any type of crisis.</p>
                    </a>
                    <a href="tel:911" className="block w-full text-left p-4 bg-surface rounded-lg hover:bg-surface-container transition-colors">
                        <h3 className="font-bold text-title-lg text-surface-on flex items-center gap-2"><Phone className="w-5 h-5"/> Call 911</h3>
                        <p className="text-surface-on-variant">For any immediate life-threatening emergency, please call 911.</p>
                    </a>
                </div>

                 <p className="text-label-md text-on-error-container/80 text-center mt-8">
                    Your safety is important. This application is a tool for self-reflection and is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
            </div>
        </div>
    );
};

export default CrisisSupportPage;
