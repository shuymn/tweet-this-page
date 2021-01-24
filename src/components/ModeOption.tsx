import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { OptionLabel } from "../components/OptionLabel";
import { Mode } from "../lib/utils";

type Props = {
  initialValue: Mode;
  update(mode: Mode): void;
};

export const ModeOption: FunctionalComponent<Props> = ({
  initialValue,
  update,
}) => {
  const [mode, setState] = useState(initialValue);

  const handleChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value as Mode;
    setState(value);
    update(value);
  };

  const label = chrome.i18n.getMessage("optionLabelMode");
  const modes = [Mode.Tab, Mode.Window];

  return (
    <OptionLabel>
      {`${label}: `}
      <select value={mode} onChange={handleChange}>
        {modes.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </OptionLabel>
  );
};
