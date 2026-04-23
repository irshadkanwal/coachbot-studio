'use client';

import React, { use, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { NextStep, useNextStep } from 'nextstepjs';

import { Theme, useTheme } from '@/contexts/ThemeContext';
import { User } from '@/lib/models/common.models';
import { updateUserData } from '@/server/actions/userActions';
import { OnboardingCard } from './OnboardingCard';
import { getSteps } from './OnboardingSteps';

const OVERLAY_COLOR = {
  [Theme.LIGHT]: '255,255,255',
  [Theme.DARK]: '4,0,20',
} as const;

export default function OnboardingTour({ user$ }: { user$: Promise<User | null> }) {
  const user = use(user$);
  const t = useTranslations();
  const { theme } = useTheme();
  const { startNextStep } = useNextStep();

  useEffect(() => {
    if (!user || user.onboardingPassed) return;
    startNextStep('mainTour');
  }, []);

  const handleOnboardingPassed = async () => {
    await updateUserData({ onboardingPassed: true });
  };

  return (
    <NextStep
      steps={getSteps(theme, t)}
      showNextStep={true}
      cardTransition={{
        ease: 'easeInOut',
        duration: 0.4,
        stiffness: 100,
        damping: 10,
      }}
      shadowRgb={OVERLAY_COLOR[theme]}
      shadowOpacity="0.7"
      cardComponent={OnboardingCard}
      onComplete={handleOnboardingPassed}
      onSkip={handleOnboardingPassed}
      clickThroughOverlay={false}
    >
      <p></p>
    </NextStep>
  );
}
