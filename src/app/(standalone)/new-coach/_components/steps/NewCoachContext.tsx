'use client';

import { createContext, useContext, useState } from 'react';

import { StepConfigType } from './config';

export type CoachDataType = Record<string, string | Record<string, string>>;

interface NewCoachContextType {
  coachID?: string;
  coachData: CoachDataType;
  setCoachInfo: (key: string | string[], value: string) => void;
  type?: StepConfigType;
}

const NewCoachContext = createContext<NewCoachContextType | undefined>(undefined);

export function useNewCoachContext() {
  const context = useContext(NewCoachContext);

  if (context === undefined) {
    throw new Error('useNewCoachContext must be used within a NewCoachContextProvider');
  }

  return context;
}

export const NewCoachContextProvider = ({
  children,
  coachData: initialCoachData,
  coachID: initialCoachID,
  type = StepConfigType.NewCoach,
}: {
  children: React.ReactNode;
  coachData?: CoachDataType;
  coachID?: string;
  type?: StepConfigType;
}) => {
  const [coachID] = useState<string | undefined>(initialCoachID);
  const [coachData, setCoachData] = useState<CoachDataType>(initialCoachData || {});

  const setCoachInfo = (key: string | string[], value: string) => {
    setCoachData((prev) => {
      if (Array.isArray(key)) {
        const [parent, child] = key;

        if (prev[parent]) {
          (prev[parent] as CoachDataType)[child] = value;
        } else {
          prev[parent] = { [child]: value };
        }

        return prev;
      } else {
        return { ...prev, [key]: value };
      }
    });
  };

  return (
    <NewCoachContext.Provider value={{ coachID, coachData, setCoachInfo, type }}>{children}</NewCoachContext.Provider>
  );
};
