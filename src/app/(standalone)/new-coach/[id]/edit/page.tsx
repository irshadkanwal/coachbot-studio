import { notFound } from 'next/navigation';

import StepsWrapper from '../../_components/layout/StepsWrapper';
import { StepConfigType } from '../../_components/steps/config';
import { CoachDataType, NewCoachContextProvider } from '../../_components/steps/NewCoachContext';
import { getCoachAction } from '../../../../../server/actions/coachActions';

export default async function CoachEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const coach = await getCoachAction(id);

  if (!coach) {
    return notFound();
  }

  return (
    <div className="pb-32">
      <NewCoachContextProvider
        coachID={id}
        coachData={coach.assessment as CoachDataType}
        type={StepConfigType.EditCoach}
      >
        <StepsWrapper type={StepConfigType.EditCoach} />
      </NewCoachContextProvider>
    </div>
  );
}
