import { Technology } from 'src/app/shared/models/enums/technology.enum';

export const virtualRoomResourceConfig = {
  tagNameMap: new Map<Technology, string>([
    [Technology.PEXIP, $localize`Videoconference (Pexip)`],
    [Technology.ADOBE_CONNECT, $localize`Webconference (Adobe connect)`],
    [Technology.FREEPBX, $localize`Teleconference`],
    [Technology.H323_SIP, $localize`Videoconference (MCU)`],
  ]),
};
