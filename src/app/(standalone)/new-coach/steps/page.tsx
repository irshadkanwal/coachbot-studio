'use client';

import StepsWrapper from '../_components/layout/StepsWrapper';
import { NewCoachContextProvider } from '../_components/steps/NewCoachContext';

export default function NewCoach() {
  return (
    <div className="pb-32">
      <NewCoachContextProvider>
        <StepsWrapper />
      </NewCoachContextProvider>
    </div>
  );
}
