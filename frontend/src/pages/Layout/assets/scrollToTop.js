import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Component to automatically scroll to the top on route changes
const ScrollToTop = () => {
  const location = useLocation(); // Gets the current route location

  useEffect(() => {
    // Scroll to the top when the location changes
    window.scrollTo(0, 0);
  }, [location]); // Dependency array ensures this effect runs on location change

  return null; // No rendering; this component only affects side-effects
};

export default ScrollToTop;
