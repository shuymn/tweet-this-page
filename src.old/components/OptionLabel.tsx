import { h, FunctionalComponent } from "preact";

export const OptionLabel: FunctionalComponent = ({ children }) => {
  return <label class="option_item">{children}</label>;
};
