import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  alerts: [],
  setUser: (user) => set({ user }),
  addAlert: (alert) => set((state) => ({ 
    alerts: [...state.alerts, { ...alert, id: Date.now() }] 
  })),
  removeAlert: (id) => set((state) => ({ 
    alerts: state.alerts.filter((a) => a.id !== id) 
  })),
}));

export default useStore;
