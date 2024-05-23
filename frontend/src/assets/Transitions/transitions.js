//Potential transitions 
  const Potential = 
  [

    {
      initial: { scale: 0, rotate: -180 }, //Rotating Screen
      animate: { scale: 1, rotate: 0, transition: { type: 'spring', damping: 10, stiffness: 100, duration: 1.5 } },
      exit: { scale: 0, rotate: 180, transition: { type: 'spring', damping: 10, stiffness: 100, duration: 1.5 } },
    },

    {
      initial: { scale: 0.5, rotate: -45, opacity: 0, background: '#SomeColor' }, //Caleidoscope
      animate: { scale: 1, rotate: 0, opacity: 1, background: '#SomeColor', transition: { duration: 1.5, ease: 'easeInOut' } },
      exit: { scale: 1.5, rotate: 45, opacity: 0, background: '#SomeColor', transition: { duration: 1.5, ease: 'easeInOut' } },
    },

  ]

//Currently used Transitions

export const transitionVariants = 
[
  
  {
    initial: { opacity: 0, scale: 0.95, y: 20, },  //Slide through page
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: .8, ease: 'easeIn' } },
  },

  {
    initial: { opacity: 0, y: 30 }, //Fade Up with wiggle
    animate: { opacity: 1,y: 0, transition: { type: 'spring', damping: 20, stiffness: 100, duration: .5 } },
    exit: { opacity: 0, y: -30, transition:  { type: 'spring', damping: 20, stiffness: 100, duration: .5 } },
  },

  {
    initial: { opacity: 0, scale: 0.8 },  // Scale from smaller to larger
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } },
  },

  {
    initial: { opacity: 0, y: 100 },  // Slide from the bottom
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -100, transition: { duration: 0.5 } },
  },

  {
    initial: { opacity: 0, scale: 1.2 },  // Scale from larger to smaller
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.2, transition: { duration: 0.5 } },
  },

  {
    initial: { opacity: 0, x: 100 },  // Slide from the right
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
  },

  {
    initial: { opacity: 0, y: -100 },  // Slide from the top
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 100, transition: { duration: 0.5 } },
  },

  {
    initial: { opacity: 0, scale: 0.5 },  // Scale from much smaller
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.5 } },
  },

  {
    initial: { opacity: 0, scale: 1.5 },  // Scale down from larger
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 1.5, transition: { duration: 0.5 } },
  },

];

  
  