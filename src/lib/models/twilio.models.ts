// Twilio credentials API response format
export interface TwilioCredentialsResponse {
  account_sid: string;
  auth_token: string;
  sms_number: string;
  whatsapp_number?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
