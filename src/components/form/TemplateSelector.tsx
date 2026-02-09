import * as stylex from "@stylexjs/stylex";
import { templateSelectorStyles, formStyles } from "../../styles/shared";
import type { BaseTemplate } from "../../types/template";

type TemplateSelectorProps<T extends readonly BaseTemplate[]> = {
  templates: T;
  selectedId: T[number]["id"];
  onSelect: (id: T[number]["id"]) => void;
  name?: string;
  srcKey?: "src" | "srcNoPdga";
  useColorSwatch?: boolean;
};

export function TemplateSelector<T extends readonly BaseTemplate[]>({
  templates,
  selectedId,
  onSelect,
  name = "template",
  srcKey = "src",
  useColorSwatch = false,
}: TemplateSelectorProps<T>) {
  return (
    <fieldset {...stylex.props(templateSelectorStyles.templateSelector)}>
      <legend {...stylex.props(formStyles.label)}>Choose a template</legend>
      <div {...stylex.props(templateSelectorStyles.templateOptions)} role="radiogroup">
        {templates.map((template) => (
          <label
            key={template.id}
            {...stylex.props(
              templateSelectorStyles.templateOption,
              selectedId === template.id && templateSelectorStyles.templateOptionSelected
            )}
          >
            <input
              type="radio"
              name={name}
              value={template.id}
              checked={selectedId === template.id}
              onChange={() => {
                onSelect(template.id);
              }}
              {...stylex.props(templateSelectorStyles.templateRadio)}
            />
            {useColorSwatch && "color" in template ? (
              <div
                aria-hidden="true"
                style={{ backgroundColor: template.color as string }}
                {...stylex.props(templateSelectorStyles.templateColorSwatch)}
              />
            ) : (
              <img
                src={(srcKey === "srcNoPdga" && template.srcNoPdga) || template.src}
                alt={template.label}
                {...stylex.props(templateSelectorStyles.templateThumbnail)}
              />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
