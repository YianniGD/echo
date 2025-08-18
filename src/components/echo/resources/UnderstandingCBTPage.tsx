
'use client';
import React from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { BrainCircuit, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


interface UnderstandingCBTPageProps {
    onNavigateBack: () => void;
}

const UnderstandingCBTPage: React.FC<UnderstandingCBTPageProps> = ({ onNavigateBack }) => {
    return (
        <div className="space-y-8 animate-in fade-in-0 duration-750 max-w-3xl w-full">
            <ActionButton onClick={onNavigateBack} variant="text" size="sm" leadingIcon={<ArrowLeft />} className="mb-4">
                Back to Resources
            </ActionButton>
            
            <div className="flex items-center space-x-3">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <h2 className="font-serif text-headline-lg text-surface-on">Understanding CBT</h2>
            </div>
            
            <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                <CardHeader>
                    <CardTitle className="font-serif text-title-lg text-surface-on">The Cognitive Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-body-md text-surface-on-variant">Cognitive behavioral therapy (usually referred to as “CBT”) is based upon the idea that how you think determines how you feel and how you behave.</p>
                    <div className="text-center font-semibold text-lg text-surface-on">
                        Thoughts → Emotions → Behaviors
                    </div>
                    <div className="space-y-2 text-body-md text-surface-on-variant">
                        <p><strong>1. Something happens.</strong> It could be anything.</p>
                        <p><strong>2. You have thoughts</strong> about what has just occurred.</p>
                        <p><strong>3. You experience emotions</strong> based upon your thoughts.</p>
                        <p><strong>4. You respond</strong> to your thoughts and feelings with behaviors.</p>
                    </div>

                    <div className="bg-surface p-4 rounded-lg border border-outline-variant">
                        <h4 className="font-semibold text-surface-on mb-2">Example:</h4>
                        <p className="text-surface-on-variant"><strong>Situation:</strong> A stranger scowls at you while passing you on the street.</p>
                        <p className="text-surface-on-variant"><strong>You think:</strong> “I must’ve done something wrong… I’m so awkward.”</p>
                        <p className="text-surface-on-variant"><strong>You feel:</strong> Embarrassed and upset with yourself.</p>
                        <p className="text-surface-on-variant"><strong>Your behavior:</strong> You apologize to the stranger and replay the situation over and over in your head.</p>
                    </div>

                    <p className="text-body-md text-surface-on-variant">
                        The stranger could’ve been scowling for any number of reasons. Unfortunately, irrational or not, these thoughts still affect how we feel, and how we behave. Consider a different response:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-surface p-4 rounded-lg">
                            <p><strong>Thought:</strong> “What a jerk!”</p>
                            <p><strong>Emotion:</strong> Angry</p>
                            <p><strong>Behavior:</strong> Shouts: “What’s your problem?!”</p>
                        </div>
                        <div className="bg-surface p-4 rounded-lg">
                            <p><strong>Thought:</strong> “He must be having a bad day…”</p>
                            <p><strong>Emotion:</strong> Neutral</p>
                            <p><strong>Behavior:</strong> Walks away and forgets the incident.</p>
                        </div>
                    </div>
                    
                    <p className="text-body-md text-surface-on-variant !mt-6">
                       Using the cognitive model, you will learn to identify your own patterns of thoughts, emotions, and behaviors. Once you become aware of your own irrational thoughts, you will learn to change them.
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                <CardHeader>
                    <CardTitle className="font-serif text-title-lg text-surface-on">Thinking Errors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="p-3 bg-surface rounded-lg">
                        <h4 className="font-semibold text-primary">Ignoring the Good</h4>
                        <p className="text-sm text-surface-on-variant">You pay more attention to bad things, and ignore when something good happens.</p>
                    </div>
                     <div className="p-3 bg-surface rounded-lg">
                        <h4 className="font-semibold text-primary">Blowing Things Up</h4>
                        <p className="text-sm text-surface-on-variant">Making a really big deal out of something small, or making something a little bit bad seem like the worst thing ever.</p>
                    </div>
                     <div className="p-3 bg-surface rounded-lg">
                        <h4 className="font-semibold text-primary">Fortune Telling</h4>
                        <p className="text-sm text-surface-on-variant">Thinking you know what will happen in the future, and that it will be bad.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                <CardHeader>
                    <CardTitle className="font-serif text-title-lg text-surface-on">Core Beliefs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-body-md text-surface-on-variant">
                        Core beliefs are the deeply held beliefs that influence how we interpret our experiences. Think of core beliefs like a pair of sunglasses. Everyone has a different “shade” that causes them to see things differently.
                    </p>
                    <div className="my-4 flex flex-col md:flex-row items-center justify-center gap-2 text-center">
                        <div className="p-3 bg-surface rounded-lg"><strong>Situation</strong></div>
                        <div className="text-primary font-bold text-2xl">→</div>
                         <div className="p-3 bg-surface rounded-lg"><strong>Core Belief</strong></div>
                        <div className="text-primary font-bold text-2xl">→</div>
                         <div className="p-3 bg-surface rounded-lg"><strong>Consequence</strong></div>
                    </div>
                    <p className="text-body-md text-surface-on-variant">
                        Many people have negative core beliefs that cause harmful consequences. To begin challenging them, you first need to identify them. Here are some common examples:
                    </p>
                    <div className="columns-2 sm:columns-3 gap-4 text-sm text-surface-on-variant bg-surface p-4 rounded-lg">
                        <ul className="list-disc list-inside space-y-1">
                            <li>I’m unlovable</li>
                            <li>I’m Stupid</li>
                            <li>I’m boring</li>
                            <li>I’m not good enough</li>
                            <li>I’m ugly</li>
                            <li>I’m worthless</li>
                            <li>I’m a bad person</li>
                            <li>I’m abnormal</li>
                            <li>I’m undeserving</li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-surface-on">What is one of your negative beliefs?</h4>
                        <p className="text-sm text-surface-on-variant mb-2">List three pieces of evidence contrary to your negative core belief:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-5">
                            <li>__________________________________</li>
                            <li>__________________________________</li>
                            <li>__________________________________</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-surface-container-low shadow-sm border-outline-variant">
                <CardHeader>
                    <CardTitle className="font-serif text-title-lg text-surface-on">DEAR MAN: Effective Communication</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-body-md text-surface-on-variant mb-4">
                        The acronym DEAR MAN outlines a strategy for communicating effectively to express your wants and needs respectfully.
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        <AccordionItem value="d" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">D - Describe</AccordionTrigger><AccordionContent className="px-4 pb-4">Clearly and concisely describe the facts of the situation, without any judgment. <br/><em>e.g., “You have asked me to work late 3 days this week.”</em></AccordionContent></AccordionItem>
                        <AccordionItem value="e" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">E - Express</AccordionTrigger><AccordionContent className="px-4 pb-4">Use “I” statements to express your emotions. <br/><em>e.g., “I feel overwhelmed by the extra work I’ve been given.”</em></AccordionContent></AccordionItem>
                        <AccordionItem value="a1" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">A - Assert</AccordionTrigger><AccordionContent className="px-4 pb-4">Clearly state what you want or need. Be specific. <br/><em>e.g., “I need to resume my regular 40-hour work week.”</em></AccordionContent></AccordionItem>
                        <AccordionItem value="r" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">R - Reinforce</AccordionTrigger><AccordionContent className="px-4 pb-4">Reward the other person if they respond well to you. Smiling, saying “thank you”, and other kind gestures work well.</AccordionContent></AccordionItem>
                        <AccordionItem value="m" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">M - Mindfulness</AccordionTrigger><AccordionContent className="px-4 pb-4">Being mindful of your goal means not getting sidetracked by other issues. <br/><em>e.g., “I would like to resolve the overtime issue before talking about the upcoming project.”</em></AccordionContent></AccordionItem>
                        <AccordionItem value="a2" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">A - Appear confident</AccordionTrigger><AccordionContent className="px-4 pb-4">Use body language to show confidence, even if you don’t feel it. Stand up straight, make appropriate eye contact, and speak clearly.</AccordionContent></AccordionItem>
                         <AccordionItem value="n" className="bg-surface rounded-lg"><AccordionTrigger className="p-4 text-left font-semibold text-primary">N - Negotiate</AccordionTrigger><AccordionContent className="px-4 pb-4">Know the limits of what you are willing to accept, but be willing to compromise within them. <br/><em>e.g., “I’ll finish the extra work this week, but I won’t be able to manage the same amount of work next week.”</em></AccordionContent></AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};

export default UnderstandingCBTPage;
