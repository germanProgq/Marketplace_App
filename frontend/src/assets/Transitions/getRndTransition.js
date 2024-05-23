import {transitionVariants} from './transitions'
export const getRandomTransition = () => {
    const randomIndex = Math.floor(Math.random() * transitionVariants.length);
    return transitionVariants[randomIndex];
  };