import { Technology } from '../enums/technology.enum';

export const technologyMap = new Map<Technology, string>([
  [Technology.PEXIP, 'Videoconference (PEXIP)'],
  [Technology.ADOBE_CONNECT, 'Webconference (Adobe Connect)'],
  [Technology.FREEPBX, 'Teleconference'],
  [Technology.H323_SIP, 'Videoconference (MCU)'],
]);
