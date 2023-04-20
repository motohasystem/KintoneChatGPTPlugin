import 'bootstrap'
// import "../../scss/style.scss";
import { ConfigDict, ConfigManager } from "plugin-parameters-helper";
import { Settings } from "../config/settings";

// import "@shin-chan/kypes";  // kintone types
import { ChatGPTConnector } from './chatgpt_connector';

export type SettingValue = string | {} | []

/**
 * メイン処理
 */
(function (PLUGIN_ID) {
    'use strict';

    if (PLUGIN_ID == undefined) {
        throw new Error('PLUGIN_ID == undefined で呼び出されました。')
    }

    console.info('run desktop main')

    const input = Settings.input    // 設定画面定義
    const conf_manager = new ConfigManager(PLUGIN_ID, input)
    const full_conf = conf_manager.get_config() as ConfigDict
    console.log(full_conf)

    // 詳細表示イベント
    kintone.events.on([
        // "app.record.detail.show"
        "app.record.edit.show"
        , "app.record.create.show"
    ], (event) => {
        console.log(event)
        const connector = new ChatGPTConnector(full_conf)
        connector.setup(PLUGIN_ID)

        return event;
    });


})(kintone.$PLUGIN_ID);
