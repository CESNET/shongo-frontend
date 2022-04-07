import { AliasType } from '../enums/alias-type.enum';

export const aliasTypeMap = new Map<AliasType, string>([
  [AliasType.H323_E164, $localize`:virtual room alias:H323/SIP/PhoneNumber`],
  [AliasType.H323_URI, $localize`:virtual room alias:H.323 URI`],
  [AliasType.H323_IP, $localize`:virtual room alias:H.323 IP`],
  [AliasType.SIP_URI, $localize`:virtual room alias:SIP URI`],
  [AliasType.SIP_IP, $localize`:virtual room alias:SIP IP`],
  [AliasType.ADOBE_CONNECT_URI, $localize`:virtual room alias:Room URL`],
  [
    AliasType.CS_DIAL_STRING,
    $localize`:virtual room alias:ClearSea Dial String`,
  ],
  [AliasType.FREEPBX_CONFERENCE_NUMBER, $localize`:virtual room alias:Phone`],
  [AliasType.SKYPE_URI, $localize`:virtual room alias:SIP/Skype4B`],
  [AliasType.WEB_CLIENT_URI, $localize`:virtual room alias:Web client`],
]);
