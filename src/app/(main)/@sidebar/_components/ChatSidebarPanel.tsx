import { useTranslations } from 'next-intl';

import { SessionDetailsTab } from '@/lib/models/common.models';
import ComingSoon from '@/shared/CoomingSoon';
import Tabs from '@/shared/Tabs';

function PanelContent({ name, descriptions }: SessionDetailsTab) {
  const t = useTranslations();

  if (!descriptions.length) {
    return (
      <div className="flex flex-col gap-y-2 rounded-lg bg-graphic/[14%] p-3 py-6">
        <p className="text-base text-light-gray">{t('Sidebar.emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-y-4 rounded-lg bg-graphic/[14%] p-5">
      <h5 className="text-sm text-light-gray"> {name}</h5>
      <div className="flex flex-grow flex-col gap-y-8 overflow-y-auto text-base text-main">
        {descriptions.map(({ title, type, value }, key) => (
          <div key={`tab-description-${key}`} className="flex flex-col gap-y-3 rounded-xl">
            {title && <div className="text-sm font-bold text-main">{title}</div>}
            {type === 'text' && <p className="">{value}</p>}
            {type === 'list' && (
              <ol className="flex list-disc flex-col gap-y-2 text-main">
                {value.map((item: string, id: number) => (
                  <li key={`description-item-${id}`} className="inline-flex w-full">
                    {item}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatSidebarPanel({
  data,
  id,
  inDevelopment,
}: {
  data?: SessionDetailsTab[];
  id: string;
  name: string;
  inDevelopment?: boolean;
}) {
  if (!data) return null;

  return (
    <div className="flex min-h-0 flex-col">
      {inDevelopment && <ComingSoon />}
      {data && data?.length > 1 ? (
        <Tabs
          key={id}
          id={`inner-tab-${id}`}
          listClassName="relative top-0 gap-x-1 sticky sticky-el"
          tabClassName="bg-white/[8%] text-main border border-background-border/[18%] py-1.5 text-sm data-[hover]:data-[selected]:bg-storm-gray data-[selected]:bg-storm-gray data-[selected]:text-main"
          tabs={data.map((config, key) => ({ ...config, content: () => <PanelContent {...config} key={key} /> }))}
        />
      ) : (
        PanelContent(data[0])
      )}
    </div>
  );
}
