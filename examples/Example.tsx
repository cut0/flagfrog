import { FlagRenderer, flagHandler, flagSwitcher } from "flag-tools";
import type React from "react";
import { useCallback, useMemo } from "react";
import type { FC } from "react";

const A: React.FC = () => {
  return <span>A</span>;
};

const B: React.FC = () => {
  return <span>B</span>;
};

export const App: FC = () => {
  const text = useMemo(() => {
    /**
     * NOTE:
     * - Using flagHandler to branch conditions
     */
    return flagSwitcher({
      name: "exampleA",
      value: false,
      enableOption: "A Text",
      disableOption: "B Text",
    });
  }, []);

  const handleA = useCallback(() => {
    console.log("handle A");
  }, []);

  const handleB = useCallback(() => {
    console.log("handle B");
  }, []);

  const handleFlag = useCallback(() => {
    /**
     * NOTE:
     * - Using flagHandler to branch execution
     */
    flagHandler({
      name: "exampleB",
      value: false,
      enableAction: handleA,
      disableAction: handleB,
    });
  }, [handleB, handleA]);

  return (
    <>
      {/**
       * NOTE:
       * - Using FlagRenderer to display different components
       */}
      <FlagRenderer
        value={false}
        name="exampleC"
        enableComponent={<A />}
        disableComponent={<B />}
      />
      <button type="button" onClick={handleFlag}>
        Toggle
      </button>
      <span>{text}</span>
    </>
  );
};
