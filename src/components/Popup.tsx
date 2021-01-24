import { h, FunctionalComponent } from "preact";
import { ModeSection } from "../components/ModeSection";
import { PrefixSection } from "../components/PrefixSection";
import { Options } from "../lib/options";

type Props = {
  options: Options;
};

export const Popup: FunctionalComponent<Props> = ({
  options: { mode, prefixWord, enablePrefix, enableAutoClose },
}) => {
  const title = chrome.i18n.getMessage("optionTitle");

  return (
    <div>
      <h1>{title}</h1>
      <ModeSection initialValue={{ mode, enableAutoClose }} />
      <PrefixSection initialValue={{ prefixWord, enablePrefix }} />
    </div>
  );
};
