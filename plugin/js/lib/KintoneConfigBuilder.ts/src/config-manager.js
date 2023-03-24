"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
require("@shin-chan/kypes"); // kintone types
const commonutil_1 = require("commonutil");
const config_utilities_1 = require("./config-utilities");
const config_builder_1 = require("./config-builder");
const common_1 = require("./common");
/**
 * 設定画面のメイン処理
 * 設定値を読み込んで初期化、設定画面の構築、入力の受付を担当
 */
class ConfigManager {
    constructor(PLUGIN_ID, setting_input) {
        this.KEY_CONFIG = 'config';
        this.config = {};
        const CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
        this.set_config(CONF);
        console.log(this.config);
        this.setting_input = setting_input;
    }
    /**
     * 設定画面を構築する。その際にfields APIを呼び出して、アプリのフィールド情報を利用する。
     */
    build() {
        kintone.api('/k/v1/preview/app/form/fields', // 設定中のフィールドも取得できるようにする
        'GET', {
            app: kintone.app.getId()
        }, (resp) => {
            const node_settings = this.make_setting_fields(resp.properties); // 設定フィールド配列
            const btn_submit = this.make_button_submit(); // 適用ボタン
            const btn_cancel = this.make_button_cancel(); // キャンセルボタン
            // トップのフォームノードを構築して配置
            const form_node = (() => {
                const node = commonutil_1.Utils.createElement('form', '', node_settings);
                node.id = 'form_settings';
                return node;
            })();
            // 設定フォームのトップに設置
            const top = document.getElementById('config_body');
            top === null || top === void 0 ? void 0 : top.appendChild(form_node);
            const buttons = commonutil_1.Utils.createElement('div', 'mt-5', [
                btn_cancel,
                btn_submit
            ]);
            top === null || top === void 0 ? void 0 : top.appendChild(buttons);
        }, (err) => {
            throw err;
        });
    }
    /**
     * Settings.input の設定を参照して設定画面のレイアウトを構築する
     * @param builder 設定済みのConfigBuilderインスタンス
     * @returns
     */
    layout_inputs(builder, input) {
        const setting_items = input.map((config) => {
            const paragraph = this.make_paragraph(builder, config);
            return paragraph;
        });
        return setting_items;
    }
    /**
     * Settings.inputの定義をひとつ受け取り、渡された設定項目のDOMを構築して返す
     * @param builder 初期設定済みのConfigBuilder
     * @param config 設定項目の定義
     * @returns
     */
    make_paragraph(builder, config) {
        // TODO: ラジオボタンやドロップダウンもここから構築する
        switch (config.type) {
            case common_1.FieldType.Text:
                if (!('accept' in config)) {
                    throw new Error('プロパティ accept が必要です。config/settings.ts の設定を見直してください。');
                }
                return builder.make_string_block(config);
            case common_1.FieldType.IncrementalTable:
                return builder.make_incremental_table_block(config);
            case common_1.FieldType.Label: // 見出しノード
                return builder.make_subtitle_block(config);
            case common_1.FieldType.Separator: // セパレーターノード
                return commonutil_1.Utils.createElement('div', 'mt-5 bg-info');
            case common_1.FieldType.Dropdown_FieldSelect:
                if (!('accept' in config)) {
                    throw new Error('プロパティ accept が必要です。config/settings.ts の設定を見直してください。');
                }
                return builder.make_dropdown_fieldselect_block(config);
            default:
                throw new Error(`未実装のFieldTypeを要求しています。${config.type} を実装してください。`);
        }
    }
    set_config(CONF) {
        const serialized = commonutil_1.Utils.get_from(CONF, this.KEY_CONFIG, '');
        if (serialized == '') {
            console.info('設定値がありません。初期値で開始します。');
        }
        else {
            this.config = JSON.parse(serialized);
        }
    }
    // プラグイン設定値を取得する(deserializedした辞書を取得できる)
    get_config(key = undefined) {
        if (key == undefined) {
            return this.config; // {[fieldcode:string]: string} の辞書、フィールドコードで引いてラベルを得られる
        }
        if (key in this.config) {
            return this.config[key];
        }
        throw new Error(`未定義または未設定の設定キーが指定されました: [${key}]`);
    }
    /**
     * 設定項目のノード構築と動作設定と表示順序
     * @param props fields.json APIから取得したフィールド情報
     * @returns
     */
    make_setting_fields(props) {
        const builder = new config_builder_1.ConfigBuilder(props, this.config);
        // await builder.load_layout_info()  // スペース情報を取得するために必要
        // レイアウトの構築
        return this.layout_inputs(builder, this.setting_input);
    }
    // CONFに格納する辞書を構築する
    store_parameters() {
        const store = {};
        const this_form = document.getElementById('form_settings');
        if (this_form == null) {
            throw new Error('ERROR: フォーム要素を取得できませんでした。');
        }
        const config_tinker = new config_utilities_1.ConfigUtilities(this_form);
        this.setting_input.forEach((config) => {
            if (config.type == common_1.FieldType.Label || config.type == common_1.FieldType.Separator) {
                // 保存不要なアイテム
                return;
            }
            config = config;
            const code = config.code;
            const required = config.required;
            const selected = config_tinker.get_selected(code, config.type);
            if (selected) {
                store[code] = selected;
            }
            else {
                if (required) {
                    const msg = `必須の設定項目 [${config.label}] が未設定です(${code})`;
                    console.error(msg);
                    throw new Error(msg);
                }
                else {
                    store[code] = '';
                }
            }
        });
        console.log(store);
        return store;
    }
    // 適用ボタン
    make_button_submit() {
        const btn_submit = commonutil_1.Utils.createElement('button', 'kintoneplugin-button-dialog-ok');
        btn_submit.setAttribute('type', 'button');
        btn_submit.textContent = '適用';
        btn_submit.addEventListener('keydown', (event) => {
            if (event.isComposing || event.code == 'Enter') {
                console.info('適用ボタンのenterを無効化しました。');
                return false;
            }
        });
        btn_submit.addEventListener('click', async (event) => {
            event.preventDefault();
            const this_form = document.getElementById('form_settings');
            if (this_form == null) {
                throw 'ERROR: フォーム要素を取得できませんでした。';
            }
            // 設定値を格納する
            try {
                const serialized = JSON.stringify(this.store_parameters());
                const config = {};
                config[this.KEY_CONFIG] = serialized;
                kintone.plugin.app.setConfig(config, function () {
                    alert('プラグイン設定を保存しました。アプリの更新をお忘れなく！');
                    window.location.href = '../../flow?app=' + kintone.app.getId();
                });
            }
            catch (error) {
                alert(`⚠️ ${error}`);
            }
        });
        return btn_submit;
    }
    // キャンセルボタン
    make_button_cancel() {
        const btn_cancel = commonutil_1.Utils.createElement('button', 'js-cancel-button kintoneplugin-button-dialog-cancel');
        btn_cancel.textContent = 'キャンセル';
        btn_cancel.addEventListener('click', function (event) {
            console.log(event);
            window.location.href = '../../' + kintone.app.getId() + '/plugin/';
        });
        return btn_cancel;
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=../../../../../../lib/KintoneConfigBuilder.ts/src/config-manager.js.map