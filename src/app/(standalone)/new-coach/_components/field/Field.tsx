import { useMemo } from 'react';

import { InputProps } from '@/shared/Input';
import { InformationRadioField } from './InformationRadioField';
import { InputField } from './InputField';

interface FieldProps extends InputProps {
  onChange?: (value: string) => void;
  error?: string;
}

export const Field: React.FC<FieldProps> = (props) => {
  const field = useMemo(() => {
    switch (props.type) {
      case 'textarea':
        return <InputField {...props} onBlur={props.onChange} />;
      case 'radio':
        return <InformationRadioField {...props} onChange={props.onChange} />;
      default:
        return undefined;
    }
  }, [props]);

  return field;
};
