import React from 'react';
import { FieldValues, RegisterOptions } from 'react-hook-form';

import { StepProps } from '../_components/steps/Step';

export interface StepI {
  label: string;
  question: string;
  id: string;
  fields?: FieldI[];
  children?: React.ReactNode | React.FC<StepProps>;
  progressBar?: boolean;
  nextButtonText?: string;
  navigation?: boolean;
}

export interface FieldI {
  type: string;
  placeholder?: string;
  description?: string | React.ReactNode;
  optional?: string;
  id: string;
  label?: string;
  examples?: string[] | string;
  hint?: string;
  value?: string;
  rules?: RegisterOptions<FieldValues, string>;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
}
