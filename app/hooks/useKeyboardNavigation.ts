// hooks/useKeyboardNavigation.ts
import { useEffect } from "react";

const useKeyboardNavigation = (onPrevious: () => void, onNext: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrevious, onNext]);
};

export default useKeyboardNavigation;
