
'use client';
import React from 'react';
import { HelpCircle, ExternalLink, ArrowRight, BrainCircuit, Wind, AlertTriangle, Plus, Check, Heart, Waves, ListChecks } from 'lucide-react';
import { View, CopingMechanism } from '@/lib/types';
import ActionButton from './ActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PREDEFINED_STRATEGIES } from '@/lib/predefined-strategies';
import { cn } from '@/lib/utils';


interface ResourceHubCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    view: View;
    onNavigate: (view: View) => void;
}

const ResourceHubCard: React.FC<ResourceHubCardProps> = ({ title, description, icon, view, onNavigate }) => (
    <div className="bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
        <div className="flex items-start gap-4">
            <div className="text-primary mt-1">{icon}</div>
            <div className="flex-grow">
                <h4 className="text-title-lg font-medium text-surface-on">{title}</h4>
                <p className="text-body-md text-surface-on-variant mt-1 mb-4">{description}</p>
            </div>
        </div>
        <ActionButton 
            variant="tonal" 
            size="md" 
            onClick={() => onNavigate(view)} 
            className="mt-auto self-start"
            trailingIcon={<ArrowRight />}
        >
            Learn More
        </ActionButton>
    </div>
);

interface TechniqueCardProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    isAdded: boolean;
    onAdd: () => void;
    children: React.ReactNode;
    className?: string;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({ id, title, icon, isAdded, onAdd, children, className }) => {
    return (
        <Card className={cn("bg-surface-container-low shadow-sm border-outline-variant flex flex-col", className)}>
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

interface ResourcesPageProps {
  onNavigateToView: (view: View) => void;
  onAddCopingMechanism: (mechanism: CopingMechanism) => void;
  userCopingMechanisms: CopingMechanism[];
}

const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigateToView, onAddCopingMechanism, userCopingMechanisms }) => {
    
    const isMechanismAdded = (id: string) => userCopingMechanisms.some(m => m.id === id);

    return (
        <div className="space-y-10 animate-in fade-in-0 duration-750 max-w-4xl">
            <div className="flex items-center space-x-3">
                <HelpCircle className="w-8 h-8 text-primary" />
                <h2 className="font-serif text-headline-lg text-surface-on">Resources</h2>
            </div>
            <p className="text-body-lg text-surface-on-variant">
                Explore these guides to better understand the concepts behind the tools in this app and find support when you need it.
            </p>

            <div className="space-y-8">
                <section className="space-y-6">
                    <h3 className="font-serif text-headline-sm text-surface-on">Mindfulness & Coping Techniques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <TechniqueCard 
                            id="rain-exercise" 
                            title="RAIN Mindfulness Exercise"
                            icon={<Wind className="w-6 h-6"/>}
                            isAdded={isMechanismAdded('rain-exercise')}
                            onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[0])}
                        >
                            <p className="mb-4 text-sm">Mindfulness is a state of nonjudgmental awareness of what’s happening in the present moment. RAIN is a mindfulness practice that will help you focus on the present and cope with uncomfortable thoughts and emotions.</p>
                            
                            <div className="mb-4 p-3 bg-surface rounded-lg border border-outline-variant">
                                <h5 className="font-semibold text-primary">Prepare</h5>
                                <p className="text-sm">Sit or lie down in a comfortable position. Close your eyes or let your gaze soften. Take three slow, deep breaths.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="font-bold text-4xl text-primary">R</div>
                                    <div>
                                        <h5 className="font-semibold text-surface-on">Recognize</h5>
                                        <p className="text-sm">Let yourself feel at ease in the present moment. Slowly take in your surroundings. Recognize your thoughts, feelings, and physical sensations. Name your feelings out loud or silently to yourself.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="font-bold text-4xl text-primary">A</div>
                                    <div>
                                        <h5 className="font-semibold text-surface-on">Allow</h5>
                                        <p className="text-sm">Observe your experience as if watching a movie. Let your thoughts, feelings, and sensations come and go as they are. Let go of any judgment—it is okay to feel however you are feeling. You may tell yourself, "This is how it is right now."</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="font-bold text-4xl text-primary">I</div>
                                    <div>
                                        <h5 className="font-semibold text-surface-on">Investigate</h5>
                                        <p className="text-sm">What words are going through your mind? What emotions are you feeling, and where are they coming from? How are these feelings experienced in your body? Sense the most vulnerable part of yourself and reflect on what it needs, such as acceptance, forgiveness, love, or belonging.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="font-bold text-4xl text-primary">N</div>
                                    <div>
                                        <h5 className="font-semibold text-surface-on">Nurture</h5>
                                        <p className="text-sm">Be kind toward your experience. Give yourself a comforting message, such as "I love you," "you are okay," or anything else you need. Think of a friend, family member, pet, or spiritual figure, and imagine their love flowing to you. Let in healing and compassion until you feel calm and centered.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-surface rounded-lg border border-outline-variant">
                                <h5 className="font-semibold text-primary">Conclude</h5>
                                <p className="text-sm">Take three slow, deep breaths. Continue to be mindful and kind to yourself throughout your day.</p>
                            </div>
                        </TechniqueCard>
                        <div className="flex flex-col gap-6">
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
                                id="categories-exercise" 
                                title="Categories"
                                icon={<ListChecks className="w-6 h-6"/>}
                                isAdded={isMechanismAdded('categories-exercise')}
                                onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[4])}
                            >
                                <p className="mb-4">A simple distraction technique to shift your focus away from distressing thoughts.</p>
                                <ol className="list-decimal pl-5 space-y-2 text-sm">
                                    <li>Pick a broad category (e.g., animals, countries, car models, fruits, breakfast cereals).</li>
                                    <li>Mentally list as many items from that category as you can.</li>
                                    <li>Try to visualize each item as you name it.</li>
                                    <li>If you get stuck, simply choose a new category and begin again.</li>
                                </ol>
                            </TechniqueCard>
                        </div>
                        <TechniqueCard
                            id="urge-surfing"
                            title="Urge Surfing"
                            icon={<Waves className="w-6 h-6"/>}
                            isAdded={isMechanismAdded('urge-surfing')}
                            onAdd={() => onAddCopingMechanism(PREDEFINED_STRATEGIES[3])}
                            className="md:col-span-2"
                        >
                            <p className="mb-4">
                                A technique for managing your unwanted behaviors. Rather than giving in to an urge, you will ride it out, like a surfer riding a wave. After a short time, the urge will pass on its own.
                            </p>
                            <h4 className="font-semibold text-surface-on mb-2">How to Practice</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-sm mb-4">
                                <li>Acknowledge you are having an urge.</li>
                                <li>
                                    Notice your thoughts and feelings without trying to change or suppress them.
                                    <em className="block text-xs text-surface-on-variant/80 pl-2 border-l-2 border-outline ml-2 mt-1">
                                        Note: It is normal to feel some discomfort during an urge.
                                    </em>
                                </li>
                                <li>
                                    Remind yourself...
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>It's okay to have urges. They're natural reactions to addictions and habits.</li>
                                        <li>Some discomfort is okay. I don't have to change it.</li>
                                        <li>An urge is a feeling, not a "must." I can have this feeling and choose not to act.</li>
                                        <li>An urge is temporary. Like any other feeling, it will pass on its own.</li>
                                    </ul>
                                </li>
                            </ol>
                            <h4 className="font-semibold text-surface-on mb-2">Other Skills</h4>
                            <div className="space-y-2 text-sm mb-6">
                                <div>
                                    <h5 className="font-medium text-surface-on">Managing Triggers</h5>
                                    <p>Use coping skills to reduce the power of triggers. Know your triggers ahead of time, and have a strategy or skill prepared for each one.</p>
                                </div>
                                <div>
                                    <h5 className="font-medium text-surface-on">Delay & Distraction</h5>
                                    <p>Do something to take your mind off the urge. Every minute you delay increases the chance of the urge weakening on its own.</p>
                                </div>
                            </div>
                            <div className="relative mt-4">
                                <div className="h-48 w-full rounded-lg bg-surface border border-outline-variant"></div>
                                <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-x-2 p-2 sm:p-4 text-xs">
                                    <div className="col-start-1 row-start-2 p-2 bg-surface-container/80 rounded-lg text-center shadow-md">
                                        <p className="font-bold text-primary">Trigger</p>
                                        <p className="text-surface-on-variant text-[10px] leading-tight">An urge is triggered by a person, place, thought, feeling, or something else.</p>
                                    </div>
                                    <div className="col-start-2 row-start-1 p-2 bg-surface-container/80 rounded-lg text-center shadow-md">
                                        <p className="font-bold text-primary">Rise</p>
                                        <p className="text-surface-on-variant text-[10px] leading-tight">The urge becomes more intense. This may happen gradually or very suddenly.</p>
                                    </div>
                                    <div className="col-start-3 row-start-1 p-2 bg-surface-container/80 rounded-lg text-center shadow-md">
                                        <p className="font-bold text-primary">Peak</p>
                                        <p className="text-surface-on-variant text-[10px] leading-tight">The urge reaches its most intense point. It may feel as if the urge will never go away.</p>
                                    </div>
                                     <div className="col-start-4 row-start-2 p-2 bg-surface-container/80 rounded-lg text-center shadow-md">
                                        <p className="font-bold text-primary">Fall</p>
                                        <p className="text-surface-on-variant text-[10px] leading-tight">The urge loses intensity and eventually fades away.</p>
                                    </div>
                                </div>
                            </div>
                        </TechniqueCard>
                    </div>

                    <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                        <CardHeader>
                            <CardTitle className="font-serif text-title-lg text-surface-on flex items-center gap-2"><BrainCircuit/> The Wise Mind</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-body-md text-surface-on-variant">
                                Your mind has three states: The reasonable mind, the emotional mind, and the wise mind. Everyone possesses each of these states, but most people gravitate toward a specific one most of the time.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-surface rounded-lg border-l-4 border-red-400">
                                     <h4 className="font-semibold text-surface-on">Emotional Mind</h4>
                                    <p className="text-sm text-surface-on-variant mt-1">Used when feelings control a person’s thoughts and behavior. They might act impulsively with little regard for consequences.</p>
                                </div>
                                <div className="p-4 bg-surface rounded-lg border-l-4 border-purple-400">
                                     <h4 className="font-semibold text-surface-on">Wise Mind</h4>
                                    <p className="text-sm text-surface-on-variant mt-1">Refers to a balance between the reasonable and emotional halves. They are able to recognize and respect their feelings, while responding to them in a rational manner.</p>
                                </div>
                                <div className="p-4 bg-surface rounded-lg border-l-4 border-blue-400">
                                     <h4 className="font-semibold text-surface-on">Reasonable Mind</h4>
                                    <p className="text-sm text-surface-on-variant mt-1">A person uses their Reasonable mind when they approach a situation intellectually. They plan and make decisions based on fact.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
                
                <section className="bg-surface-container-low p-6 sm:p-8 rounded-2xl shadow-lg">
                     <h3 className="font-serif text-headline-sm text-surface-on mb-4">Guides & Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ResourceHubCard
                            title="Understanding CBT"
                            description="Learn about Cognitive Behavioral Therapy and how the Thought Record tool can help you challenge and reframe unhelpful thoughts."
                            icon={<BrainCircuit className="w-7 h-7" />}
                            view="understanding-cbt"
                            onNavigate={onNavigateToView}
                        />
                        <ResourceHubCard
                            title="Crisis Support"
                            description="If you are in a crisis or need immediate support, please use these resources. You are not alone."
                            icon={<AlertTriangle className="w-7 h-7 text-error" />}
                            view="crisis-support"
                            onNavigate={onNavigateToView}
                        />
                    </div>
                </section>
            </div>
             <p className="text-label-md text-center text-surface-on-variant pt-4">
                The content in this app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
        </div>
    );
};

export default ResourcesPage;
