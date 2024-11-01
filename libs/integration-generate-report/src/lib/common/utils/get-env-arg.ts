import { ValidationError } from '@supy.api/errors';

export const getEnvArg = (argName: string) => {
  const argIndex = process.argv.indexOf(`--${argName}`);

  if (!argIndex) {
    throw new ValidationError(
      `${argName} argument not provided, make sure you provide it using "--${argName} <${argName}>"`
    );
  }

  if (argIndex === -1) {
    return;
  }

  const argValue = process.argv[argIndex + 1];

  if (!argValue) {
    throw new ValidationError(
      `${argName} argument not provided, make sure you provide it using "--${argName} <${argName}>"`
    );
  }

  return argValue;
};
