import { h, FunctionalComponent } from "preact";

type Props = {
  title: string;
};

export const Section: FunctionalComponent<Props> = ({ title, children }) => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};
