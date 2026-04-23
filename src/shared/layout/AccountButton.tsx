import Image from 'next/image';

import { PrivateRoutes } from '@/lib/constants';
import { User } from '@/lib/models/common.models';
import { getUserPictureSignedUrl } from '@/server/actions/userActions';
import { Button } from '../Button';

const EXPIRATION_IN_MINUTES_ONE_WEEK = 1440 * 7;

export default async function AccountButton({ user, t }: { user: User | null; t: any }) {
  const pictureUrl = await getUserPictureSignedUrl(user, EXPIRATION_IN_MINUTES_ONE_WEEK);

  return (
    <Button
      variant="outline"
      color="darkGray"
      href={PrivateRoutes.account}
      className={`flex min-w-0 justify-center gap-x-2 px-2 py-1.5 text-xl`}
    >
      <div className="flex aspect-square size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white-opacity">
        {!!pictureUrl ? (
          <Image
            src={pictureUrl}
            alt="User Picture"
            className="size-full object-cover object-center"
            width={100}
            height={100}
          />
        ) : (
          <i className="cbi-profile-circle !text-xl" />
        )}
      </div>
      <div className="flex min-w-0 flex-grow flex-col items-start justify-center">
        <span className="text-xs text-light-gray">{t('General.Header.accountButton')}</span>
        <span className="max-w-full truncate text-base font-medium text-main" title={user?.name || ''}>
          {user?.name}
        </span>
      </div>
    </Button>
  );
}
