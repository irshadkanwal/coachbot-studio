import { getTranslations } from 'next-intl/server';

import { PrivateRoutes } from '@/lib/constants';
import { getUser } from '@/server/actions/userActions';
import HubSpotForm from '../HubSpotForm';
import { Logo } from '../Logo';
import { ModalButton } from '../ModalButtons';
import { ThemeToggler } from '../ThemeToggler';
import AccountButton from './AccountButton';
import ConditionalNavigatorButton from './ConditionalNavigatorButton';
import TopNavigation, { NavigationOption } from './TopNavigation';

const navigationOptions: NavigationOption[] = [
  {
    id: 'nav-dashboard',
    label: 'General.Header.navigation.3',
    icon: 'cbi-presention-chart',
    href: PrivateRoutes.dashboard,
  },
  {
    id: 'nav-chat',
    label: 'General.Header.navigation.0',
    icon: 'cbi-messages',
    href: PrivateRoutes.chat,
  },
  {
    id: 'nav-instructions',
    label: 'General.Header.navigation.1',
    icon: 'cbi-setting',
    href: PrivateRoutes.instructions,
  },
  {
    id: 'nav-content',
    label: 'General.Header.navigation.2',
    icon: 'cbi-folder-add',
    href: PrivateRoutes.content,
  },
  // {
  //   id: 'nav-configuration',
  //   label: 'General.Header.navigation.4',
  //   icon: 'cbi-folder-add',
  //   href: PrivateRoutes.configuration,
  //   hidden,
  // },
];

export default async function Header({
  className,
  withAsideToggle = false,
}: {
  className?: string;
  withAsideToggle?: boolean;
}) {
  const [t, user] = await Promise.all([getTranslations(), getUser()]);

  return (
    <header className={`flex items-center justify-between gap-x-10 py-1.5 xl:gap-x-10 2xl:gap-x-16 ${className ?? ''}`}>
      <div className={'flex w-fit flex-grow items-center gap-x-5 p-2'}>
        {withAsideToggle && <ConditionalNavigatorButton labelKey="General.Header.openSidebarButton" />}
        <ModalButton
          config={{
            variant: 'gray',
            titleKey: 'Common.helpModal.title',
            titleIcon: 'cbi-message-question ',
            titleClass: 'text-dark-aquamarine',
            className: 'min-w-[60dvw] xl:min-w-[40dvw]',
          }}
          className="cbi-message-question -ms-2 aspect-square border-dark-aquamarine/[11%] bg-white-opacity p-1 px-2 text-2xl text-dark-aquamarine hover:border-dark-aquamarine"
        >
          <HubSpotForm />
        </ModalButton>
        <TopNavigation
          className={'max-w-3xl flex-nowrap 2xl:max-w-4xl 3xl:max-w-5xl'}
          variant="main"
          navigationOptions={navigationOptions}
        />
      </div>
      <div className="flex shrink items-center gap-x-5">
        <ThemeToggler />
        <Logo className="shrink-0" />
        <AccountButton user={user} t={t} />
      </div>
    </header>
  );
}
