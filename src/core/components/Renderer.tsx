import type { FC, ReactNode } from "react";

type Props = {
  name: string;
  value: boolean;
  on: ReactNode;
  off: ReactNode;
};

export const FlagRenderer: FC<Props> = ({ value, on, off }) => {
  return value ? on : off;
};
