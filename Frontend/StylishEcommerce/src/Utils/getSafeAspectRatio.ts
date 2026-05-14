export const ASPECT_RATIOS = {
  portrait_tall: 0.5,
  portrait: 0.75,
  square: 1,
  landscape: 1.5,
};

export const getStableAspectRatio = (id: number | string) => {
  const buckets = [
    ASPECT_RATIOS.portrait_tall,
    ASPECT_RATIOS.portrait,
    ASPECT_RATIOS.square,
    ASPECT_RATIOS.landscape,
  ];

  let numericId = 0;
  if (typeof id === "string") {
    for (let i = 0; i < id.length; i++) {
      numericId += id.charCodeAt(i);
    }
  } else {
    numericId = id || 0;
  }

  return buckets[numericId % buckets.length];
};

export const getAspectRatio = (item: any) => {
  if (item?.image?.width && item?.image?.height) {
    return item.image.width / item.image.height;
  }

  return getStableAspectRatio(item._id || item.id);
};
