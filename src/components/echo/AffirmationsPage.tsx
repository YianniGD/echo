'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ActionButton from '@/components/echo/ActionButton';
import { Sunrise, RefreshCw, Heart } from 'lucide-react';
import LoadingSpinner from '@/components/echo/LoadingSpinner';
import { ProfileData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const affirmationsList: string[] = [
  "I am capable and strong, and I face challenges with courage.",
  "I choose to be happy and grateful today, embracing all life offers.",
  "I am worthy of love, respect, and all good things life brings.",
  "I embrace challenges as opportunities for profound growth and learning.",
  "I am resilient and can overcome any obstacle with grace and determination.",
  "I trust in my unique abilities and listen to my inner wisdom.",
  "I attract positivity, abundance, and joy into my life effortlessly.",
  "I am at peace with who I am, and I celebrate my journey.",
  "I make a positive and meaningful impact on the world around me.",
  "Every day is a new beginning, filled with endless potential and hope.",
  "I am surrounded by love, support, and understanding.",
  "I believe deeply in myself and my dreams, and I pursue them with passion.",
  "I forgive myself and others, releasing the past and embracing the present.",
  "I am a creative and resourceful being, capable of finding solutions.",
  "I radiate confidence, self-assurance, and inner calm.",
  "My body is healthy, my mind is brilliant, my soul is tranquil.",
  "I am creating the life of my dreams, one step at a time.",
  "I have the power to create change and make a difference.",
  "I am grateful for all the blessings in my life, big and small.",
  "I release all doubts and fears, and I step into my power.",
  "Embracing support empowers me; seeking help is a testament to my strength and awareness.",
  "Flexibility is my superpower; changing my mind is a sign of growth, not weakness.",
  "Every choice I make is grounded in my rich and undeniable personal journey.",
  "I uplift others with the same encouragement and affirmation I offer myself.",
  "My authentic self is a truth only I can define and embody.",
  "I am fully entitled to voice my desires and needs.",
  "Joy is my birthright; I allow myself to feel good and embrace happiness.",
  "I possess the innate ability to harmonize ease and effort within my life's rhythm.",
  "I am whole and complete in this moment; others enhance my journey, they do not define it.",
  "A sense of peace and freedom from suffering fills me.",
  "I am engaged in fulfilling work that aligns with my purpose and well-being.",
  "I am inherently good, and I am continuously evolving for the better.",
  "My growth journey is unique, and I am progressing at my perfect pace.",
  "I am cradled and sustained by the love of those around me.",
  "My emotional state is within my control; I consciously choose happiness.",
  "I am receptive and open to the profound messages the universe unfolds for me daily.",
  "I am cherished and inherently worthy of all good things.",
  "My potential transcends any current circumstances.",
  "I am open and welcoming to the process of healing and restoration.",
  "Optimism guides me, for each day presents a fresh beginning and new possibilities.",
  "I reside in a state of inner peace and completeness.",
  "My very existence is evidence of who I am and what I deserve.",
  "My responsibility begins with myself, and I build my strength from that foundation.",
  "I am secure and enveloped by a network of love and unwavering support.",
  "Learning is a lifelong journey, and making mistakes is an integral, acceptable part of it.",
  "My voice is heard, and my unique perspective holds significant value.",
  "I am a valuable contributor and an appreciated presence.",
  "I am well-rested, energized, and enthusiastic for the day ahead.",
  "I am deserving of self-investment, knowing it yields abundant returns.",
  "I belong exactly where I am, and I have every right to occupy my space fully.",
  "With each breath, I inhale healing energy, releasing all burdens and sorrows from my heart.",
  "I breathe in unwavering trust and exhale all traces of doubt.",
  "My heart can be tender and compassionate, while my boundaries remain strong and clear.",
  "I have the power to consciously choose my response to challenging situations.",
  "Holding contrasting emotions simultaneously is a sign of deep processing and growth.",
  "I joyfully acknowledge and celebrate the good within myself and in others.",
  "I am worthy of respectful physical connection, on my own terms.",
  "I deserve access to information, and equally, moments of peaceful silence.",
  "Self-respect is my due, and I thrive in a clean and organized environment.",
  "Love is the guiding principle behind all my actions.",
  "I do not have to remain in challenging places; assistance and light are always available to me.",
  "I live authentically, presenting only my true self to the world.",
  "My worth is intrinsic; I do not depend on others to define or elevate me.",
  "I move through life with mindful intention, balancing activity with moments of serene stillness.",
  "I embrace change gracefully, seeing each shift as a fresh opportunity for growth.",
  "I nurture myself with empowering words and nourishing, joyful foods.",
  "I welcome the mysteries in my heart, trusting that answers will unfold at the perfect time.",
  "I naturally gravitate towards what inspires me, like a plant reaching for life-giving sunlight.",
  "I have journeyed further than I ever imagined, learning and evolving with every step.",
  "I possess all the necessary resources and inner strength for success.",
  "I contribute to my community and receive steadfast support from it in return.",
  "My intuition holds a profound wisdom that transcends mere knowledge.",
  "I open my life to abundance and cultivate a generous spirit.",
  "I invite artistic expression and harmonious music to enrich my daily existence.",
  "I create space in my life for delightful spontaneity and unexpected adventures.",
  "I release attachment to what is unattainable, freeing my energy for what is truly meant for me.",
  "I anticipate tomorrow with excitement, eager for the opportunities it holds.",
  "I revel in my passions and celebrate the things that bring me joy.",
  "My decisions are guided by my inner wisdom, and my growth prompts necessary adjustments.",
  "I dedicate time to fully experience grief and sadness when they arise, allowing for natural processing.",
  "I nourish my being with kind words and wholesome, joyful foods.",
  "I practice deep gratitude for all that I possess and all that is yet to manifest.",
  "I release any fears that no longer serve my highest good.",
  "I honor and respect the natural rhythms and cycles of life's seasons.",
  "I actively seek out the magic and wonder hidden within everyday moments.",
  "My aim is authentic joy, not an unattainable perfection.",
  "I welcome the profound wisdom that accompanies the journey of aging.",
  "I communicate my true self and my needs to others with honesty and clarity.",
  "I elevate my own joy and contribute to the happiness of those around me.",
  "I embrace the wisdom that comes with the passage of time and experience.",
  "I greet what is present and welcome what is yet to come with an open heart.",
  "I grant myself permission to continuously grow and transform.",
  "Releasing what no longer serves me creates fertile ground for new opportunities to flourish.",
  "My body is a beautiful and worthy vessel in this very moment, at its current form.",
  "My body deserves devoted care and the adornment of garments that make me feel beautiful.",
  "My emotions deserve to be identified, acknowledged, and fully experienced.",
  "My heart is open to receiving support and helpfulness, both from myself and from others.",
  "My heart possesses its own infallible compass, guiding me true.",
  "My life is a unique journey, not a competition or a race against anyone else.",
  "My viewpoint is singular and holds immense significance.",
  "My happiness does not depend on, nor should it ever cause, another's suffering.",
  "My sensitivity is a beautiful facet of who I am, and all my feelings and emotions are valid.",
  "My unique quirks and eccentricities are wonderfully part of me.",
  "The act of saying \"no\" is a powerful affirmation of my self-worth and boundaries.",
  "Rest is productive work; sometimes the greatest progress comes from stillness.",
  "Profound growth can be found in moments of quiet reflection and stillness.",
  "There is peace and integrity in altering my perspective when motivated by love.",
  "I discover poetry and beauty in every aspect of life, if I only choose to look for it.",
  "There is a rightful place for me at every table; I am deserving of inclusion.",
  "There is a singular contribution only I can offer to the world; this is my purpose for being here.",
  "There is immense power in quiet strength, and vulnerability in speaking loudly.",
  "Today, I celebrate the vitality of being younger than I will ever be again.",
  "Each new day is a precious chance to grow, learn, and expand.",
  "When fear arises, I consciously choose to feed my trust instead.",
  "When I align with my deepest purpose, I become infinitely courageous.",
  "Forgiving myself is the ultimate act of liberation.",
  "Releasing shame allows me to step more fully and beautifully into my true self.",
  "As I connect with the earth, it reciprocates by rising to support me.",
  "When I clearly articulate my needs, they are met abundantly.",
  "By treating myself with the kindness and understanding I'd offer a friend, I illuminate my best qualities and allow my true radiance to shine.",
  "While words can influence me, they do not define my essence; I already exist, whole and complete.",
  "I embrace imperfections as unique textures in the masterpiece of my life.",
  "My intuition is a trusted guide, leading me toward my highest good.",
  "I am capable of navigating challenges with grace and resilience.",
  "Every step I take is a step towards my authentic self.",
  "I create my own opportunities through my dedication and passion.",
  "My creativity flows freely, manifesting beauty in all I do.",
  "I am a powerful creator of my reality, shaping my world with intention.",
  "Inspiration finds me in unexpected places, fueling my creative spirit.",
  "I trust my artistic vision and bring it to life with confidence.",
  "My designs tell a story, and I am the master storyteller.",
  "I learn from every project, refining my craft with each new challenge.",
  "My work brings joy and value to others, reflecting my unique perspective.",
  "I am an endless source of innovative ideas and fresh perspectives.",
  "I celebrate my progress, no matter how small, knowing it leads to great achievements."
];

interface AffirmationsPageProps {
  profileData: ProfileData;
  onUpdateProfile: (newProfileData: ProfileData) => void;
}

const AffirmationsPage: React.FC<AffirmationsPageProps> = ({ profileData, onUpdateProfile }) => {
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial random affirmation only on the client-side to prevent hydration mismatch
    setCurrentAffirmationIndex(Math.floor(Math.random() * affirmationsList.length));
  }, []);


  const showNewAffirmation = useCallback(() => {
    if (currentAffirmationIndex === null) return;
    setCurrentAffirmationIndex(prevIndex => {
      let newIndex = prevIndex;
      while (newIndex === prevIndex) { // Ensure new affirmation is different
        newIndex = Math.floor(Math.random() * affirmationsList.length);
      }
      return newIndex;
    });
  }, [currentAffirmationIndex]);

  const currentAffirmation = useMemo(() => {
    if (currentAffirmationIndex === null) {
      return null;
    }
    return affirmationsList[currentAffirmationIndex];
  }, [currentAffirmationIndex]);

  const isFavorited = useMemo(() => {
    if (!currentAffirmation || !profileData.favoriteAffirmations) return false;
    return profileData.favoriteAffirmations.includes(currentAffirmation);
  }, [currentAffirmation, profileData.favoriteAffirmations]);

  const handleToggleFavorite = () => {
    if (!currentAffirmation) return;
    const currentFavorites = profileData.favoriteAffirmations || [];
    let newFavorites: string[];
    if (isFavorited) {
      newFavorites = currentFavorites.filter(fav => fav !== currentAffirmation);
      toast({ title: "Removed from Favorites" });
    } else {
      newFavorites = [...currentFavorites, currentAffirmation];
      toast({ title: "Added to Favorites!" });
    }
    onUpdateProfile({ ...profileData, favoriteAffirmations: newFavorites });
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 animate-in fade-in-0 duration-1000">
      <div className="text-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-primary-container via-secondary-container/30 to-tertiary-container/20 rounded-3xl shadow-2xl max-w-2xl w-full transform transition-all hover:scale-[1.01] duration-500">
        <div className="flex flex-col items-center mb-6">
          <Sunrise className="w-16 h-16 text-primary mb-3" />
          <h2 className="font-serif text-headline-lg text-on-primary-container">
            Your Daily Affirmation
          </h2>
          <p className="text-body-lg text-on-primary-container/80 mt-1">
            Embrace positivity and empower your day.
          </p>
        </div>

        <div 
          className="my-10 p-6 bg-surface/80 rounded-2xl min-h-[150px] flex items-center justify-center"
          role="region"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentAffirmation ? (
            <p className="font-serif text-headline-md sm:text-display-sm text-surface-on leading-tight">
              "{currentAffirmation}"
            </p>
          ) : (
             <div className="flex flex-col items-center justify-center text-surface-on-variant">
                <LoadingSpinner className="w-8 h-8 text-primary"/>
                <p className="mt-2 text-sm">Finding your inspiration...</p>
             </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <ActionButton
                onClick={showNewAffirmation}
                variant="filled"
                size="lg"
                leadingIcon={<RefreshCw />}
                aria-label="Show another affirmation"
                disabled={currentAffirmation === null}
            >
                Show Another
            </ActionButton>
            <ActionButton
                variant="tonal"
                size="lg"
                leadingIcon={<Heart className={isFavorited ? 'fill-current' : ''} />}
                onClick={handleToggleFavorite}
                disabled={currentAffirmation === null}
                aria-label={isFavorited ? 'Remove from favorites' : 'Favorite this affirmation'}
            >
                {isFavorited ? 'Favorited' : 'Favorite'}
            </ActionButton> 
        </div>
      </div>
    </div>
  );
};

export default AffirmationsPage;
