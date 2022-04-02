export const getValue = (key: string, defaultValue: unknown): unknown => {
  return window.localStorage?.getItem(key) ?? defaultValue;
};

export const getBoolean = (key: string, defaultValue: boolean): boolean => {
  const item = window.localStorage?.getItem(key);
  if (item == null) {
    return defaultValue;
  }
  return item === "1";
};

export const getInteger = (key: string, defaultValue: number): number => {
  const item = window.localStorage?.getItem(key);
  if (item == null || isNaN(parseInt(item, 10))) {
    return defaultValue;
  }
  return parseInt(item, 10);
};

export const setValue = (key: string, value: unknown): void => {
  if (!window.localStorage) {
    throw new Error("local storage is not found");
  }
  window.localStorage.setItem(key, String(value));
};

export const setBoolean = (key: string, value: boolean): void => {
  setValue(key, value ? "1" : "0");
};

export const setNumber = (key: string, value: number): void => {
  setValue(key, String(value));
};
