import { useCallback } from 'react';

export const useSound = (soundPath, volume = 0.2) => {
  const play = useCallback(() => {
    try {
      const audio = new Audio(soundPath);
      audio.volume = volume;
      
      // We wrap in a promise to catch the "Autoplay prevented" error gracefully
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Normal behavior: Browsers block audio until the user interacts with the page
        });
      }
    } catch (e) {
      console.error("Failed to play sound", e);
    }
  }, [soundPath, volume]);
  
  return play;
};
