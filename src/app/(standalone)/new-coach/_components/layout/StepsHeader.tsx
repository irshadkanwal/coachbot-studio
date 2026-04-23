import { PrivateRoutes } from '@/lib/constants';
import { Button } from '@/shared/Button';
import { Logo } from '@/shared/Logo';

export const StepsHeader: React.FC = () => {
  return (
    <div className="mb-10 flex w-full items-center justify-center py-6">
      <Button
        href={PrivateRoutes.dashboard}
        variant="solid"
        color="gray"
        className="cbi-close-circle fixed right-6 top-6 aspect-square w-12 shrink-0 px-3 py-0 text-lg text-main"
      />
      <Logo className="mx-auto h-10 w-auto" />
    </div>
  );
};
