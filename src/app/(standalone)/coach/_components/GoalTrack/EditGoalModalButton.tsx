'use client';

import { useRef } from 'react';

import { Category, Goal } from '@/lib/models/goal.models';
import { EditModalButton } from '@/shared/ModalButtons';
import AddGoalForm from './AddGoalForm';

const editModalConfig = {
  titleKey: 'CoachDetails.Config.GoalTrackPage.goalsList.editModalTitle',
  buttonIcon: 'cbi-tick-circle-fill text-xl',
  buttonTitleKey: `General.saveButton`,
  variant: 'white',
};

export default function EditGoalModalButton({ categories$, goal }: { goal: Goal; categories$: Promise<Category[]> }) {
  const formRef = useRef<{ submit?: () => Promise<any>; getValues?: () => any }>({});

  return (
    <EditModalButton
      className="cbi-edit-2 p-0 text-storm-gray hover:text-main"
      customContent={true}
      config={{
        ...editModalConfig,
        withLoader: false,
        className: 'gap-y-5',
        confirm: async () => {
          if (formRef.current?.submit) {
            await formRef.current.submit();

            return !!formRef.current?.getValues?.().successMessage;
          }
        },
      }}
      initialValue={goal.title}
    >
      <AddGoalForm categories$={categories$} assistantId={goal.assistantId || ''} goal={goal} ref={formRef} />
    </EditModalButton>
  );
}
