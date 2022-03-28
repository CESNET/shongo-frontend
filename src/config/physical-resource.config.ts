export const physicalResourceConfig = {
  // Translates physical resource tags to localized names.
  // Don't forget to add a proper translation after changing name map.
  tagNameMap: new Map<string, string>([
    ['MEETING_ROOM', $localize`Meeting room`],
    ['PARKING_PLACE', $localize`Parking place`],
  ]),
};
