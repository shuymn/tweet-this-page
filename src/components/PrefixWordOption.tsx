import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { OptionLabel } from "../components/OptionLabel";

type Props = {
  initialValue: string;
  update(prefixWord: string): void;
};

export const PrefixWordOption: FunctionalComponent<Props> = ({
  initialValue,
  update,
}) => {
  const [word, setState] = useState(initialValue);

  const handleChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    setState(value);
    update(value);
  };

  const label = chrome.i18n.getMessage("optionLabelPrefixWord");

  return (
    <OptionLabel>
      {`${label}: `}
      <input
        type="text"
        name="prefix_word"
        value={word}
        onChange={handleChange}
      />
    </OptionLabel>
  );
};
