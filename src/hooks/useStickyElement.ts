import { useEffect } from 'react';

export const useStickyElement = (id: string) => {
  useEffect(() => {
    const element = document.getElementById(id);
    if (element !== null) {
      element.style.top = `${element.getBoundingClientRect().top + window.scrollY / 2}px`;
    }
  });
};
