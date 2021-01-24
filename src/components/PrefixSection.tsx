import { h, FunctionalComponent } from "preact";
import { EnablePrefixOption } from "../components/EnablePrefixOption";
import { PrefixWordOption } from "../components/PrefixWordOption";
import { Section } from "../components/Section";
import { setEnablePrefix, setPrefixWord } from "../lib/options";

type Props = {
  initialValue: { prefixWord: string; enablePrefix: boolean };
};

export const PrefixSection: FunctionalComponent<Props> = ({
  initialValue: { prefixWord, enablePrefix },
}) => {
  const title = chrome.i18n.getMessage("optionItemPrefix");
  const desc = chrome.i18n.getMessage("optionDescriptionPrefix");

  return (
    <Section title={title}>
      <p>{desc}</p>
      <EnablePrefixOption
        initialValue={enablePrefix}
        update={setEnablePrefix}
      />
      <PrefixWordOption initialValue={prefixWord} update={setPrefixWord} />
    </Section>
  );
};
