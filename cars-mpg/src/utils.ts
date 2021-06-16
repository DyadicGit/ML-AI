import { MutableRefObject, useCallback, useRef } from "react";

export const useMDCInit = (Component: any) => {
  const mdc: MutableRefObject<any> = useRef();
  const ref = useCallback(
    (element) => {
      if (element) {
        element.classList.remove("mdc---nojs");
        Array.from(
          element.querySelectorAll(
            ".mdc-notched-outline--notched, .mdc-floating-label--float-above"
          )
        ).forEach((element: any) =>
          element.classList.remove(
            "mdc-notched-outline--notched",
            "mdc-floating-label--float-above"
          )
        );
        mdc.current = new Component(element);
      } else {
        mdc.current.destroy();
      }
    },
    [mdc, Component]
  );

  return [mdc, ref];
};
