import { StepI } from '../../_entity/step';
import { createExamplesList, createField, createFieldTranslationKey, createStep } from '../../_utils/steps';
import { ProfileSettingsDisclaimer } from './coach-profile/Disclaimer';
import { ConfirmStep } from './ConfirmStep';
import { StepProps } from './Step';

export enum StepSlug {
  PurposeIntent = 'purpose-intent',
  AudienceDefinition = 'audience-definition',
  EngagementStyleMethodology = 'engagement-style-methodology',
  CoachbotProfile = 'coachbot-profile',
  ReviewCreate = 'review-create',
  ReviewEdit = 'review-edit',
}

export enum FieldsIDs {
  KeyObjective = 'key-objective',
  TargetAudience = 'target-audience',
  ProfileName = 'name',
  Methodology = 'methodology',
  Tone = 'tone',
  Style = 'style',
  ProfileDescription = 'description',
  ProfileOnboarding = 'onboarding',
  ProfileDataSharing = 'data-sharing',
}

export enum StepConfigType {
  NewCoach = 'new-coach',
  EditCoach = 'edit-coach',
}

export const getStepsConfig = (type: StepConfigType = StepConfigType.NewCoach): StepI[] => {
  return [
    createStep(StepSlug.PurposeIntent, {
      fields: [
        createField(StepSlug.PurposeIntent, FieldsIDs.KeyObjective, {
          examples: createExamplesList(StepSlug.PurposeIntent, FieldsIDs.KeyObjective, [
            'explore-coaching',
            'between-session-guidance',
            'thought-leadership',
          ]),
          description: '',
          hint: createFieldTranslationKey(StepSlug.PurposeIntent, FieldsIDs.KeyObjective, 'hint'),
        }),
      ],
    }),
    createStep(StepSlug.AudienceDefinition, {
      fields: [
        createField(StepSlug.AudienceDefinition, FieldsIDs.TargetAudience, {
          examples: createExamplesList(StepSlug.AudienceDefinition, FieldsIDs.TargetAudience, [
            'startup-founders',
            'hr-leaders',
            'first-time-coaching-clients',
          ]),
          description: '',
          hint: createFieldTranslationKey(StepSlug.AudienceDefinition, FieldsIDs.TargetAudience, 'hint'),
        }),
      ],
    }),
    createStep(StepSlug.EngagementStyleMethodology, {
      fields: [
        createField(StepSlug.EngagementStyleMethodology, FieldsIDs.Methodology),
        createField(StepSlug.EngagementStyleMethodology, FieldsIDs.Tone),
        createField(StepSlug.EngagementStyleMethodology, FieldsIDs.Style),
      ],
    }),
    createStep(StepSlug.CoachbotProfile, {
      fields: [
        createField(StepSlug.CoachbotProfile, FieldsIDs.ProfileName),
        createField(StepSlug.CoachbotProfile, FieldsIDs.ProfileDescription, {
          examples: createExamplesList(StepSlug.CoachbotProfile, FieldsIDs.ProfileDescription, [
            'reflective-partner',
            'onboarding-companion',
            'ai-mentor',
          ]),
        }),
        createField(StepSlug.CoachbotProfile, FieldsIDs.ProfileOnboarding, {
          optional: 'NewCoachCreation.steps.coachbot-profile.fields.onboarding.optional',
        }),
        createField(StepSlug.CoachbotProfile, FieldsIDs.ProfileDataSharing, {
          type: 'radio',
          rules: {},
        }),
      ],
      children: <ProfileSettingsDisclaimer />,
      nextButtonText:
        type === StepConfigType.NewCoach
          ? 'NewCoachCreation.steps.review-create.title'
          : 'NewCoachCreation.steps.review-edit.title',
    }),
    createStep(type === StepConfigType.NewCoach ? StepSlug.ReviewCreate : StepSlug.ReviewEdit, {
      question:
        type === StepConfigType.NewCoach
          ? 'NewCoachCreation.steps.review-create.title'
          : 'NewCoachCreation.steps.review-edit.title',
      progressBar: false,
      nextButtonText:
        type === StepConfigType.NewCoach
          ? 'NewCoachCreation.steps.common.create'
          : 'NewCoachCreation.steps.common.save',
      navigation: false,
      children: (props: StepProps) => <ConfirmStep {...props} type={type} />,
    }),
  ];
};
