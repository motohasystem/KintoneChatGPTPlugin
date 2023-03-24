"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_parameters_helper_1 = require("plugin-parameters-helper");
const settings_1 = require("./settings");
(function (PLUGIN_ID) {
    'use strict';
    console.info('run config main');
    const setting_input = settings_1.Settings.input;
    if (PLUGIN_ID == undefined) {
        throw new Error('PLUGIN_ID == undefined で呼び出されました。');
    }
    const manager = new plugin_parameters_helper_1.ConfigManager(PLUGIN_ID, setting_input);
    manager.build();
})(kintone.$PLUGIN_ID);
//# sourceMappingURL=../../../../../../src/ts/config/main.js.map