"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigUtilities = void 0;
const commonutil_1 = require("commonutil");
// import { Constants } from "../constants";
const common_1 = require("./common");
/**
 * 設定画面の共通処理
 */
class ConfigUtilities {
    constructor(config_form) {
        this.add_selected_field_codes = (code) => {
            this.whole_selected_field_codes.push(code);
        };
        /**
         * ドロップダウン要素から選択しているフィールドのフィールドコードを取得する
         * @param select_node_id 選択したフィールドのフィールドコード
         * @returns
         */
        this.get_selected_fieldcode = (select_node_id) => {
            console.log(`[ConfigTinker] get_selected_fieldcode(): ${select_node_id}`);
            const node = document.getElementById(select_node_id);
            if (node.selectedIndex == -1) { // 選択されていない
                return '';
            }
            else if (node.options[node.selectedIndex].label == ConfigUtilities.DEFAULT_OPTION) { // デフォルト値（空欄）が選択されている
                return '';
            }
            const code = node.selectedOptions[0].getAttribute('fieldcode');
            if (code == null) {
                throw new Error(`ノード[ ${select_node_id} ]はフィールド選択ではありません。`);
            }
            return code;
        };
        /**
         * ドロップダウン要素から選択文字列を取得する
         * @param select_node_id ドロップダウンのID
         * @returns
         */
        this.get_selected_label = (select_node_id) => {
            console.log(`[ConfigTinker] get_selected_label(): ${select_node_id}`);
            const node = document.getElementById(select_node_id);
            if (node.selectedIndex == -1) {
                return '';
            }
            return node.selectedOptions[0].label;
        };
        this.config_form = config_form;
        // フィールドの重複チェック
        this.whole_selected_field_codes = [];
    }
    // プルダウンで選択済みのフィールドに重複がないかチェックする
    is_overlapped(additional_labels) {
        return commonutil_1.Utils.is_overlapped(this.overlapped(additional_labels));
    }
    overlapped(additional_labels = undefined) {
        if (additional_labels != undefined) {
            this.whole_selected_field_codes.concat(additional_labels);
        }
        return commonutil_1.Utils.overlapped(this.whole_selected_field_codes);
    }
    clear_selected_field_labels() {
        this.whole_selected_field_codes = [];
    }
    /**
     * ラジオボタン要素から選択文字列を取得する
     * @param select_node_id ラジオボタンのName
     * @returns
     */
    get_selected_radio(radio_id) {
        const radio_name = `radio-${radio_id}`;
        console.log(`[ConfigTinker] get_selected_radio(): ${radio_name}`);
        const nodes = document.getElementsByName(radio_name);
        const length = nodes.length;
        for (let idx = 0; idx < length; idx++) {
            const node_input = nodes[idx];
            if (node_input.checked == true) {
                return node_input.value;
            }
        }
        return "";
    }
    /**
     * テキスト入力要素から入力文字列を取得する
     * @param select_node_id テキスト入力のName
     * @returns
     */
    get_string_value(fieldcode) {
        const field_id = `string-${fieldcode}`;
        console.log(`[ConfigTinker] get_text_value(): ${field_id}`);
        const node_input = document.getElementById(field_id);
        return node_input.value;
    }
    /**
     * インクリメンタルテーブルのfieldcodeを指定してinput要素の値だけを抜き出した配列を構築する
     * @param fieldcode テーブル要素のフィールドコード
     * @returns
     */
    get_incremental_table_values(fieldcode) {
        const field_id = `table-${fieldcode}`;
        const node_table = document.getElementById(field_id);
        console.log(field_id);
        console.log(node_table);
        if (node_table == null) {
            throw new Error(`指定したテーブルが見つかりません。(id: ${field_id})`);
        }
        return this.abstruct_from_incremental_table(node_table);
    }
    /**
     * インクリメンタルテーブルからinput要素の値だけを抜き出した配列を構築する
     * @param node_table インクリメンタルテーブルのDOM
     * @returns
     */
    abstruct_from_incremental_table(node_table) {
        const whole_headers = Array.from(node_table.rows).filter((row) => {
            var _a;
            return ((_a = row.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName) == "TH"; // ヘッダ行を取り出す
        }).map((row) => {
            const texts = Array.from(row.cells).filter((cell) => {
                return cell.innerText != "";
            }).map((cell) => {
                return cell.innerText;
            });
            console.log(texts);
            return texts;
        });
        const headers = whole_headers[0];
        console.log({ headers });
        const values = Array.from(node_table.rows).filter((row) => {
            var _a;
            return ((_a = row.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName) != "TH"; // ヘッダ行を除く
        }).map((row) => {
            const cells = Array.from(row.cells).filter((cell) => {
                const input_element = cell.getElementsByClassName('kintoneplugin-input-text')[0];
                const selected_element = cell.getElementsByClassName('select-kintone-field')[0];
                return input_element !== undefined || selected_element !== undefined;
            }).map((cell) => {
                const input_element = cell.getElementsByClassName('kintoneplugin-input-text')[0];
                console.log({ input_element });
                if (input_element != null) {
                    return input_element.value;
                }
                const selected_element = cell.getElementsByClassName('select-kintone-field')[0];
                console.log({ selected_element });
                if (selected_element != null) {
                    const index = selected_element.selectedIndex;
                    console.log({ index });
                    const option = selected_element[index];
                    if ('fieldcode' in selected_element[index].attributes) {
                        console.log(`selected_element fieldcode: ${option.getAttribute('fieldcode')}`);
                        const fieldcode = option.getAttribute('fieldcode');
                        if (fieldcode != null) {
                            return fieldcode;
                        }
                    }
                    return selected_element[index].label;
                }
                throw new Error(`未対応のテーブルセル ${row} が渡されました。`);
            });
            return cells;
        });
        console.log({ values }); // string[][]
        const filtered = values.filter((row) => {
            return row.length > 0;
        }).filter((row) => {
            return row.filter((cell) => {
                return cell.length > 0;
            }).length > 0;
        });
        console.log(filtered);
        if (filtered.length == 0) {
            return null;
        }
        // headeresとvaluesで辞書を構築して返す。
        // const keys = ['a', 'b', 'c'];
        // const values = [1, 2, 3];
        const table_values = values.map((value) => {
            return value.reduce((prev, cell, index) => {
                prev[headers[index]] = cell;
                return prev;
            }, {});
        });
        console.log({ table_values });
        return table_values;
    }
    // FieldTypeを受け取って適切な値を返す
    get_selected(node_id, field_type) {
        switch (field_type) {
            case common_1.FieldType.Dropdown:
                return this.get_selected_label(node_id);
            case common_1.FieldType.Radio:
                return this.get_selected_radio(node_id);
            case common_1.FieldType.Dropdown_FieldSelect:
                return this.get_selected_fieldcode(node_id);
            case common_1.FieldType.Text:
                return this.get_string_value(node_id);
            case common_1.FieldType.IncrementalTable:
                return this.get_incremental_table_values(node_id);
        }
        throw new Error(`get_selected(): 不明なフィールドタイプが渡されました (field_type: ${field_type})`);
    }
}
exports.ConfigUtilities = ConfigUtilities;
ConfigUtilities.DEFAULT_OPTION = '----'; // 未選択状態を表す文字列
//# sourceMappingURL=../../../../../../lib/KintoneConfigBuilder.ts/src/config-utilities.js.map