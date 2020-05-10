import { useState, useEffect } from "react";
import { NextPageContext } from "next";
import { SharedKey, SharedType } from "./SharedType";

let initialProps: SharedType;

export function setInitialProps(props: SharedType) {
  initialProps = props;
}

export function shared<T>(
  sharedKey: SharedKey,
  defaultValue: T,
  initialPropSetter: (context: NextPageContext) => Promise<T> = async () =>
    defaultValue,
  debug: boolean = false
) {
  let initialized = false;
  let currentValue = defaultValue;
  const onChangers: Array<(newValue: T) => void> = [];
  const onInits: Array<(newValue: T) => void> = [];
  const setters: Array<React.Dispatch<React.SetStateAction<T>>> = [];

  interface GetProp {
    (): {
      value: T;
      reset: () => void;
      onChange: (cb: () => void) => void;
      removeOnChange: (cb: () => void) => void;
    };
    onChange: (cb: (newValue: T) => void) => void;
    value: T;
    onInit: (cb: (newValue: T) => void) => void;
    reset: () => void;
    initialProp: (context: NextPageContext) => Promise<T>;
  }

  const getProp: GetProp = function () {
    if (!initialized) {
      if (typeof window === "undefined") {
        throw new Error(
          `ERROR: You're trying to access a shared property (${sharedKey}) on the server but you're not setting the initial value in the getInitialProps method of the page.`
        );
      }
      if (!initialProps || !(sharedKey in initialProps)) {
        throw new Error(
          `ERROR: You're trying to access a shared property (${sharedKey}) on the client but you're not setting the initial value in the getInitialProps method of the page, or not calling setInitialProps on the render method of the page.`
        );
      }
      const initialValue = initialProps[sharedKey];
      if (debug) console.log(sharedKey + " - initialValue", initialValue);
      currentValue = initialValue as any;

      initialized = true;
    }
    onInits.forEach((cb) => cb(currentValue));
    const set = useState(currentValue)[1];

    useEffect(() => {
      if (setters.indexOf(set) === -1) {
        setters.push(set);
      }

      return () => {
        const setterIdx = setters.indexOf(set);
        setters.splice(setterIdx, 1);
      };
    }, [set]);

    return {
      get value() {
        if (debug) console.log(sharedKey + " - get value()", currentValue);
        return currentValue;
      },
      set value(newValue: T) {
        if (currentValue === newValue) return;
        if (debug) console.log(sharedKey + " - set value()", newValue);
        currentValue = newValue;
        onChangers.forEach((s) => s(newValue));
        setters.forEach((s) => s(newValue));
      },
      reset() {
        if (currentValue === defaultValue) return;
        currentValue = defaultValue;
        onChangers.forEach((s) => s(defaultValue));
        setters.forEach((s) => s(defaultValue));
      },
      onChange(cb: () => void) {
        const index = onChangers.indexOf(cb);
        if (index === -1) {
          onChangers.push(cb);
        }
      },
      removeOnChange(cb: () => void) {
        const index = onChangers.indexOf(cb);
        if (index > -1) {
          onChangers.splice(index, 1);
        }
      },
    };
  };

  getProp.value = currentValue;

  Object.defineProperty(getProp, "value", {
    get: function () {
      return currentValue;
    },
    set: function (newValue: T) {
      if (currentValue === newValue) return;
      currentValue = newValue;
      setters.forEach((s) => s(newValue));
    },
  });

  getProp.onChange = (cb) => {
    onChangers.push(cb);
  };

  getProp.reset = () => {
    if (currentValue === defaultValue) return;
    currentValue = defaultValue;
    onChangers.forEach((s) => s(defaultValue));
    setters.forEach((s) => s(defaultValue));
  };

  getProp.onInit = function (cb: (newValue: T) => void) {
    onInits.push(cb);
  };

  getProp.initialProp = async function (context: NextPageContext) {
    currentValue = await initialPropSetter(context);
    initialized = true;
    return currentValue;
  };

  return getProp;
}
