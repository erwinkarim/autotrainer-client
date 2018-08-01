/*
  Validate the course object
 */

export const titleNotEmpty = course => course.name.length > 0;
export const descriptionNotEmpty = course => course.description.length > 0;
export const priceNotEmpty = course => course.price !== '';
export const keyPointsNotEmpty = (course) => {
  const keyPoints = course.key_points;

  return (keyPoints === undefined || keyPoints === null ?
    true : (
      keyPoints.reduce((v, e) =>
        v && (e.title.length > 0 && e.subtext.length > 0), true)
    ));
};

// must be length 0 or 8-16
export const validCouponCode = (course) => {
  const { coupons } = course;
  return (coupons === undefined || coupons === null) ? true :
    coupons.reduce((v, e) => {
      if (e.code === null || e.code === undefined) {
        return v && true;
      }
      return v && (e.code.length === 0 || (e.code.length >= 8 && e.code.length <= 16));
    }, true);
};
