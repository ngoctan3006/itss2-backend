export const transfromToBoolean = ({ value }: { value: string | boolean }) =>
  typeof value === 'boolean' ? value : value === 'true';
