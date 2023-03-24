"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    /**
     * 重複禁止フィールドだけをピックアップする
     * @param properties fields.jsonのレスポンスのproperties
     * @param with_record_number RECORD_NUMBERフィールドを返すフラグ
     */
    static unique_properties(props, with_record_number = false) {
        const results = [];
        for (const fieldcode of Object.keys(props)) {
            const prop = props[fieldcode];
            if (prop.unique == true) {
                results.push(prop);
            }
            else if (with_record_number && prop['type'] == 'RECORD_NUMBER') {
                results.push(prop);
            }
        }
        return results;
    }
    // 空文字列ではないことをチェックする
    static is_not_empty_string(test_str) {
        return !Utils.is_empty_string(test_str);
    }
    // 空文字列であることをチェックする
    static is_empty_string(test_str) {
        if (test_str == null || test_str == undefined) {
            return true;
        }
        if (test_str.length > 0) {
            return false;
        }
        return true;
    }
    /**
     * kintoneのメニューアイコン風にスタイルを付与する
     * @param el 装飾対象のノード
     */
    static decorate_menu_icon(el) {
        el.style.height = '48px';
        el.style.backgroundColor = '#f7f9fa';
        el.style.fontSize = '28px';
        el.style.border = '1px solid #e3e7e8';
        el.style.display = 'inline';
        el.style.marginLeft = '2px';
        el.style.marginRight = '2px';
        el.style.verticalAlign = 'middle';
        return el;
    }
    // 現在開いているkintoneドメインのうち指定した番号のアプリのURLを構築して返す
    static get_application_url(appid) {
        return `${location.protocol}//${location.host}/k/${appid}`;
    }
    // kintone clientのエラーを受け取ってメッセージを抽出し、文字列配列の形で返す
    static retrieve_errors(error, max_msgs = -1) {
        var _b;
        const errors = (_b = error === null || error === void 0 ? void 0 : error.error) === null || _b === void 0 ? void 0 : _b.errors;
        if (errors == undefined) {
            return undefined;
        }
        // メッセージの構築
        let whole_errors = [];
        Object.keys(errors).forEach((field) => {
            const msgs = errors[field].messages;
            const comments = msgs.map((msg) => {
                return `[${field}] ${msg}`;
            });
            whole_errors = whole_errors.concat(comments);
        });
        // ソート
        whole_errors.sort();
        // エラーレコードの件数が多い場合に省略
        if (max_msgs >= 0 && max_msgs < whole_errors.length) {
            const remain_msgs = whole_errors.length - max_msgs;
            whole_errors = whole_errors.splice(0, max_msgs);
            whole_errors.push(`以下${remain_msgs}件のエラーメッセージを省略しました。`);
        }
        return whole_errors;
    }
}
exports.Utils = Utils;
_a = Utils;
// 設定値またはデフォルト値を取得
Utils.get_from = (dic, conf_key, defaults) => {
    if (dic.hasOwnProperty(conf_key)) {
        return dic[conf_key];
    }
    return defaults;
};
// ノードを構築して返す
Utils.createElement = (tagName, className = "", childElements = [], textContent = "", attrs = undefined) => {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = textContent;
    if (childElements.length > 0) {
        childElements.forEach((child) => {
            el.appendChild(child);
        });
    }
    // 属性値をセット
    if (attrs) {
        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    return el;
};
// shotcut for createElement
Utils.ce = (t, c = "", ce = [], tc = "", at = undefined) => {
    return _a.createElement(t, c, ce, tc, at);
};
/**
 * テキストだけを持ったDIV要素を構築して返す
 * @param msg innerText
 * @returns
 */
Utils.simpleDiv = (msg) => {
    return Utils.createElement('div', '', [], msg);
};
// 配列のうち、重複したものがあればTrueを返す
Utils.is_overlapped = (list) => {
    const overlapped = Utils.overlapped(list);
    if (overlapped.length > 0) {
        return true;
    }
    return false;
};
// 配列のうち、重複したものをUniqして返す
Utils.overlapped = (list) => {
    const overlapped = list.filter((x, _i, self) => {
        return self.indexOf(x) !== self.lastIndexOf(x);
    });
    return Array.from(new Set(overlapped));
};
//# sourceMappingURL=../../../../../../lib/KintoneCommonUtils.ts/src/utils.js.map