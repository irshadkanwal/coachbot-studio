import { Locale } from './models/locale.models';

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const SIGNUP_MODE_COOKIE_NAME = 'mode';
export const DEFAULT_LOCALE: Locale = 'en';

export const HOME_ROUTE = '/chat';
export const LOGIN_ROUTE = '/login';

export const SESSION_COOKIE_NAME = 'cbs_ses';

export const MIN_CATEGORIES_COUNT = 3;
export const MAX_CATEGORIES_COUNT = 10;

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx', '.dotx', '.docm', '.dotm'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template': ['.docx', '.dotx', '.docm', '.dotm'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
    '.potx',
    '.ppsx',
    '.pptm',
    '.potm',
    '.ppsm',
  ],
  'application/json': ['.json'],
  'application/xml': ['.xml'],
  'text/markdown': ['.md'],
  'text/x-markdown': ['.md'],
  'text/plain': ['.txt'],
  'text/x-asciidoc': ['.adoc'],
  'text/html': ['.html', '.xhtml'],
  'text/csv': ['.csv'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/tiff': ['.tiff'],
  'image/bmp': ['.bmp'],
};

export enum PublicRoutes {
  login = '/login',
  signup = '/signup',
  forgotPassword = '/forgot-password',
  verification = '/verification',
}

export enum PrivateRoutes {
  chat = '/chat',
  dashboard = '/dashboard',
  checkout = '/checkout',
  feedback = '/account/feedback',
  stageInstructions = '/instructions/stages',
  instructions = '/instructions',
  account = '/account',
  content = '/content',
  configuration = '/configuration',
  coach = '/coach',
  newCoach = '/new-coach',
  newCoachSteps = '/new-coach/steps',
  newCoachCreation = '/new-coach/creation',
}

export enum CoachRoutes {
  users = '/users',
  conversations = '/conversations',
  ratings = '/ratings',
  revenue = '/revenue',
}

export const NEW_COACH_ANSWERS = 'new-coach-answers';

export const DEFAULT_PRICE_TRIAL_PERIOD = 14;

export const STARTER_PLAN_CREATION_LIMIT = 100;
export const STARTER_PLAN_PUBLISHING_LIMIT = 1;
export const PRO_PLAN_CREATION_LIMIT = 100;
export const PRO_PLAN_PUBLISHING_LIMIT = 3;
export const BUSINESS_PLAN_CREATION_LIMIT = 100;
export const BUSINESS_PLAN_PUBLISHING_LIMIT = 15;
