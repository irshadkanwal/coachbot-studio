import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { PrivateRoutes } from '@/lib/constants';
import { signOut } from '@/server/actions/authActions';
import { getUser, getUserPictureSignedUrl } from '@/server/actions/userActions';
import { Button } from '@/shared/Button';
import AccountForm from './_components/AccountForm';
import DeleteAccountButton from './_components/DeleteAccountButton';
import PictureUploader from './_components/PictureUploader';

const AVATAR_IMAGE_SIZE = 138;

const subSections = [
  {
    titleKey: 'Account.UpgradePlan.title',
    subTitleKey: 'Account.UpgradePlan.subTitle',
    buttonTitleKey: 'Account.UpgradePlan.pricingButton',
    buttonIcon: 'cbi-kanban',
    href: PrivateRoutes.checkout,
  },
  {
    titleKey: 'Account.Feedback.title',
    subTitleKey: 'Account.Feedback.subTitle',
    buttonTitleKey: 'Account.Feedback.buttonTitle',
    buttonIcon: 'cbi-like',
    href: PrivateRoutes.feedback,
  },
];

export default async function AccountPage() {
  const [t, user] = await Promise.all([getTranslations(), getUser()]);
  const pictureUrl = await getUserPictureSignedUrl(user);

  return (
    <div className="flex flex-grow rounded-xl border border-light-gray">
      <aside className="flex w-full max-w-[30%] flex-grow flex-col justify-between p-6">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex aspect-square w-2/5 min-w-32 max-w-52 items-center justify-center rounded-lg bg-storm-gray">
            {!!pictureUrl ? (
              <Image
                src={pictureUrl}
                alt="User Picture"
                className="size-full rounded-lg object-cover object-center"
                width={AVATAR_IMAGE_SIZE}
                height={AVATAR_IMAGE_SIZE}
              />
            ) : (
              <span className="cbi-image-placeholder text-7xl text-background"></span>
            )}
          </div>
          <div className="flex flex-grow flex-col gap-y-3">
            <span className="text-lg uppercase text-dark-aquamarine">{user?.name}</span>
            <PictureUploader
              onUploadSuccess={async () => {
                'use server';
                revalidatePath(PrivateRoutes.account);
              }}
            >
              <i className="cbi-gallery-add"></i>
              {t('Account.Sidebar.addImageButton')}
            </PictureUploader>
          </div>
          <Button variant="outline" color="darkGray" className="flex-grow py-2.5" onClick={signOut}>
            <i className="cbi-logout"></i>
            {t('Account.Sidebar.logoutButton')}
          </Button>
        </div>
        <DeleteAccountButton userEmail={user?.email || ''} />
      </aside>
      <main className="flex flex-grow flex-col gap-y-3 p-2.5">
        <section className="flex flex-col gap-y-6 rounded-xl bg-graphic/[14%] p-3.5">
          <div className="flex flex-col gap-y-3 ps-2 text-main">
            <h2 className="text-xl font-bold uppercase">{t('Account.title')}</h2>
            <p className="text-sm">{t('Account.subTitle')}</p>
          </div>
          <AccountForm name={user?.name || ''} email={user?.email || ''} />
        </section>
        {subSections.map((section, index) => (
          <section key={`sub-section-${index}`} className="flex items-center gap-x-6 rounded-xl bg-graphic/[14%] p-3.5">
            <div className="flex flex-grow flex-col gap-y-3">
              <h4 className="text-sm uppercase text-light-gray">{t(section.titleKey)}</h4>
              <p className="text-sm text-main">{t(section.subTitleKey)}</p>
            </div>
            <Button
              variant="solid"
              color="gray"
              className="h-fit w-max max-w-48 shrink-0 text-nowrap"
              href={section.href}
            >
              <i className={section.buttonIcon} />
              {t(section.buttonTitleKey)}
            </Button>
          </section>
        ))}
      </main>
    </div>
  );
}
