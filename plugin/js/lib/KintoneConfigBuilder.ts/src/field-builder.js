"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldBuilder = void 0;
const commonutil_1 = require("commonutil");
const common_1 = require("./common");
const config_builder_1 = require("./config-builder");
class FieldBuilder {
    constructor(props, empty_label = '----') {
        this.build_textfield = (preset) => {
            preset = preset === undefined ? '' : preset;
            return commonutil_1.Utils.createElement('div', 'kintoneplugin-input-outer', [
                commonutil_1.Utils.createElement('input', 'kintoneplugin-input-text', [], undefined, {
                    'type': 'text',
                    'value': preset
                })
            ]);
        };
        this.build_dropdown = (preset, column) => {
            if (column == undefined || !('accept' in column)) {
                throw new Error('選択肢情報としてundefinedが渡されました。');
            }
            preset = preset === undefined ? '' : preset;
            // static build_fields_dropdown(
            //     props: any
            //     , accepts: string[]
            //     , selected_fieldcode: string = ""
            //     , selected_node_id = ""
            //     , empty_label: string | null = null
            // ) {
            const field_dropdown = commonutil_1.Utils.createElement('select', 'select-kintone-field');
            if (column.empty_label != null) {
                const empty_item = commonutil_1.Utils.createElement('option');
                empty_item.label = column.empty_label;
                field_dropdown.appendChild(empty_item);
            }
            column.accept.forEach((label) => {
                const item = commonutil_1.Utils.createElement('option');
                item.label = label;
                if (label == preset) {
                    item.setAttribute('selected', '');
                }
                field_dropdown.appendChild(item);
            });
            return commonutil_1.Utils.createElement('div', '', [
                commonutil_1.Utils.createElement('div', "kintoneplugin-select-outer", [
                    commonutil_1.Utils.createElement('div', 'kintoneplugin-select', [field_dropdown])
                ])
            ]);
        };
        /**
         *
         * @param preset 保存済み設定情報
         * @param column フィールド選択ドロップダウンの選択肢として列挙したいフィールドの型情報を含むデータ
         */
        this.build_dropdown_fieldselect = (preset, column) => {
            if (column == undefined || !('accept' in column)) {
                throw new Error('選択肢情報としてundefinedが渡されました。');
            }
            const parts = config_builder_1.ConfigBuilder.get_formparts(this.props, column.accept);
            const field_dropdown = commonutil_1.Utils.createElement('select', 'select-kintone-field');
            field_dropdown.id = preset === undefined ? '' : preset;
            // 未選択アイテム（初期値）を作成
            const empty_item = commonutil_1.Utils.createElement('option');
            empty_item.label = this.empty_label;
            field_dropdown.appendChild(empty_item);
            for (const code in parts) {
                const prop = parts[code];
                const item = commonutil_1.Utils.createElement('option');
                item.setAttribute('fieldcode', code);
                item.label = prop.label;
                if (code == preset) {
                    item.setAttribute('selected', '');
                }
                field_dropdown.appendChild(item);
            }
            return commonutil_1.Utils.createElement('div', '', [
                commonutil_1.Utils.createElement('div', "kintoneplugin-select-outer", [
                    commonutil_1.Utils.createElement('div', 'kintoneplugin-select', [field_dropdown])
                ])
            ]);
        };
        this.props = props;
        this.empty_label = empty_label;
    }
    // FieldTypeに合わせたセルを構築して返す
    // TODO: テキストフィールド以外を追加実装する
    // 追加実装した場合は、あわせて ConfigUtilities.get_selected()にも保存処理の実装が必要です。
    //  ConfigManager.make_paragraph() からも定義してください。
    build_field(column, value) {
        switch (column.type) {
            case common_1.FieldType.Text:
                return this.build_textfield(value);
            case common_1.FieldType.Dropdown:
                if (!('accept' in column)) {
                    throw new Error('不正な型が渡されました。');
                }
                return this.build_dropdown(value, column);
            case common_1.FieldType.Dropdown_FieldSelect:
                if (!('accept' in column)) {
                    throw new Error('不正な型が渡されました。');
                }
                return this.build_dropdown_fieldselect(value, column);
            default:
                throw new Error(`未定義のFieldTypeが渡されました。FieldTypeに${column.type} を実装してください。`);
        }
    }
}
exports.FieldBuilder = FieldBuilder;
//# sourceMappingURL=../../../../../../lib/KintoneConfigBuilder.ts/src/field-builder.js.map