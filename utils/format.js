export const formatCurrency = (value) => {
  if (value == null || value === '') return '';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  return new Intl.NumberFormat('lo-LA', {
    useGrouping: true, // Explicitly enable grouping (e.g., thousands separator)
    minimumFractionDigits: 0, // Ensure at least 0 decimal places
    maximumFractionDigits: 2, // Allow up to 2 decimal places for currency
  }).format(numValue);
};

export const parseCurrency = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const stringValue = String(value);
  const sanitized = stringValue.replace(/,/g, '');
  const number = parseFloat(sanitized);
  return isNaN(number) ? null : number;
};

export const formatWeight = (weightInput) => {
  if (weightInput == null || weightInput === '') return '0 ກຣາມ';
  
  // ตอนนี้ weightInput จะเป็นตัวเลขกรัมจากฐานข้อมูลแล้ว
  const weightInGrams = parseFloat(weightInput);
  if (isNaN(weightInGrams)) return '0 ກຣາມ';
  
  return `${weightInGrams.toFixed(2)} ກຣາມ`;
};
