type Args<T, U> = {
  name: string;
  value: boolean;
  on: () => T;
  off: () => U;
};

export const flagHandler = <T, U>({ value, on, off }: Args<T, U>): T | U => {
  return value ? on() : off();
};
