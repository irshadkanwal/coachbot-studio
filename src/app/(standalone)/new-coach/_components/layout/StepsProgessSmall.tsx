interface Props {
  totalSteps: number;
  currentStep: number;
}

export const StepsProgressSmall: React.FC<Props> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-x-4">
      <div className="flex gap-x-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === currentStep ? 'bg-dark-aquamarine' : 'bg-gray-400/50'}`}
          />
        ))}
      </div>
      <span className="text-sm text-main">
        {currentStep + 1}/{totalSteps}
      </span>
    </div>
  );
};
