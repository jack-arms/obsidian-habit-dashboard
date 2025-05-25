import { App, PluginSettingTab, Setting, moment } from "obsidian";
import type ObsidianHabitDashboardPlugin from "./main";
import { DEFAULT_DATE_FORMAT } from "./utils/utils";

export default class ObsidianHabitDashboardSettingsTab extends PluginSettingTab {
  plugin: ObsidianHabitDashboardPlugin;

  constructor(app: App, plugin: ObsidianHabitDashboardPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  private displayDateFormatSetting() {
    const { containerEl } = this;
    const descriptionEl = containerEl.createEl("p", {});
    descriptionEl.createEl("span", {
      text: "For use with the ",
    });
    descriptionEl.createEl("a", {
      text: "Daily notes core plugin",
      href: "https://help.obsidian.md/plugins/daily-notes",
    });
    descriptionEl.createEl("span", {
      text: ", check that you are using the same date format for both. Otherwise, for more syntax, refer to ",
    });
    descriptionEl.createEl("a", {
      text: "format reference",
      href: "https://momentjs.com/docs/#/displaying/format/",
    });
    const currentFormatBlock = descriptionEl.createEl("p", {
      cls: "mt-2",
    });
    currentFormatBlock.createEl("span", {
      text: "Your current format looks like ",
    });
    const currentFormatEl = currentFormatBlock.createEl("span", {
      cls: "u-pop",
      text: moment().format(
        this.plugin.settings.dateFormat ?? DEFAULT_DATE_FORMAT
      ),
    });
    const descriptionFragment = new DocumentFragment();
    descriptionFragment.append(descriptionEl);
    new Setting(containerEl)
      .setName("Date format")
      .setDesc(descriptionFragment)
      .addText((text) => {
        if (this.plugin.settings.dateFormat != null) {
          text.setValue(this.plugin.settings.dateFormat);
        }
        return text
          .setPlaceholder(DEFAULT_DATE_FORMAT)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value === "" ? null : value;
            await this.plugin.saveSettings(this.plugin.settings);
            currentFormatEl.textContent = moment().format(
              this.plugin.settings.dateFormat ?? DEFAULT_DATE_FORMAT
            );
          });
      });
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    this.displayDateFormatSetting();
  }
}
