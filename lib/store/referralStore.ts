import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ReferralState {
  hasCoupon: boolean;
  referralCode: string;

  // Actions
  setHasCoupon: (value: boolean) => void;
  setReferralCode: (code: string) => void;
  clearReferral: () => void;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
      hasCoupon: false,
      referralCode: '',

      setHasCoupon: (value: boolean) => set({ hasCoupon: value }),
      setReferralCode: (code: string) => set({ referralCode: code }),
      clearReferral: () => set({ hasCoupon: false, referralCode: '' }),
    }),
    {
      name: 'qoricash-referral-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for temporary state
    }
  )
);
