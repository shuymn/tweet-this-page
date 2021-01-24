import { h, FunctionalComponent } from "preact";
import { ModeOption } from "../components/ModeOption";
import { Section } from "../components/Section";
import { setEnableAutoClose, setMode } from "../lib/options";
import { Mode } from "../lib/utils";
import { EnableAutoCloseOption } from "./EnableAutoCloseOption";

type Props = {
  initialValue: { mode: Mode; enableAutoClose: boolean };
};

export const ModeSection: FunctionalComponent<Props> = ({
  initialValue: { mode, enableAutoClose },
}) => {
  const title = chrome.i18n.getMessage("optionItemMode");
  const desc = chrome.i18n.getMessage("optionDescriptionMode");

  return (
    <Section title={title}>
      <p>{desc}</p>
      <ModeOption initialValue={mode} update={setMode} />
      <EnableAutoCloseOption
        initialValue={enableAutoClose}
        update={setEnableAutoClose}
      />
    </Section>
  );
};
