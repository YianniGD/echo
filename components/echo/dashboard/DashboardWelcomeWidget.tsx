'use client';
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Coffee } from 'lucide-react';

const DashboardWelcomeWidget: React.FC = () => {
  const [dynamicContent, setDynamicContent] = useState({
    greeting: "Hello",
    Icon: Coffee,
    formattedDate: "",
  });

  useEffect(() => {
    // This effect runs only on the client side, after the component has mounted.
    const now = new Date();
    
    let greeting = "Hello";
    let Icon = Coffee;
    const hour = now.getHours();

    if (hour < 12) {
      greeting = "Good Morning";
      Icon = Sun;
    } else if (hour < 18) {
      greeting = "Good Afternoon";
      Icon = Coffee;
    } else {
      greeting = "Good Evening";
      Icon = Moon;
    }
    
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    setDynamicContent({ greeting, Icon, formattedDate });
  }, []); // Empty dependency array means this runs once on mount.

  const { greeting, Icon: GreetingIcon, formattedDate } = dynamicContent;

  return (
    <div className="bg-primary-container p-8 rounded-2xl shadow-lg text-on-primary-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-4">
            <GreetingIcon size={48} className="opacity-70 flex-shrink-0" />
            <div>
              <h1 className="font-serif text-headline-md sm:text-headline-lg">{greeting}!</h1>
              <p className="text-title-md sm:text-title-lg opacity-90 min-h-[1.75rem]">{formattedDate}</p>
            </div>
          </div>
          <p className="text-body-lg mt-4 opacity-80 max-w-2xl">Welcome back. Capture your thoughts, organize your day, and reflect on your well-being.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcomeWidget;
