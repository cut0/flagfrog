import type { FC, ReactNode } from "react";

type Props = {
  name: string;
  value: boolean;
  enableComponent: ReactNode;
  disableComponent: ReactNode;
};

export const FlagRenderer: FC<Props> = ({
  value,
  enableComponent,
  disableComponent,
}) => {
  return value ? enableComponent : disableComponent;
};
