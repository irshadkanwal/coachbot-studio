import { Suspense } from 'react';

import { getCannySSOToken } from '@/server/actions/authActions';
import Feedback from '../_components/FeedbackList';
import Loader from './loading';

export default async function FeedbackPage() {
  return (
    <div className="w-max min-w-[75%] self-center rounded-lg bg-white/[80%] p-5 backdrop-blur-xl [&>*:first-child]:!min-h-[83dvh]">
      <Suspense fallback={<Loader />}>
        <Feedback ssoToken$={getCannySSOToken()} boardToken={process.env.CANNY_BOARD_TOKEN || ''} />
      </Suspense>
    </div>
  );
}
