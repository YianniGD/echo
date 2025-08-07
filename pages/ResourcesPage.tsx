
import React, { useState, useCallback } from 'react';
import { useCopingMechanisms } from '../hooks/useCopingMechanisms';
import { useStrengths } from '../hooks/useStrengths';
import type { CopingMechanism } from '../types';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import SelectableChip from '../components/ui/SelectableChip';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { WindIcon } from '../components/icons/WindIcon';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { ListChecksIcon } from '../components/icons/ListChecksIcon';
import { WavesIcon } from '../components/icons/WavesIcon';
import { AlertTriangleIcon } from '../components/icons/AlertTriangleIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { LifeBuoyIcon } from '../components/icons/LifeBuoyIcon';
import { AwardIcon } from '../components/icons/AwardIcon';
import { ALL_STRENGTHS, PREDEFINED_STRATEGIES } from '../constants';


type View = 'hub' | 'understanding-cbt' | 'crisis-support';

const TechniqueCard: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isAdded: boolean;
    onAdd: () => void;
    className?: string;
}> = ({ id, title, icon, children, isAdded, onAdd, className }) => {
    return (
        <Card className={`flex flex-col ${className}`}>
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-primary-500">{icon}</div>
                        <CardTitle>{title}</CardTitle>
                    </div>
                     <button onClick={onAdd} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${isAdded ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}>
                        {isAdded ? <CheckCircleIcon className="w-4 h-4" /> : <PlusCircleIcon className="w-4 h-4" />}
                        {isAdded ? 'In Toolkit' : 'Add to Toolkit'}
                    </button>
                </div>
            </CardHeader>
            <CardContent className="flex-grow text-gray-700 dark:text-gray-300">
                {children}
            </CardContent>
        </Card>
    );
};

const ResourceHubCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    view: View;
    onNavigate: (view: View) => void;
}> = ({ title, description, icon, view, onNavigate }) => {
    return (
        <button onClick={() => onNavigate(view)} className="w-full text-left bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
            <div className="flex-shrink-0 text-primary-500 mt-1">{icon}</div>
            <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </button>
    );
};

