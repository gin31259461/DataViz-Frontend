import { create } from 'zustand';

interface UserState {
  mid: number;
}

export const useUserStore = create<UserState>()(() => ({
  mid: 2,
}));
