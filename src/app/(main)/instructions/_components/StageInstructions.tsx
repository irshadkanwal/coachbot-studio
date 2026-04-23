'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { HeapTrackEvent } from '@/lib/models/analytic.models';
import { Stage } from '@/lib/models/instruction.models';
import { heapAnalytics } from '@/lib/services/HeapAnalytics';
import { createStage, deleteStage, updateStage, updateStageOrder } from '@/server/actions/instructionsActions';
import CollapsiblePanel from '@/shared/CollapsiblePanel';
import ConfigurationManager from '@/shared/ConfigurationManager';
import InstructionInput from '@/shared/InstructionInput';

export default function StageInstructions({ stages$ }: { stages$: Promise<Stage[]> }) {
  const t = useTranslations();

  const onStageSubmit = useCallback(async (stage: Stage) => {
    heapAnalytics.trackEvent(HeapTrackEvent.save_stage, { _value: stage.name } as any);

    return updateStage(
      { ...stage, instructions: stage.instructions || '', analyzer: stage.analyzer || undefined },
      false
    );
  }, []);

  return (
    <ConfigurationManager<Stage>
      items$={stages$}
      optonLabelProp="name"
      translationKey="Instructions.Stages"
      titleKey="Instructions.Stages.configurationTitle"
      editableItems={true}
      movableItems={true}
      onCreate={createStage}
      onEdit={async (id: string, name: string) =>
        await updateStage({ id, name: name.replaceAll(' ', '_').toLowerCase() } as Stage, true)
      }
      onMove={updateStageOrder}
      onDelete={deleteStage}
      onSubmit={onStageSubmit}
    >
      {({ register, errors, selectedItem, isLoading }) => (
        <>
          <CollapsiblePanel
            title={t('Instructions.Stages.stageInstructionsLabel')}
            subTitle={t('Instructions.Stages.instructionInputLabel')}
            toggleText={true}
            toggleClass="bg-white/[50%] border border-white/[6%] rounded-xl p-3 rotate-0 group-data-[open]:rotate-180"
            className="border-0 bg-light-gray/[18%] py-4 ps-5 text-sm text-light-gray data-[open]:bg-white/[8%] data-[open]:text-main"
            titleClass="uppercase font-bold"
            contentClassName="border-0 bg-white/[8%] p-3"
          >
            <InstructionInput
              name="instructions"
              className={'min-h-[45svh] shrink-0 flex-grow'}
              isLoading={isLoading}
              initialValue={selectedItem?.instructions || ''}
              id="stage-instructions-input"
              errors={errors}
              required={false}
              register={register}
              onBlur={(instructions: string) => onStageSubmit({ ...selectedItem, instructions })}
            />
          </CollapsiblePanel>

          <CollapsiblePanel
            title={t('Instructions.Stages.analyzeExpandTitle')}
            subTitle={t('Instructions.Stages.analyzeInputLabel')}
            toggleText={true}
            toggleClass="bg-white/[50%] border border-white/[6%] rounded-xl p-3 rotate-0 group-data-[open]:rotate-180"
            className="border-0 bg-light-gray/[18%] py-4 ps-5 text-sm text-light-gray data-[open]:bg-white/[8%] data-[open]:text-main"
            titleClass="uppercase font-bold"
            contentClassName="border-0 bg-white/[8%] p-3"
          >
            <InstructionInput
              name="analyzer"
              className={'min-h-[45svh] shrink-0 flex-grow'}
              initialValue={selectedItem?.analyzer || ''}
              isLoading={isLoading}
              required={false}
              id="stage-anayzer-input"
              labelKey="Instructions.Stages.analyzeLogicLabel"
              errors={errors}
              register={register}
              onBlur={(analyzer: string) => onStageSubmit({ ...selectedItem, analyzer })}
            />
          </CollapsiblePanel>
        </>
      )}
    </ConfigurationManager>
  );
}
