import { TransformFnParams } from 'class-transformer';

export const transfromToBoolean = ({ value }: TransformFnParams) =>
  typeof value === 'boolean' ? value : value === 'true';

export const transformToNumber = ({ value }: TransformFnParams) =>
  Number(value);

export const transformToInteger = ({ value }: TransformFnParams) =>
  typeof value === 'number' ? value : parseInt(value);

export const transformToIntegerOrUndefined = ({ value }: TransformFnParams) =>
  typeof value === 'number' ? value : value ? parseInt(value) : undefined;

export const transformToValueOrUndefined = ({ value }: TransformFnParams) =>
  value ? value : undefined;
