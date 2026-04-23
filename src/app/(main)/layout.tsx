import { ReactNode } from 'react';
import { NextStepProvider } from 'nextstepjs';

import { AsideContextProvider } from '@/contexts/AsideContext';
import { RootContextProvider } from '@/contexts/RootContextProvider';
import { getAssistants, getCurrentAssistant } from '@/server/actions/assistantActions';
import { getFirstStage } from '@/server/actions/instructionsActions';
import { getUser } from '@/server/actions/userActions';
import { MainLayout } from '@/shared/Layout';
import OnboardingTour from '@/shared/onboarding/OnboardingTour';

export default async function Layout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const assistantId = await getCurrentAssistant();

  return (
    <RootContextProvider
      firstStage$={getFirstStage()}
      assistants$={getAssistants()}
      user$={getUser()}
      sessionAssistantId={assistantId}
    >
      <AsideContextProvider isOpen={false}>
        <MainLayout sidebarContent={sidebar}>{children}</MainLayout>
        <NextStepProvider>
          <OnboardingTour user$={getUser()} />
        </NextStepProvider>
      </AsideContextProvider>
    </RootContextProvider>
  );
}
