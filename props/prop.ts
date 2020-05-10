import { useState } from "react";

export interface Prop<T> {
  value: T;
  reset: () => void;
  validate: (validator: (value: T) => boolean) => Prop<T>;
  valid: () => boolean;
  invalid: () => boolean;
}

export function getProp<T>(defaultValue: T): Prop<T> {
  const [state, set] = useState(defaultValue);
  let currentValue: T = state;
  let validate: (value: T) => boolean = (value) => true;
  return {
    get value() {
      return currentValue;
    },
    set value(newValue: T) {
      if (newValue === currentValue) return;
      currentValue = newValue;
      set(newValue);
    },
    reset() {
      if (defaultValue === currentValue) return;
      currentValue = defaultValue;
      set(defaultValue);
    },
    validate(validator: (value: T) => boolean) {
      validate = validator;
      return this;
    },
    valid() {
      return validate(currentValue);
    },
    invalid() {
      return !validate(currentValue);
    },
  };
}

export function getForceUpdate() {
  let counter = 0;
  const set = useState(counter)[1];

  return function () {
    set(counter++);
  };
}
