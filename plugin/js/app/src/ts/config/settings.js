"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const plugin_parameters_helper_1 = require("plugin-parameters-helper");
const constants_1 = require("../constants");
// 設定項目に関する設定、デスクトップ側からも参照する。
class Settings {
}
exports.Settings = Settings;
// 設定項目の定義
Settings.input = [
    {
        'label': '集計表の作成',
        'desc': '集計表の仕分け項目と集計項目を選び、集計表を構築します。',
        'code': constants_1.CONSTANTS.DIGESTS_TABLE,
        'type': plugin_parameters_helper_1.FieldType.IncrementalTable,
        'table_cols': [
            {
                'header': '集計表の見出し',
                'type': plugin_parameters_helper_1.FieldType.Text
            },
            {
                'header': '仕分けフィールド[択一]',
                'type': plugin_parameters_helper_1.FieldType.Dropdown_FieldSelect,
                'accept': ['RADIO_BUTTON', 'DROP_DOWN']
            },
            {
                'header': '集計対象フィールド[数値]',
                'type': plugin_parameters_helper_1.FieldType.Dropdown_FieldSelect,
                'accept': ['NUMBER']
            }
        ],
        'required': true
    }
];
//# sourceMappingURL=../../../../../../src/ts/config/settings.js.map