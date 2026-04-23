import { twMerge } from 'tailwind-merge';

import CollapsiblePanel from '@/shared/CollapsiblePanel';

interface TipConfig {
  title: string;
  subTitle?: string;
  options: any[];
  nested?: boolean;
}

export function TispsList({
  id,
  options,
  title,
  subTitle,
  titleClass,
}: {
  titleClass?: string;
  title?: string;
  subTitle?: string;
  options: string[];
  id: string;
}) {
  return (
    <ul className="ms-5 flex list-disc flex-col text-main">
      {title && <h4 className={twMerge('-ms-4 mb-5 text-base font-medium', titleClass)}>{title}</h4>}
      {subTitle && <h5 className="-ms-4 mb-5 text-base font-medium">{subTitle}</h5>}
      {options.map((option: string, index: number) => (
        <li key={`${id}-list-item-${index}`}>{option}</li>
      ))}
    </ul>
  );
}

export function TipsContent({ tips, titleClass }: { tips: any; titleClass?: string }) {
  return (
    <div className="flex flex-col gap-y-5">
      {tips.map(({ title, subTitle, options, nested }: TipConfig, index: number) =>
        nested ? (
          <div className="ms-5 flex flex-col gap-y-10" key={index}>
            <h4 className="-mb-4 -ms-4 text-base font-medium">{title}</h4>
            {subTitle && <h5>{subTitle}</h5>}

            {options.map(({ title, options }: TipConfig, index: number) => (
              <TispsList
                key={`tips-nested-${index}`}
                id="nested-list"
                title={title}
                options={options}
                titleClass="text-dark-aquamarine italic"
              />
            ))}
          </div>
        ) : (
          <TispsList
            key={`tips-${index}`}
            id="list"
            title={title}
            options={options}
            subTitle={subTitle}
            titleClass={titleClass}
          />
        )
      )}
    </div>
  );
}

export function Tips({
  t,
  tipsKey,
  titleKey,
  titleClass,
  collapsible = true,
}: {
  t: any;
  tipsKey: string;
  titleKey?: string;
  titleClass?: string;
  collapsible?: boolean;
}) {
  const tipsConfig: TipConfig[] = Object.values(t.raw(tipsKey)).map(({ title, subTitle, options, nested }: any) => {
    let optionValues = options ? Object.values(options) : [];
    if (!!nested) {
      optionValues = optionValues.map(({ title, options }: any) => ({
        title,
        options: Object.values(options),
      }));
    }

    return {
      title,
      subTitle,
      nested: !!nested,
      options: optionValues,
    };
  });

  return collapsible ? (
    <CollapsiblePanel title={t(titleKey)} iconClass="cbi-info-circle" className="shrink-1" contentClassName="py-3">
      <TipsContent tips={tipsConfig} titleClass={titleClass} />
    </CollapsiblePanel>
  ) : (
    <TipsContent tips={tipsConfig} titleClass={titleClass} />
  );
}
