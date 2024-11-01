type AnyObject = unknown;

export function removeTimestamps(obj: AnyObject): AnyObject {
  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return removeTimestamps(item);
    });
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(function ([key]) {
          return key !== 'createdAt' && key !== 'updatedAt';
        })
        .map(function ([key, value]) {
          return [key, removeTimestamps(value)];
        })
    ) as AnyObject;
  } else {
    return obj;
  }
}
