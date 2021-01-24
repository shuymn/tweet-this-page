import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { OptionLabel } from "../components/OptionLabel";

type Props = {
  initialValue: boolean;
  update(enable: boolean): void;
};

export const EnablePrefixOption: FunctionalComponent<Props> = ({
  initialValue,
  update,
}) => {
  const [enable, setState] = useState(initialValue);

  const handleClick = (event: Event) => {
    const value = (event.target as HTMLInputElement).checked;
    setState(value);
    update(value);
  };

  const label = chrome.i18n.getMessage("optionLabelEnablePrefix");

  return (
    <OptionLabel>
      <input type="checkbox" checked={enable} onClick={handleClick} />
      {label}
    </OptionLabel>
  );
};
