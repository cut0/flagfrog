type Args<T, U> = {
  name: string;
  value: boolean;
  enableOption: T;
  disableOption: U;
};

export const flagSwitcher = <T, U>({
  value,
  enableOption,
  disableOption,
}: Args<T, U>): T | U => {
  return value ? enableOption : disableOption;
};
