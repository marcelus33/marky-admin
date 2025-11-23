export const formatPrice = (price: number | string) => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  const priceString = numericPrice.toFixed(2).replace(".", ",");
  const parts = priceString.split(",");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${integerPart},${parts[1]}`;
};
