import { createContext, useState, useMemo } from 'react';

export const userContext = createContext({
  setUser: (mid: number) => {},
  getUser: () => {
    let mid: number = 0;
    return mid;
  },
});

export const useUser = () => {
  const [mid, setMID] = useState<number>(3);
  const controlUser = useMemo(() => {
    return {
      setUser: (mid: number) => {
        setMID(mid);
      },
      getUser: () => {
        return mid;
      },
    };
  }, [mid]);
  return [controlUser];
};
