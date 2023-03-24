"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("bootstrap");
require("../../scss/style.scss");
const plugin_parameters_helper_1 = require("plugin-parameters-helper");
// import { PluginCanvas } from "../plugin_canvas";
const settings_1 = require("../config/settings");
// import { CONSTANTS } from "../constants";
// import { ButtonInstaller, Shortcut, ShortcutDefinitions } from "./button_installer";
// import { FieldModifier } from './field_modifier';
require("@shin-chan/kypes"); // kintone types
/**
 * メイン処理
 */
(function (PLUGIN_ID) {
    'use strict';
    if (PLUGIN_ID == undefined) {
        throw new Error('PLUGIN_ID == undefined で呼び出されました。');
    }
    console.info('run desktop main');
    const setting_input = settings_1.Settings.input; // 設定画面定義
    const conf_manager = new plugin_parameters_helper_1.ConfigManager(PLUGIN_ID, setting_input);
    const full_conf = conf_manager.get_config();
    console.log(full_conf);
    // アイコンを表示する画面
    // const EVENT_INDEX_LIST = [
    //     'app.record.index.show'
    // ]
    // // 詳細画面、編集画面
    // const EVENT_DETAIL_LIST = [
    //     'app.record.detail.show'
    //     // , '	app.record.create.show'
    //     // , '	app.record.edit.show'
    // ]
    // // ルックアップフィールドを編集可能にする画面（編集画面）
    // const EVENT_EDITABLE_LOOKUP = [
    //     'app.record.edit.show'
    //     , '	app.record.create.show'
    // ]
    // ボタンインストーラーの初期化
    // const shortcuts: ShortcutDefinitions = (() => {
    //     const conf = conf_manager.get_config(CONSTANTS.BUTTONS) as []
    //     const buttons: Shortcut[] = conf.map((btn) => {
    //         return {
    //             icon: btn['アイコン']
    //             , link: btn['URL']
    //             , tooltip: btn['ツールチップ']
    //         }
    //     })
    //     return {
    //         buttons: buttons
    //     }
    // })()
    // const labelling = conf_manager.get_config(CONSTANTS.LABELING_HEADER) as string
    // const installer = new ButtonInstaller(shortcuts)
    // 一覧表示イベント
    // kintone.events.on(EVENT_INDEX_LIST, (event: KintoneEvent) => {
    //     console.log(event)
    //     const menuElement = kintone.app.getHeaderMenuSpaceElement();  // レコード一覧のメニューの右側の空白部分の要素を取得
    //     return show_launchers(event, menuElement)
    // });
    // // 詳細画面表示イベント
    // kintone.events.on(EVENT_DETAIL_LIST, (event: KintoneEvent) => {
    //     console.log(event)
    //     const menuElement = kintone.app.record.getHeaderMenuSpaceElement();  // レコード一覧のメニューの右側の空白部分の要素を取得
    //     return show_launchers(event, menuElement)
    // });
    // // ルックアップフィールドの編集可能化
    // kintone.events.on(EVENT_EDITABLE_LOOKUP, (event: KintoneEvent) => {
    //     const config = conf_manager.get_config(CONSTANTS.EDITABLE_FIELDS)
    //     console.log({ config })
    //     const modifier = new FieldModifier(config)
    //     return modifier.make_editable(event)
    // })
    // ランチャーの表示
    // const show_launchers = (kintone_event: KintoneEvent, headerSpaceElement: HTMLElement | null) => {
    //     console.log({ headerSpaceElement })
    //     if (headerSpaceElement == undefined || headerSpaceElement == null) {
    //         throw new Error('HeaderSpaceElementが取得できませんでした。')
    //     }
    //     installer.set_canvas(headerSpaceElement)
    //     // キャンバスIDの取得
    //     const off_space_id = conf_manager.get_config(CONSTANTS.ID_PLUGIN_ISLAND) as string
    //     // プラグインキャンバスの設定
    //     if (off_space_id != '') {
    //         const title = CONSTANTS.PLUGIN_NAME
    //         const plugin_canvas = new PluginCanvas(title, off_space_id, headerSpaceElement)
    //         installer.set_canvas(plugin_canvas)
    //     }
    //     installer.install();
    //     return kintone_event;
    // }
})(kintone.$PLUGIN_ID);
//# sourceMappingURL=../../../../../../src/ts/desktop/main.js.map