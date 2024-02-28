export const physicalResourceConfig = {
  // Translates physical resource tags to localized names.
  // Don't forget to add a proper translation after changing name map.
  tagNameMap: new Map<string, string>([
    ['meeting-room', $localize`Meeting room`],
    ['park-place', $localize`Parking place`],
    ['vehicle', $localize`Vehicle`],
    ['device', $localize`Device`],
  ]),
};
