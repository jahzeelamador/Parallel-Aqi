// @ts-ignore
import { PanelPlugin as OldPanelPlugin } from '@grafana/ui';
import { PanelPlugin } from '@grafana/data';
import { SimpleOptions, defaults } from './types';
import { SimplePanel } from './SimplePanel';
import { SimpleEditor } from './SimpleEditor';
import { FieldCMEditor } from './components/FieldCMEditor';
import './style.css';

let plugin;

if (!PanelPlugin) {
  // Grafana V6
  plugin = new OldPanelPlugin<SimpleOptions>(SimplePanel).setDefaults(defaults).setEditor(SimpleEditor);
} else {
  // Grafana V7
  plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
    return builder
      .addBooleanSwitch({
        path: 'followTheme',
        name: 'Follow Grafana Theme',
        description: 'Use default theme or follow theme of grafana (light or dark).',
        defaultValue: defaults.followTheme,
      })
      .addNumberInput({
        path: 'max',
        name: 'Max Label',
        description: 'Modify theshold maximum and the default value is 1000',
        defaultValue: 1000,
      })
      .addNumberInput({
        path: 'fontSize',
        name: 'Font Size',
        description: 'Modify the font size',
        defaultValue: 10,
      });
    // .addCustomEditor({
    //   id: 'getOption',
    //   path: 'getOption',
    //   name: 'Echarts options',
    //   description: 'Return options called by echarts or just use echartsInstance.setOption(...).',
    //   defaultValue: defaults.getOption,
    //   editor: FieldCMEditor,
    // });
  });
}

export { plugin };
