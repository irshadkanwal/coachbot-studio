'use server';

import { Client } from '@sendgrid/client';

import { PublicRoutes } from '@/lib/constants';

const sgClient = new Client();
sgClient.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmailVerificationLetter = async (
  email: string,
  first_name: string,
  searchParams: URLSearchParams
): Promise<boolean> => {
  try {
    const baseUrl = `${process.env.APP_BASE_URL}${PublicRoutes.verification}`;
    const verification_link = `${baseUrl}?mode=${searchParams.get('mode')}&oobCode=${searchParams.get('oobCode')}`;

    const data = {
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: { verification_link, first_name },
        },
      ],
      from: { email: process.env.SENDGRID_DEFAULT_SENDER, name: 'Studio CoachBot' },
      template_id: process.env.SENDGRID_VERIFY_EMAIL_TEMPLATE_ID,
    };

    const resp = await sgClient.request({
      method: 'POST',
      url: '/v3/mail/send',
      body: data,
    });

    return resp[1];
  } catch (error: any) {
    console.error('[SendGrid] Error during sending Studio verification email:', error.response.body.errors);

    return false;
  }
};
