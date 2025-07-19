'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Wind, ArrowLeft, BrainCircuit, Heart, Plus, Check, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PREDEFINED_STRATEGIES } from '@/lib/predefined-strategies';
import { CopingMechanism } from '@/lib/types';


interface MindfulnessTechniquesPageProps {
    onNavigateBack: () => void;
    onAddCopingMechanism: (mechanism: CopingMechanism) => void;
    userCopingMechanisms: CopingMechanism[];
}

interface TechniqueCardProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    isAdded: boolean;
    onAdd: () => void;
    children: React.ReactNode;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({ id, title, icon, isAdded, onAdd, children }) => {
    return (
        <Card className="bg-surface-container-low shadow-sm border-outline-variant flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-primary">{icon}</div>
                        <CardTitle className="font-serif text-title-lg text-surface-on">{title}</CardTitle>
                    </div>
                    <ActionButton
                        variant={isAdded ? "tonal" : "outlined"}
                        size="sm"
                        leadingIcon={isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        onClick={onAdd}
                        disabled={isAdded}
                        aria-label={isAdded ? `Added ${title} to your strategies` : `Add ${title} to your strategies`}
                    >
                        {isAdded ? "Added" : "Add"}
                    </ActionButton>
                </div>
            </CardHeader>
            <CardContent className="text-body-md text-surface-on-variant flex-grow">
                {children}
            </CardContent>
        </Card>
    );
}


const MindfulnessTechniquesPage: React.FC<MindfulnessTechniquesPageProps> = ({ onNavigateBack, onAddCopingMechanism, userCopingMechanisms }) => {
    
    const isMechanismAdded = (id: string) => userCopingMechanisms.some(m => m.id === id);

    return (
        <div className="space-y-8 animate-in fade-in-0 duration-750 max-w-3xl w-full">
            <ActionButton onClick={onNavigateBack} variant="text" size="sm" leadingIcon={<ArrowLeft />} className="mb-4">
                Back to Resources
            </ActionButton>
            
            <div className="flex items-center space-x-3">
                <Wind className="w-8 h-8 text-primary" />
                <h2 className="font-serif text-headline-lg text-surface-on">Mindfulness & Coping</h2>
            </div>
            <p className="text-body-lg text-surface-on-variant">
                Mindfulness is the practice of paying attention to the present moment without judgment. These techniques can help you manage distressing emotions, cope with urges, and cultivate a sense of calm.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TechniqueCard 
                    id="rain-exercise" 
                    title="RAIN Mindfulness"
                    icon={<Wind className="w-6 h-6"/>}
                    isAdded={isMechanismAdded('rain-exercise')}
                    onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[0])}
                >
                    <p className="mb-4">An acronym for recognizing, allowing, investigating, and nurturing your emotions.</p>
                     <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li><strong className="text-primary">Recognize:</strong> Acknowledge what is happening, both internally and externally.</li>
                        <li><strong className="text-primary">Allow:</strong> Let your experience be as it is, without trying to change or fix it.</li>
                        <li><strong className="text-primary">Investigate:</strong> Gently explore your thoughts, feelings, and sensations with curiosity.</li>
                        <li><strong className="text-primary">Nurture:</strong> Offer yourself kindness, compassion, and support.</li>
                    </ol>
                </TechniqueCard>
                 <TechniqueCard 
                    id="grounding-54321" 
                    title="5-4-3-2-1 Grounding"
                    icon={<BrainCircuit className="w-6 h-6"/>}
                    isAdded={isMechanismAdded('grounding-54321')}
                    onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[1])}
                >
                    <p className="mb-4">Use your five senses to bring yourself back to the present moment.</p>
                     <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><strong>5</strong> things you can see.</li>
                        <li><strong>4</strong> things you can feel.</li>
                        <li><strong>3</strong> things you can hear.</li>
                        <li><strong>2</strong> things you can smell.</li>
                        <li><strong>1</strong> thing you can taste.</li>
                    </ul>
                </TechniqueCard>
                 <TechniqueCard 
                    id="distress-accepts" 
                    title="ACCEPTS Technique"
                    icon={<Heart className="w-6 h-6"/>}
                    isAdded={isMechanismAdded('distress-accepts')}
                    onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[2])}
                >
                    <p className="mb-4">An acronym for distracting yourself from distressing emotions until they pass.</p>
                     <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><strong>A</strong>ctivities</li>
                        <li><strong>C</strong>ontributing</li>
                        <li><strong>C</strong>omparisons</li>
                        <li><strong>E</strong>motions</li>
                        <li><strong>P</strong>ushing Away</li>
                        <li><strong>T</strong>houghts</li>
                        <li><strong>S</strong>ensations</li>
                    </ul>
                </TechniqueCard>
                 <TechniqueCard 
                    id="urge-surfing" 
                    title="Urge Surfing"
                    icon={<Waves className="w-6 h-6"/>}
                    isAdded={isMechanismAdded('urge-surfing')}
                    onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[3])}
                >
                    <p className="mb-4">A technique for managing unwanted behaviors by "riding out" the urge like a wave until it passes.</p>
                     <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Acknowledge the urge.</li>
                        <li>Notice your thoughts without judgment.</li>
                        <li>Remind yourself the urge is temporary and will pass.</li>
                    </ol>
                </TechniqueCard>
            </div>
            
            <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                <CardHeader>
                    <CardTitle className="font-serif text-title-lg text-surface-on flex items-center gap-2"><BrainCircuit/> The Wise Mind</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-body-md text-surface-on-variant">
                        Your mind has three states: The reasonable mind, the emotional mind, and the wise mind. Everyone possesses each of these states, but most people gravitate toward one. The goal is to find balance in the wise mind.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-surface rounded-lg text-center border-l-4 border-red-400">
                             <h4 className="font-semibold text-surface-on">Emotional Mind</h4>
                            <p className="text-sm text-surface-on-variant">Feelings control thoughts and behavior. Can be impulsive.</p>
                        </div>
                        <div className="p-4 bg-surface rounded-lg text-center border-l-4 border-purple-400">
                             <h4 className="font-semibold text-surface-on">Wise Mind</h4>
                            <p className="text-sm text-surface-on-variant">A balance of both. Recognizes feelings but responds rationally.</p>
                        </div>
                        <div className="p-4 bg-surface rounded-lg text-center border-l-4 border-blue-400">
                             <h4 className="font-semibold text-surface-on">Reasonable Mind</h4>
                            <p className="text-sm text-surface-on-variant">Approaches situations intellectually, based on facts.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                <CardHeader>
                    <CardTitle className="font-serif text-title-lg text-surface-on flex items-center gap-2"><Heart/> Strengths List</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-body-md text-surface-on-variant mb-4">
                        Recognizing your strengths is a powerful tool. Refer to this list when you need a reminder of your capabilities.
                    </p>
                    <div className="columns-2 sm:columns-3 md:columns-4 gap-4 text-sm text-surface-on-variant">
                        <p>Wisdom</p><p>Empathy</p><p>Enthusiasm</p><p>Fairness</p><p>Modesty</p><p>Gratitude</p><p>Ambition</p><p>Athleticism</p><p>Optimism</p><p>Artistic Ability</p><p>Honesty</p><p>Kindness</p><p>Bravery</p><p>Common Sense</p><p>Love of Learning</p><p>Creativity</p><p>Discipline</p><p>Independence</p><p>Curiosity</p><p>Mindedness</p><p>Love</p><p>Cooperation</p><p>Self-Control</p><p>Humor</p><p>Confidence</p><p>Assertiveness</p><p>Flexibility</p><p>Leadership</p><p>Persistence</p><p>Social Awareness</p><p>Patience</p><p>Forgiveness</p><p>Spirituality</p><p>Intelligence</p><p>Logic</p><p>Adventurous</p>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default MindfulnessTechniquesPage;
