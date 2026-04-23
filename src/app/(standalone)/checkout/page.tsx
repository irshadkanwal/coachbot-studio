import { getTranslations } from 'next-intl/server';

import { signOut } from '@/server/actions/authActions';
import { getPrices } from '@/server/actions/checkoutActions';
import { verifySession } from '@/server/actions/sessionActions';
import { Button } from '@/shared/Button';
import { AccountToggleButton } from '@/shared/FunctionalButtons';
import { Logo } from '@/shared/Logo';
import PricesTable from './_components/PricesTable';

export default async function CheckoutPage() {
  const [t, session] = await Promise.all([getTranslations(), verifySession()]);

  return (
    <main className="flex h-svh w-svw flex-col items-center justify-center">
      <section className="flex max-h-dvh w-full min-w-0 flex-grow flex-col gap-y-2 overflow-y-auto overflow-x-hidden">
        <header className={`flex items-center justify-end gap-x-20 px-5 py-3.5`}>
          <div className="flex shrink-0 items-center gap-x-5">
            <Logo />
            {session?.userId &&
              (session?.accessAllowed ? (
                <AccountToggleButton />
              ) : (
                <form action={signOut}>
                  <Button variant="outline" color="darkGray" type="submit">
                    {t('General.Header.logoutButton')}
                    <i className="cbi-profile-circle text-lg"></i>
                  </Button>
                </form>
              ))}
          </div>
        </header>

        <PricesTable prices$={getPrices()} className="mx-auto max-w-[90dvw]" />
      </section>
    </main>
  );
}
