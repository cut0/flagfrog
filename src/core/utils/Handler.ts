type Args<T, U> = {
  name: string;
  value: boolean;
  enableAction: () => T;
  disableAction: () => U;
};

export const flagHandler = <T, U>({
  value,
  enableAction,
  disableAction,
}: Args<T, U>): T | U => {
  return value ? enableAction() : disableAction();
};
