import React from 'react';

import { Input, InputProps } from '@/shared/Input';
import { FieldWrapper } from './FieldWrapper';

export interface InputFieldProps extends InputProps {
  id: string;
  label?: string;
  description?: string | React.ReactNode;
  examples?: string[] | string;
  optional?: string;
  hint?: string;
  placeholder?: string;
  value?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ ...props }) => {
  return (
    <FieldWrapper
      {...props}
      field={
        <Input
          id={props.id}
          type="textarea"
          inputClassName="bg-graphic/[14%]"
          initialValue={props.initialValue}
          placeholderKey={props.placeholder}
          onBlur={(event) => props?.onBlur?.((event.target as HTMLTextAreaElement).value)}
          onChange={(event) => props?.onChange?.((event.target as HTMLTextAreaElement).value)}
        />
      }
    />
  );
};
