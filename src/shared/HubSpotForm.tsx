'use client';

import { useCallback, useEffect, useRef } from 'react';

const HUB_SPOT_FORM_ID = '1c4ed7a5-7c7a-425d-8efd-64370fc3e3bc';
const HUB_SPOT_PORTAL_ID = '48175161';
const HUB_SPOT_REGION = 'na1';

export default function HubSpotForm({
  portalId = HUB_SPOT_PORTAL_ID,
  formId = HUB_SPOT_FORM_ID,
  region = HUB_SPOT_REGION,
  scriptId = HUB_SPOT_PORTAL_ID,
}: {
  portalId?: string;
  formId?: string;
  region?: 'na1';
  scriptId?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  const createFormContainer = useCallback(
    (host?: HTMLDivElement | null) => {
      if (!host) return;

      const formDiv = document.createElement('div');
      formDiv.className = `hs-form-frame bg-white z-10`;
      formDiv.setAttribute('data-portal-id', portalId);
      formDiv.setAttribute('data-form-id', formId);
      formDiv.setAttribute('data-region', region);

      host.appendChild(formDiv);

      return formDiv;
    },
    [portalId, formId, region]
  );

  const createScript = useCallback(() => {
    document.getElementById(`hubSpotScrpt`)?.remove();

    const script = document.createElement('script');
    script.id = 'hubSpotScrpt';
    script.src = `https://js.hsforms.net/forms/embed/${scriptId}.js`;
    script.defer = true;

    document.body.appendChild(script);

    return script;
  }, [scriptId]);

  useEffect(() => {
    const formDiv = createFormContainer(hostRef.current);
    const script = createScript();

    return () => {
      script.remove();
      formDiv?.remove();
    };
  }, [portalId, formId, scriptId, region]);

  return (
    <div ref={hostRef} className="relative -mt-5 max-h-[84dvh] min-h-20 overflow-y-auto rounded-xl">
      <div className="absolute inset-0 z-[-1] animate-pulse bg-main/[30%]"></div>
    </div>
  );
}
