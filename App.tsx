

import React, { useState, useEffect } from 'react';
import { routes } from './routing';
import Layout from './components/layout/Layout';
import OnboardingPage from './pages/OnboardingPage';
import { APP_INITIALIZED_KEY } from './constants';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(localStorage.getItem(APP_INITIALIZED_KEY) === 'true');
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/dashboard');

  useEffect(() => {
    // Register the service worker for PWA functionality.
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }

    const handleHashChange = () => {
      const newPath = window.location.hash || '#/dashboard';
      console.log(`Hash changed to: ${newPath}`);
      setCurrentPath(newPath);
    };
    
    // Set initial path
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const handleOnboardingComplete = () => {
    localStorage.setItem(APP_INITIALIZED_KEY, 'true');
    setIsInitialized(true);
    window.location.hash = '#/dashboard';
    setCurrentPath('#/dashboard');
  };

  if (!isInitialized) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  const route = routes.find(r => r.path === currentPath);
  const PageComponent = route ? route.component : routes.find(r => r.path === '#/dashboard')!.component;

  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
};

export default App;