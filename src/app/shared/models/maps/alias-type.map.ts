import { AliasType } from '../enums/alias-type.enum';

export const aliasTypeMap = new Map<AliasType, string>([
  [AliasType.H323_E164, 'H323/SIP/PhoneNumber'],
  [AliasType.H323_URI, 'H.323 URI'],
  [AliasType.H323_IP, 'H.323 IP'],
  [AliasType.SIP_URI, 'SIP URI'],
  [AliasType.SIP_IP, 'SIP IP'],
  [AliasType.ADOBE_CONNECT_URI, 'Room URL'],
  [AliasType.CS_DIAL_STRING, 'ClearSea Dial String'],
  [AliasType.FREEPBX_CONFERENCE_NUMBER, 'Phone'],
  [AliasType.SKYPE_URI, 'SIP/Skype4B'],
  [AliasType.WEB_CLIENT_URI, 'Web client'],
]);
