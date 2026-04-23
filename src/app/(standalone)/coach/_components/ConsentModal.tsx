import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { CoachRoutes, PrivateRoutes } from '@/lib/constants';
import { updateUserData } from '@/server/actions/userActions';
import { Modal } from '@/shared/Modal';

export default async function ConsentModal({ id }: { id: string }) {
  const t = await getTranslations();

  return (
    <Modal
      className="max-w-2xl"
      titleClass="text-salmon font-semibold"
      confirmButtonClass="bg-main text-background hover:bg-dark-aquamarine hover:text-main hover:border-dark-aquamarine"
      buttonTitleKey="CoachDetails.Users.ConsentModal.submitButton"
      buttonIcon="cbi-tick-circle-fill"
      titleIcon="cbi-warning"
      titleKey="CoachDetails.Users.ConsentModal.title"
      variant="gray"
      isOpen={true}
      closeModal={async () => {
        'use server';
        redirect(PrivateRoutes.dashboard);
      }}
      confirm={async () => {
        'use server';
        await updateUserData({ consentAccepted: true, consentAcceptedAt: new Date() });
        redirect(`${PrivateRoutes.coach}/${id}${CoachRoutes.users}`);
      }}
    >
      <>
        <p className="text-light-gray">
          {t.rich('CoachDetails.Users.ConsentModal.content', {
            link: (chunk) => (
              <Link
                prefetch={false}
                className="text-main underline underline-offset-2"
                target="_blank"
                href="https://coachbot.ai/legal/dpa"
              >
                {chunk}
              </Link>
            ),
          })}
        </p>
        <span className="text-main">{t('CoachDetails.Users.ConsentModal.callToAction')}</span>
      </>
    </Modal>
  );
}
