export const transfromToBoolean = ({ value }: { value: string | boolean }) =>
  typeof value === 'boolean' ? value : value === 'true';

export const transformToNumber = ({ value }: { value: string | number }) =>
  Number(value);

export const transformToInteger = ({ value }: { value: string | number }) =>
  typeof value === 'number' ? value : parseInt(value);