const HubView: React.FC<{ 
    onNavigate: (view: View) => void; 
    isMechanismAdded: (id: string) => boolean; 
    toggleCopingMechanism: (strategy: CopingMechanism) => void;
    strengths: string[];
    toggleStrength: (s: string) => void;
}> = ({ onNavigate, isMechanismAdded, toggleCopingMechanism, strengths, toggleStrength }) => (
    <div className="animate-fade-in-up">
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">
            Explore these guides to better understand the concepts behind the tools in this app and find support when you need it.
        </p>
        <div className="mt-8 space-y-12">

            <section>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3"><AwardIcon className="w-7 h-7 text-primary-500" /> My Strengths</h3>
                <Card>
                    <CardContent>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Recognizing your strengths is a powerful tool. Select from this list to be reminded of your capabilities on your dashboard and profile.
                        </p>
                        <div className="flex flex-wrap gap-3">
                             {ALL_STRENGTHS.map(strength => (
                                <SelectableChip key={strength} isSelected={strengths.includes(strength)} onSelect={() => toggleStrength(strength)}>
                                    {strength}
                                </SelectableChip>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Mindfulness & Coping Techniques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <TechniqueCard id="rain-exercise" title="RAIN Mindfulness Exercise" icon={<WindIcon className="w-6 h-6"/>} isAdded={isMechanismAdded('rain-exercise')} onAdd={() => toggleCopingMechanism(PREDEFINED_STRATEGIES[0])}>
                        <p className="mb-4 text-sm">Mindfulness is a state of nonjudgmental awareness of what’s happening in the present moment. RAIN is a mindfulness practice that will help you focus on the present and cope with uncomfortable thoughts and emotions.</p>
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"><h5 className="font-semibold text-primary-600 dark:text-primary-400">Prepare</h5><p className="text-sm">Sit or lie down in a comfortable position. Close your eyes or let your gaze soften. Take three slow, deep breaths.</p></div>
                        <div className="space-y-4">
                            <div className="flex gap-4"><div className="font-bold text-4xl text-primary-500">R</div><div><h5 className="font-semibold text-gray-800 dark:text-gray-100">Recognize</h5><p className="text-sm">Let yourself feel at ease in the present moment. Slowly take in your surroundings. Recognize your thoughts, feelings, and physical sensations. Name your feelings out loud or silently to yourself.</p></div></div>
                            <div className="flex gap-4"><div className="font-bold text-4xl text-primary-500">A</div><div><h5 className="font-semibold text-gray-800 dark:text-gray-100">Allow</h5><p className="text-sm">Observe your experience as if watching a movie. Let your thoughts, feelings, and sensations come and go as they are. Let go of any judgment—it is okay to feel however you are feeling. You may tell yourself, "This is how it is right now."</p></div></div>
                            <div className="flex gap-4"><div className="font-bold text-4xl text-primary-500">I</div><div><h5 className="font-semibold text-gray-800 dark:text-gray-100">Investigate</h5><p className="text-sm">What words are going through your mind? What emotions are you feeling, and where are they coming from? How are these feelings experienced in your body? Sense the most vulnerable part of yourself and reflect on what it needs, such as acceptance, forgiveness, love, or belonging.</p></div></div>
                            <div className="flex gap-4"><div className="font-bold text-4xl text-primary-500">N</div><div><h5 className="font-semibold text-gray-800 dark:text-gray-100">Nurture</h5><p className="text-sm">Be kind toward your experience. Give yourself a comforting message, such as "I love you," "you are okay," or anything else you need. Think of a friend, family member, pet, or spiritual figure, and imagine their love flowing to you. Let in healing and compassion until you feel calm and centered.</p></div></div>
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"><h5 className="font-semibold text-primary-600 dark:text-primary-400">Conclude</h5><p className="text-sm">Take three slow, deep breaths. Continue to be mindful and kind to yourself throughout your day.</p></div>
                    </TechniqueCard>
                    <div className="flex flex-col gap-6">
                        <TechniqueCard id="grounding-54321" title="5-4-3-2-1 Grounding" icon={<BrainCircuitIcon className="w-6 h-6"/>} isAdded={isMechanismAdded('grounding-54321')} onAdd={() => toggleCopingMechanism(PREDEFINED_STRATEGIES[1])}><p className="mb-4 text-sm">Use your five senses to bring yourself back to the present moment.</p><ul className="list-disc pl-5 space-y-1 text-sm"><li><strong>5</strong> things you can see.</li><li><strong>4</strong> things you can feel.</li><li><strong>3</strong> things you can hear.</li><li><strong>2</strong> things you can smell.</li><li><strong>1</strong> thing you can taste.</li></ul></TechniqueCard>
                        <TechniqueCard id="distress-accepts" title="ACCEPTS Technique" icon={<HeartIcon className="w-6 h-6"/>} isAdded={isMechanismAdded('distress-accepts')} onAdd={() => toggleCopingMechanism(PREDEFINED_STRATEGIES[2])}><p className="mb-4 text-sm">An acronym for distracting yourself from distressing emotions until they pass.</p><ul className="list-disc pl-5 space-y-1 text-sm"><li><strong>A</strong>ctivities</li><li><strong>C</strong>ontributing</li><li><strong>C</strong>omparisons</li><li><strong>E</strong>motions</li><li><strong>P</strong>ushing Away</li><li><strong>T</strong>houghts</li><li><strong>S</strong>ensations</li></ul></TechniqueCard>
                        <TechniqueCard id="categories-exercise" title="Categories" icon={<ListChecksIcon className="w-6 h-6"/>} isAdded={isMechanismAdded('categories-exercise')} onAdd={() => toggleCopingMechanism(PREDEFINED_STRATEGIES[4])}><p className="mb-4 text-sm">A simple distraction technique to shift your focus away from distressing thoughts.</p><ol className="list-decimal pl-5 space-y-2 text-sm"><li>Pick a broad category (e.g., animals, countries, car models, fruits).</li><li>Mentally list as many items from that category as you can.</li><li>Try to visualize each item as you name it.</li><li>If you get stuck, simply choose a new category and begin again.</li></ol></TechniqueCard>
                    </div>
                    <TechniqueCard id="urge-surfing" title="Urge Surfing" icon={<WavesIcon className="w-6 h-6"/>} isAdded={isMechanismAdded('urge-surfing')} onAdd={() => toggleCopingMechanism(PREDEFINED_STRATEGIES[3])} className="md:col-span-2">
                        <p className="mb-4 text-sm">A technique for managing your unwanted behaviors. Rather than giving in to an urge, you will ride it out, like a surfer riding a wave. After a short time, the urge will pass on its own.</p>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">How to Practice</h4>
                        <ol className="list-decimal pl-5 space-y-2 text-sm mb-4">
                            <li>Acknowledge you are having an urge.</li>
                            <li>Notice your thoughts and feelings without trying to change or suppress them. <em className="block text-xs text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-gray-300 dark:border-gray-600 ml-2 mt-1">Note: It is normal to feel some discomfort during an urge.</em></li>
                            <li>Remind yourself...<ul className="list-disc pl-5 mt-1 space-y-1"><li>It's okay to have urges. They're natural reactions to habits.</li><li>Some discomfort is okay. I don't have to change it.</li><li>An urge is a feeling, not a "must." I can have this feeling and choose not to act.</li><li>An urge is temporary. Like any other feeling, it will pass on its own.</li></ul></li>
                        </ol>
                    </TechniqueCard>
                </div>
                 <Card className="bg-gray-50 dark:bg-gray-800/50 shadow-sm border-gray-200 dark:border-gray-700">
                    <CardHeader><CardTitle className="text-gray-800 dark:text-white flex items-center gap-2"><BrainCircuitIcon className="w-6 h-6 text-primary-500"/> The Wise Mind</CardTitle></CardHeader>
                    <CardContent className="space-y-4"><p className="text-sm text-gray-600 dark:text-gray-300">Your mind has three states: The reasonable mind, the emotional mind, and the wise mind. Everyone possesses each of these states, but most people gravitate toward a specific one most of the time.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-red-400"><h4 className="font-semibold text-gray-800 dark:text-white">Emotional Mind</h4><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Used when feelings control a person’s thoughts and behavior. They might act impulsively with little regard for consequences.</p></div>
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-400"><h4 className="font-semibold text-gray-800 dark:text-white">Wise Mind</h4><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Refers to a balance between the reasonable and emotional halves. They are able to recognize and respect their feelings, while responding to them in a rational manner.</p></div>
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-400"><h4 className="font-semibold text-gray-800 dark:text-white">Reasonable Mind</h4><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">A person uses their Reasonable mind when they approach a situation intellectually. They plan and make decisions based on fact.</p></div>
                        </div>
                    </CardContent>
                </Card>
            </section>
            
            <section className="bg-gray-100 dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Guides & Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResourceHubCard title="Understanding CBT" description="Learn about Cognitive Behavioral Therapy and how the Thought Record tool can help you challenge and reframe unhelpful thoughts." icon={<BrainCircuitIcon className="w-7 h-7" />} view="understanding-cbt" onNavigate={onNavigate} />
                    <ResourceHubCard title="Crisis Support" description="If you are in a crisis or need immediate support, please use these resources. You are not alone." icon={<AlertTriangleIcon className="w-7 h-7 text-red-500" />} view="crisis-support" onNavigate={onNavigate} />
                </div>
            </section>
        </div>
    </div>
);

const UnderstandingCBTView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="animate-fade-in-up">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-4"><ArrowLeftIcon className="w-5 h-5" />Back to Resources</button>
        <Card>
            <CardHeader><CardTitle className="flex items-center gap-3"><BrainCircuitIcon className="w-8 h-8 text-primary-500" />Understanding Cognitive Behavioral Therapy (CBT)</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>Cognitive Behavioral Therapy (CBT) is a type of psychotherapy that helps people learn how to identify and change destructive or disturbing thought patterns that have a negative influence on behavior and emotions.</p>
                <p>The core idea behind CBT is that our thoughts, feelings, and behaviors are interconnected. By changing one of these, we can change the others.</p>
                <h4>The CBT Model (The Cognitive Triangle)</h4>
                <div className="text-center my-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="font-bold">Thoughts</p>
                    <p className="text-2xl">↓ 相互 ↑</p>
                    <p className="font-bold">Feelings &amp; Emotions</p>
                     <p className="text-2xl">↓ 相互 ↑</p>
                    <p className="font-bold">Behaviors &amp; Actions</p>
                </div>
                <ul>
                    <li><strong>Thoughts:</strong> What we think affects how we feel and act. This includes automatic thoughts, beliefs, and interpretations of events. The "Thought Record" tool in this app is designed to help you examine these.</li>
                    <li><strong>Feelings:</strong> Our emotions are influenced by our thoughts. If we interpret a situation negatively, we might feel sad or anxious.</li>
                    <li><strong>Behaviors:</strong> How we act is connected to our thoughts and feelings. If we feel anxious, we might avoid certain situations. This avoidance can reinforce the negative thought patterns.</li>
                </ul>
                <p>By using tools like the Thought Record, you can begin to notice your automatic negative thoughts, evaluate the evidence for and against them, and develop more balanced and helpful perspectives. This process can lead to more positive feelings and more effective behaviors.</p>
            </CardContent>
        </Card>
    </div>
);

const CrisisSupportView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="animate-fade-in-up">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline mb-4"><ArrowLeftIcon className="w-5 h-5" />Back to Resources</button>
        <Card className="border-2 border-red-500">
            <CardHeader><CardTitle className="flex items-center gap-3 text-red-600 dark:text-red-400"><AlertTriangleIcon className="w-8 h-8"/>Immediate Support</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p>If you are in a crisis, feeling suicidal, or need immediate support, please reach out to a professional. Help is available 24/7. You are not alone.</p>
                <h4>Emergency Hotlines:</h4>
                 <ul>
                    <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 anytime in the US and Canada.</li>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741.</li>
                    <li><strong>The Trevor Project:</strong> 1-866-488-7386 (for LGBTQ youth).</li>
                    <li><strong>Emergency Services:</strong> Call 911 or your local emergency number.</li>
                </ul>
                <p className="mt-6 text-sm">The content in this app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            </CardContent>
        </Card>
    </div>
);

const ResourcesPage: React.FC = () => {
  const [view, setView] = useState<View>('hub');
  const { isMechanismAdded, addMechanism, removeMechanism } = useCopingMechanisms();
  const { strengths, toggleStrength } = useStrengths();

  const handleNavigate = useCallback((newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  }, []);

  const handleToggleCopingMechanism = useCallback((strategy: CopingMechanism) => {
    if (isMechanismAdded(strategy.id)) {
        removeMechanism(strategy.id);
    } else {
        addMechanism(strategy);
    }
  }, [isMechanismAdded, addMechanism, removeMechanism]);
  
  const renderView = () => {
    switch(view) {
        case 'understanding-cbt':
            return <UnderstandingCBTView onBack={() => handleNavigate('hub')} />;
        case 'crisis-support':
            return <CrisisSupportView onBack={() => handleNavigate('hub')} />;
        case 'hub':
        default:
            return <HubView 
                onNavigate={handleNavigate} 
                isMechanismAdded={isMechanismAdded} 
                toggleCopingMechanism={handleToggleCopingMechanism}
                strengths={strengths}
                toggleStrength={toggleStrength}
            />;
    }
  }

  return (
    <div className="space-y-6">
        <header>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
                <LifeBuoyIcon className="w-8 h-8 text-primary-500" />
                Resources
            </h1>
        </header>
        <main>
            {renderView()}
        </main>
        <footer className="text-xs text-center text-gray-500 dark:text-gray-400 pt-4">
            The content in this app is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
        </footer>
    </div>
  );
};

export default ResourcesPage;
