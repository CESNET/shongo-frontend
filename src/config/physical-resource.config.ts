export const physicalResourceConfig = {
  // Translates physical resource tags to localized names.
  // Don't forget to add a proper translation after changing name map.
  tagNameMap: new Map<string, string>([
    ['meeting-room', $localize`Meeting room`],
    ['parking-place', $localize`Parking place`],
  ]),
  // Only resources with supported tags will be available in app.
  supportedTags: ['meeting-room', 'parking-place'],
};
