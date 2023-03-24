"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigBuilder = void 0;
require("@shin-chan/kypes"); // kintone types
const commonutil_1 = require("commonutil");
const config_utilities_1 = require("./config-utilities");
const field_builder_1 = require("./field-builder");
/**
 * 設定画面の各要素を構築する
 */
class ConfigBuilder {
    constructor(props, config) {
        this.props = undefined;
        this.layout = undefined;
        this.config = undefined;
        this.props = props;
        this.config = config;
        this.field_builder = new field_builder_1.FieldBuilder(props);
    }
    /**
     * レイアウト情報から取得する必要のある情報かどうかを判定する
     */
    static is_layout_info(type) {
        if (ConfigBuilder.LAYOUT_PARTS.includes(type)) {
            return true;
        }
        return false;
    }
    static is_includes_layout_info(types) {
        const is_includes = types.reduce((prev, curr) => {
            if (ConfigBuilder.is_layout_info(curr)) {
                prev = true;
            }
            return prev;
        }, false);
        return is_includes;
    }
    /**
     * 増減テーブルを構築
     * @param input_field 増減テーブルの定義
     * @param saved_rows  CONFに保存したテーブルの行情報辞書の配列
     * @returns 増減テーブルを格納したtable要素
     */
    build_incremental_table(input_field, saved_rows) {
        console.log({ input_field });
        console.log({ saved_rows });
        let table_rows = [];
        const fieldcode = input_field.code;
        const table_cols = input_field.table_cols; // カラム見出しの辞書
        const spacer_count = table_cols.length - 3;
        if (saved_rows == null || Object.keys(saved_rows).length == 0) {
            // 保存されていない場合は空白の1行を追加する
            table_rows.push(this.build_table_row(table_cols, undefined, spacer_count));
        }
        else {
            // 保存されていた場合は全行を復旧する
            for (const opt of saved_rows) {
                const row = this.build_table_row(table_cols, opt, spacer_count);
                table_rows.push(row);
            }
        }
        const elements_th = table_cols.map((column) => {
            const el_span = commonutil_1.Utils.createElement('span', 'title');
            el_span.textContent = column.header;
            const th = commonutil_1.Utils.createElement('th', 'kintoneplugin-table-th', [el_span]);
            return th;
        });
        elements_th.push(commonutil_1.Utils.createElement('th', 'kintoneplugin-table-th-blankspace'));
        const tr = commonutil_1.Utils.createElement('tr', '', elements_th);
        const thead = commonutil_1.Utils.createElement('thead', '', [tr]);
        const tbody = commonutil_1.Utils.createElement('tbody', '', table_rows);
        const incremental_table = commonutil_1.Utils.createElement('table', 'kintoneplugin-table ms-0', [thead, tbody], '', {
            'id': `table-${fieldcode}`
        });
        return incremental_table;
    }
    /**
     * 設定テーブルの1行を構築する。ここではヘッダは構築しない。
     * @param table_cols  カラムの見出しとセルのFieldStyleの辞書配列
     * @param saved_data    保存された値、初期値はundefined
     * @param spacer_cols   スペーサーをどこに入れるか？
     * @returns
     */
    build_table_row(table_cols, saved_data = undefined, spacer_cols = 0) {
        // 行を構築
        console.log({ table_cols });
        console.log({ saved_data });
        const built_row = [];
        for (let index = 0; index < table_cols.length; index++) {
            const column = table_cols[index];
            // const type = column.type        // FieldType
            const value = saved_data == undefined ? undefined : saved_data[column.header];
            console.log({ value });
            const input_field = this.field_builder.build_field(column, value);
            built_row.push(commonutil_1.Utils.ce('td', '', [
                commonutil_1.Utils.ce('div', 'kintoneplugin-table-td-control', [
                    commonutil_1.Utils.ce('div', 'kintoneplugin-table-td-control-value', [
                        input_field
                    ])
                ])
            ]));
        }
        // [+]ボタン
        const node_button_add = this.create_button_row_add(table_cols);
        // [-]ボタン
        const node_button_remove = ConfigBuilder.create_button_row_remove();
        // スペーサー
        console.log({ spacer_cols });
        spacer_cols = spacer_cols < 0 ? 0 : spacer_cols;
        const spacers = [...Array(spacer_cols)].map(() => {
            return commonutil_1.Utils.createElement('td', 'td_spacer');
        });
        // 一行分を構築
        const tds = [
            ...built_row,
            ...spacers,
            commonutil_1.Utils.createElement('td', 'kintoneplugin-table-td-operation', [
                node_button_add,
                node_button_remove
            ])
        ];
        const table_row = commonutil_1.Utils.createElement('tr', '', tds);
        return table_row;
    }
    // 祖父要素を取得する
    static get_grand_tr(target) {
        if (target == null) {
            throw 'ERROR: nullが渡されたため祖父要素を取得できません';
        }
        const self = target;
        const parent_td = self === null || self === void 0 ? void 0 : self.parentNode;
        const grand_tr = parent_td === null || parent_td === void 0 ? void 0 : parent_td.parentNode;
        return grand_tr;
    }
    /**
     * プルダウンテーブルの[+]ボタンを生成する
     * @param table_cols プルダウンの選択肢として並べるフィールド一覧
     * @param classname_select_element 追加する行のプルダウンフィールドに与えるクラス名
     * @returns
     */
    // static create_button_row_add(fields: { [key: string]: DropdownData }, classname_select_element: string): HTMLButtonElement {
    create_button_row_add(table_cols) {
        const node_button_add = document.createElement('button');
        node_button_add.className = 'kintoneplugin-button-add-row-image';
        node_button_add.setAttribute('type', 'button');
        node_button_add.setAttribute('title', 'Add row');
        node_button_add.addEventListener('click', (event) => {
            // テーブルを一行追加する
            console.log(`テーブルを一行追加する${event}`);
            const grand_tr = ConfigBuilder.get_grand_tr(event.target);
            const ancestor_tbody = grand_tr === null || grand_tr === void 0 ? void 0 : grand_tr.parentNode;
            // const ancestor_tbody = self.closest('tbody')
            if (grand_tr == null || ancestor_tbody == null) {
                throw 'ERROR: 祖先のtbodyを取得できませんでした。';
            }
            const target = event === null || event === void 0 ? void 0 : event.target;
            if (target == null) {
                return;
            }
            const spacer_count = grand_tr.children.length - 1 - table_cols.length; // 列数 - プラマイボタン - デフォルト列数
            const add_elem = this.build_table_row(table_cols, undefined, spacer_count);
            ancestor_tbody.insertBefore(add_elem, grand_tr.nextElementSibling);
        });
        return node_button_add;
    }
    // プルダウンテーブルの[-]ボタンを生成する
    static create_button_row_remove() {
        const node_button_remove = document.createElement('button');
        node_button_remove.className = 'kintoneplugin-button-remove-row-image';
        node_button_remove.setAttribute('type', 'button');
        node_button_remove.setAttribute('title', 'Delete this row');
        node_button_remove.addEventListener('click', (event) => {
            var _a, _b;
            const grand_tr = ConfigBuilder.get_grand_tr(event.target);
            if (((_a = grand_tr.parentNode) === null || _a === void 0 ? void 0 : _a.childNodes.length) == 1) {
                return;
            }
            (_b = grand_tr.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(grand_tr);
            // テーブルを一行削除する
            console.log(`テーブルを一行削除する${event}`);
        });
        return node_button_remove;
    }
    /**
     * fields APIの返り値を使ってフィールド部品の一覧を構築する
     * @param props props resp.properties を渡す
     * @param accept_types リストにしたいフィールドタイプの配列を渡す。ex. ['SINGLE_LINE_TEXT', 'LINK']
     * @returns
     */
    static get_formparts(props, accept_types = []) {
        const lists = {};
        for (const key in props) {
            if (!props.hasOwnProperty(key)) {
                continue;
            }
            const prop = props[key];
            const label = prop.label;
            const code = prop.code;
            const type = prop.type;
            if (accept_types.includes(type)) {
                lists[code] = {
                    'code': code,
                    'label': label,
                    'option': type
                };
            }
        }
        const array = Object.keys(lists).map((k) => ({
            key: k, value: lists[k]
        }));
        // フィールドラベルでソート
        const sorted = array.sort((a, b) => {
            const str_a = a.value.label.toString().toLowerCase();
            const str_b = b.value.label.toString().toLowerCase();
            if (str_a < str_b)
                return -1;
            else if (a > b)
                return 1;
            return 0;
        });
        const sorted_dic = Object.assign({}, ...sorted.map((item) => ({
            [item.key]: item.value,
        })));
        return sorted_dic;
    }
    // 設定テーブルの行に対して、プルダウン変更で発火するChangeイベントを追加する
    static addOnChangeEvent(select_set) {
        for (const select of select_set) {
            select.addEventListener('change', (event) => {
                const target = event.target;
                if (target == null) {
                    return;
                }
                const selected = target[target.selectedIndex];
                // const label = selected.label
                let option = selected.getAttribute('option');
                if (option == null) {
                    option = "";
                }
                let code = selected.getAttribute('code');
                if (code == null) {
                    code = "";
                }
                const ancestor = target.closest('tr'); // 祖先TR要素
                console.log(ancestor);
                if (ancestor == null) {
                    return;
                }
                const inputs = ancestor.getElementsByTagName('input');
                inputs[0].value = option;
                inputs[1].value = code;
            });
        }
    }
    /**
     * フィールド選択ドロップダウンを構築する
     * @param props fields.jsonのレスポンスのproperties
     * @param accepts 列挙対象とするフィールドタイプ
     * @param selected_fieldcode 選択済みとしたいフィールドコード（省略可）
     * @param selected_node_id ドロップダウンのノードID（省略可）
     * @param empty_label 空の選択肢を追加する場合はラベル文字列を指定する nullのときは追加しない
     * @returns
     */
    static build_fields_dropdown(props, accepts, selected_fieldcode = "", selected_node_id = "", empty_label = null) {
        const parts = ConfigBuilder.get_formparts(props, accepts);
        const field_dropdown = commonutil_1.Utils.createElement('select', 'select-kintone-field');
        field_dropdown.id = selected_node_id;
        if (empty_label != null) {
            const empty_item = commonutil_1.Utils.createElement('option');
            empty_item.label = empty_label;
            field_dropdown.appendChild(empty_item);
        }
        for (const code in parts) {
            const prop = parts[code];
            const item = commonutil_1.Utils.createElement('option');
            item.setAttribute('fieldcode', code);
            item.label = prop.label;
            if (code == selected_fieldcode) {
                item.setAttribute('selected', '');
            }
            field_dropdown.appendChild(item);
        }
        return commonutil_1.Utils.createElement('div', '', [
            commonutil_1.Utils.createElement('div', "kintoneplugin-select-outer", [
                commonutil_1.Utils.createElement('div', 'kintoneplugin-select', [field_dropdown])
            ])
        ]);
    }
    /**
     * fields.json APIを呼び出して、別アプリのフィールド選択ドロップダウンを構築する
     * @param app_id 別アプリのアプリID
     * @param accepts 列挙対象とするフィールドタイプ
     * @param selected_label 選択済みとしたいフィールドラベル（省略可）
     * @param selected_node_id ドロップダウンのノードID（省略可）
     * @param empty_label 空の選択肢を追加する場合はラベル文字列を指定する nullのときは追加しない
     * @returns
     */
    static async build_fields_dropdown_other_app(app_id, accepts, selected_label = "", selected_node_id = "", empty_label = null) {
        // app_idが未指定の場合は空のドロップダウンを配置する
        if (app_id == undefined || app_id == config_utilities_1.ConfigUtilities.DEFAULT_OPTION) {
            const empty_dropdown = commonutil_1.Utils.createElement('select', 'select-kintone-field');
            empty_dropdown.id = selected_node_id;
            if (empty_label != null) {
                const empty_item = commonutil_1.Utils.createElement('option');
                empty_item.label = empty_label;
                empty_dropdown.appendChild(empty_item);
            }
            return commonutil_1.Utils.createElement('div', '', [
                commonutil_1.Utils.createElement('div', "kintoneplugin-select-outer", [
                    commonutil_1.Utils.createElement('div', 'kintoneplugin-select', [empty_dropdown])
                ])
            ]);
        }
        const resp_fields = await kintone.api('/k/v1/app/form/fields', 'GET', {
            app: parseInt(app_id)
        });
        return this.build_fields_dropdown(resp_fields.properties, accepts, selected_label, selected_node_id, empty_label);
    }
    /**
     * 指定したノードを子ノードとして、タイトルとコメントを付与したブロックを構築する
     * @param main_node 修飾したいパーツを含むノード
     * @param title ブロックにつけるタイトル文字列
     * @param comment ブロックにつけるコメント文字列
     * @param block_class ブロックのクラスを指定する（省略可）
     * @returns
     */
    static make_parts_block(main_node, title, comment, block_class = "") {
        const comment_node = commonutil_1.Utils.createElement('div');
        comment_node.textContent = comment;
        comment_node.classList.add('mb-1');
        const caption_node = commonutil_1.Utils.createElement('div', 'h5', []);
        caption_node.textContent = title;
        const block = commonutil_1.Utils.createElement('div', block_class, [
            caption_node,
            comment_node,
            main_node
        ]);
        block.classList.add('ms-4');
        block.classList.add('mt-2');
        return block;
    }
    // テーブルセル内にドロップダウンを追加し、ドロップダウンの選択結果をテーブル行内の別セルに書き込む
    static addFieldSelectEvent(parent_dropdown, parent_fieldcode, appid, selected_fieldcode = undefined) {
        kintone.api('/k/v1/app/form/fields', 'GET', {
            app: appid
        }).then((resp_fields) => {
            var _a, _b;
            const fields = Object.keys(resp_fields.properties).map((prop) => {
                return resp_fields.properties[prop];
            });
            // テーブル業内ドロップダウン（子）の選択肢
            const single_line_items = fields.filter((prop) => {
                return prop.type == 'SINGLE_LINE_TEXT';
            }).map((field) => {
                return {
                    'code': field.code,
                    'label': field.label,
                    'option': field.type
                };
            }).map((dd_item) => {
                const item = commonutil_1.Utils.createElement('option', '');
                item.label = dd_item.label;
                item.setAttribute('code', dd_item.code);
                item.setAttribute('option', dd_item.option);
                if (dd_item.code == selected_fieldcode) {
                    item.setAttribute('selected', '');
                }
                return item;
            });
            // テーブル行内ドロップダウン（子）とその選択イベント
            const select = commonutil_1.Utils.createElement('select', `select-kintone-field`, single_line_items);
            select.addEventListener('change', (event) => {
                var _a;
                console.log({ event });
                const target = event.target;
                if (target == null) {
                    return;
                }
                const selected = target[target.selectedIndex];
                const td_fieldcode = make_fieldcode_cell(selected);
                (_a = parent_fieldcode.firstChild) === null || _a === void 0 ? void 0 : _a.remove();
                parent_fieldcode.appendChild(td_fieldcode);
            });
            // SELECTEDなOption要素を受け取って、対応するattributeのinput要素を構築する
            const make_fieldcode_cell = (selected) => {
                let fieldcode;
                if (selected) {
                    fieldcode = selected.getAttribute('code');
                    if (fieldcode == null) {
                        fieldcode = "";
                    }
                }
                else {
                    fieldcode = "";
                }
                const node_input = commonutil_1.Utils.createElement('input', 'kintoneplugin-input-text', []);
                node_input.setAttribute('value', fieldcode);
                node_input.setAttribute('disabled', '');
                const el_td = commonutil_1.Utils.createElement('td', 'kintoneplugin-table-td-control', [
                    commonutil_1.Utils.createElement('div', 'kintoneplugin-table-td-control-value', [
                        commonutil_1.Utils.createElement('div', 'kintoneplugin-input-outer', [
                            node_input
                        ])
                    ])
                ]);
                return el_td;
            };
            // ドロップダウンの追加
            const node_dropdown = commonutil_1.Utils.createElement('div', 'kintoneplugin-table-td-control-value', [
                commonutil_1.Utils.createElement('div', "kintoneplugin-select-outer", [
                    commonutil_1.Utils.createElement('div', 'kintoneplugin-select', [select])
                ])
            ]);
            (_a = parent_dropdown.firstChild) === null || _a === void 0 ? void 0 : _a.remove();
            parent_dropdown.appendChild(node_dropdown);
            // 追加したドロップダウンに対応するフィールドコードを4列目に書き込む
            (_b = parent_fieldcode.firstChild) === null || _b === void 0 ? void 0 : _b.remove();
            const selected = select.item(select.selectedIndex);
            const td_fieldcode = make_fieldcode_cell(selected);
            parent_fieldcode.appendChild(td_fieldcode);
        });
    }
    // ラジオボタンを選択したときに発火するイベントを登録する
    static set_switch_event(node_radio, event_type, callback_object) {
        const input_radios = node_radio.querySelectorAll('input[type="radio"]');
        input_radios.forEach((input) => {
            input.addEventListener(event_type, callback_object);
        });
    }
    /**
     * 一行テキスト入力ブロックを構築する
     * @param input_field 設定項目の定義
     * @returns
     */
    make_string_block(input_field) {
        if (this.config == undefined || this.props == undefined) {
            throw new Error('インスタンスが初期化されていません');
        }
        const fieldcode = input_field.code;
        let saved_value = this.config[fieldcode];
        if (saved_value == undefined) {
            saved_value = "";
        }
        console.log({ saved_value });
        const id = `string-${fieldcode}`;
        const el_str = commonutil_1.Utils.createElement('div', 'kintoneplugin-input-outer', [
            commonutil_1.Utils.ce('input', 'kintoneplugin-input-text', [], '', {
                'type': 'text',
                'id': id,
                'value': saved_value
            })
        ]);
        const node_block = ConfigBuilder.make_parts_block(el_str, input_field.label, input_field.desc);
        return node_block;
    }
    // ラジオボタンを構築する
    make_radio_block(input_field, block_class = "") {
        if (this.config == undefined || this.props == undefined) {
            throw new Error('インスタンスが初期化されていません');
        }
        const fieldcode = input_field.code;
        const saved_string = this.config[fieldcode];
        const el_options = input_field.accept.map((label) => {
            const id = `radio-${fieldcode}-${label}`;
            const name = `radio-${fieldcode}`;
            const el_radio = commonutil_1.Utils.createElement('input');
            el_radio.setAttribute('type', 'radio');
            el_radio.setAttribute('name', name);
            el_radio.setAttribute('value', label);
            el_radio.setAttribute('id', id);
            if (label == saved_string) {
                el_radio.setAttribute('checked', 'checked');
            }
            const el_label = commonutil_1.Utils.createElement('label', '', [], label);
            el_label.setAttribute('for', id);
            return commonutil_1.Utils.createElement('span', 'kintoneplugin-input-radio-item', [el_radio, el_label]);
        });
        const el_radio = commonutil_1.Utils.createElement('div', 'kintoneplugin-input-radio', el_options);
        el_radio.id = fieldcode;
        const node_block = ConfigBuilder.make_parts_block(el_radio, input_field.label, input_field.desc, block_class);
        return node_block;
    }
    /**
     * ドロップダウン形式でフィールドを選択できる設定項目用HTMLノードを構築して返す
     * @param fieldcode フォームに指定するフィールドコード、保存値もこのコードで読み込む
     * @param empty_label 選択肢のデフォルト値を指定する、 nullの場合は選択必須のドロップダウンとなる
     * @param block_class ブロック全体に与えるクラス、省略可
     * @returns
     */
    make_dropdown_fieldselect_block(input_field, empty_label = null, block_class = "") {
        const form_types = [];
        const layout_types = [];
        input_field.accept.forEach((type) => {
            if (ConfigBuilder.is_layout_info(type)) {
                layout_types.push(type);
            }
            else {
                form_types.push(type);
            }
        });
        if (this.config == undefined || this.props == undefined) {
            throw new Error('インスタンスが初期化されていません');
        }
        if (layout_types.length > 0 && this.layout == undefined) {
            throw new Error('レイアウト情報をロードしていません。load_layout_info() を事前に呼び出してください。');
        }
        if (layout_types.length > 0 && form_types.length > 0) {
            throw new Error('フォーム情報のフィールドとレイアウト情報のフィールドとが混在したドロップダウンは構築できません。');
        }
        const fieldcode = input_field.code;
        const saved_string = this.config[fieldcode];
        let node_dropdown;
        if (form_types.length > 0) { // フォーム情報の取得（通常のフィールド）
            node_dropdown = ConfigBuilder.build_fields_dropdown(this.props, form_types, saved_string, fieldcode, empty_label);
        }
        else if (layout_types.length > 0) { // レイアウト情報の取得（主にスペーサー）
            node_dropdown = ConfigBuilder.build_fields_dropdown(this.layout, layout_types, saved_string, fieldcode, empty_label);
        }
        else {
            throw new Error('フォーム情報またはレイアウト情報が空欄で呼び出されました');
        }
        const node_block = ConfigBuilder.make_parts_block(node_dropdown, input_field.label, input_field.desc, block_class);
        return node_block;
    }
    make_incremental_table_block(input_field) {
        if (this.config == undefined || this.props == undefined) {
            throw new Error('インスタンスが初期化されていません');
        }
        const fieldcode = input_field.code;
        const saved_rows = this.config[fieldcode];
        console.log(saved_rows);
        const el_table = this.build_incremental_table(input_field, saved_rows);
        const node_block = ConfigBuilder.make_parts_block(el_table, input_field.label, input_field.desc);
        return node_block;
    }
    /**
     * 見出しノードを含むブロックを構築して返す
     * @param input_field 見出しノード用の設定アイテム
     * @returns
     */
    make_subtitle_block(input_field) {
        const class_heading = 'display-6 mb-3';
        const heading = commonutil_1.Utils.ce('div', class_heading, [], input_field.label);
        const desc = commonutil_1.Utils.ce('div', 'ms-4 mt-2 mb-5', [], input_field.desc);
        return commonutil_1.Utils.createElement('div', '', [
            heading, desc
        ]);
    }
}
exports.ConfigBuilder = ConfigBuilder;
ConfigBuilder.LAYOUT_PARTS = ["SPACER"]; // kintoneアプリのレイアウト情報から取得するフィールドタイプ
//# sourceMappingURL=../../../../../../lib/KintoneConfigBuilder.ts/src/config-builder.js.map