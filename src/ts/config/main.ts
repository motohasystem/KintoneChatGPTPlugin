import { ConfigManager } from "plugin-parameters-helper";
import { Settings } from "./settings";

(function (PLUGIN_ID) {
    'use strict';
    console.info('run config main')


    if (PLUGIN_ID == undefined) {
        throw new Error('PLUGIN_ID == undefined で呼び出されました。')
    }

    const setting_prefs = Settings.preference
    const setting_input = Settings.input
    const manager = new ConfigManager(PLUGIN_ID, setting_input, setting_prefs)
    manager.build()

})(kintone.$PLUGIN_ID);

