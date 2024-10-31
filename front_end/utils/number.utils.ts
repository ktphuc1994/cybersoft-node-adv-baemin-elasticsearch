const checkIsNumber = (value: string) => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

const checkIsInteger = (value: string) => {
  const numberValue = Number(value);
  return (
    !isNaN(numberValue) &&
    !isNaN(parseFloat(value)) &&
    Number.isInteger(numberValue)
  );
};

const priceCollator = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});
const formatPrice = (price: number) => priceCollator.format(price);

export { checkIsNumber, checkIsInteger, formatPrice };
