import { memo, useState } from 'react';

import { parseFeature } from '../_utils/prices';

export const FeatureList = memo(function FeatureList({ features }: { features: { name: string }[] }) {
  return (
    <div className="space-y-3 pt-3">
      {features.map((feature, index) => {
        const { feature: featureName, value } = parseFeature(feature.name);

        return (
          <div key={index} className="flex items-center border-b border-b-graphic/[16%] pb-3 last:border-b-0">
            <span className="w-1/2 text-left text-sm text-main">{featureName}</span>
            <div className="flex w-1/2 items-center justify-center">
              {typeof value === 'boolean' ? (
                <i
                  className={
                    value
                      ? 'cbi-tick-circle !text-lg text-dark-aquamarine'
                      : 'cbi-close-circle !text-lg text-light-gray'
                  }
                />
              ) : (
                <span className="text-center text-sm font-medium text-dark-aquamarine">{value}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export const CollapsibleFeatureList = memo(function CollapsibleFeatureList({
  features,
  defaultCollapsed = true,
}: {
  features: { name: string }[];
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-center gap-2 pb-3 text-sm font-medium text-dark-aquamarine transition-colors hover:text-aquamarine"
      >
        <span>{isCollapsed ? 'Show details' : 'Hide details'}</span>
        <i className={`cbi-arrow-up !text-sm transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {!isCollapsed && <FeatureList features={features} />}
    </div>
  );
});
