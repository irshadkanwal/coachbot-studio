import { useTranslations } from 'next-intl';

import { Button } from '@/shared/Button';
import { Spinner } from '@/shared/Loaders';

interface Props {
  nextButtonText?: string;
  currentStep: number;
  stepsCount: number;
  loading?: boolean;
  onStepChange?: (step: number) => void;
}

export const StepsNavigation: React.FC<Props> = ({
  nextButtonText,
  currentStep,
  loading,
  stepsCount,
  onStepChange,
}) => {
  const t = useTranslations();

  return (
    <div className="m-auto my-10 flex justify-center gap-x-2">
      {currentStep > 0 && (
        <Button
          onClick={() => onStepChange?.(currentStep - 1)}
          variant="outline"
          type="button"
          color="darkGray"
          disabled={currentStep === 0 || loading}
          className="cbi-arrow-left aspect-square h-12 bg-white/10 text-xl"
        />
      )}
      <Button
        onClick={() => {
          onStepChange?.(currentStep + 1);
        }}
        variant="solid"
        type="submit"
        color="light"
        disabled={loading}
        className={`flex h-12 w-48 items-center gap-x-2 ${
          currentStep === stepsCount - 1 ? 'bg-dark-aquamarine text-main' : ''
        }`}
      >
        {loading && <Spinner />}
        {t(nextButtonText ?? 'NewCoachCreation.steps.common.next')}
        <i className="cbi-arrow-right text-xl" />
      </Button>
    </div>
  );
};
