export const calculatePriceSummary = (items: any[]) => {
  const totalMRP = items.reduce((total, item) => {
    const price = parseFloat(item.price || item.item?.price || 0);
    return total + price * item.count;
  }, 0);

  const totalDiscountPrice = items.reduce((total, item) => {
    const discount = parseFloat(item.discountprice || item.item?.discountprice || 0);
    const price = discount > 0 ? discount : parseFloat(item.price || item.item?.price || 0);
    return total + price * item.count;
  }, 0);

  const productDiscount = totalMRP - totalDiscountPrice;

  return {
    totalMRP,
    totalDiscountPrice,
    productDiscount,
  };
};
