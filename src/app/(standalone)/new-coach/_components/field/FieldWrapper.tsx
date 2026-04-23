import { useTranslations } from 'next-intl';

export interface Props {
  label?: string;
  description?: string | React.ReactNode;
  examples?: string[] | string;
  optional?: string;
  hint?: string;
  field?: React.ReactNode;
  error?: string;
}

export const FieldWrapper: React.FC<Props> = ({ label, description, examples, optional, hint, field, error }) => {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-5">
      {label && <h5 className="text-center text-3xl text-main">{t(label)}</h5>}
      {description && (
        <p className="text-center text-light-gray">
          {typeof description === 'string' ? t.rich(description, { br: () => <br /> }) : description}
        </p>
      )}
      {optional && (
        <div className="text-sm text-light-gray">
          <span className="text-dark-aquamarine">{t('NewCoachCreation.fields.optional')}</span> {t(optional)}
        </div>
      )}
      {examples && (
        <div className="text-sm">
          <div className="mb-2 inline-block text-dark-aquamarine">{t('NewCoachCreation.fields.examples')} </div>
          {Array.isArray(examples) ? (
            <ul className="list-disc pl-7 text-light-gray">
              {examples.map((example, index) => (
                <li key={index} className="mb-2">
                  {t(example)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="inline-block text-light-gray">{t(examples)}</div>
          )}
        </div>
      )}
      {hint && <div className="mb-2 text-center text-sm text-light-gray">{t(hint)}</div>}
      {field && <div className="w-full">{field}</div>}
      {error && <div className="w-full text-red-500">{error}</div>}
    </div>
  );
};
