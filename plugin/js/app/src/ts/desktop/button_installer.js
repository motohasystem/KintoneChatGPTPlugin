"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonInstaller = void 0;
const commonutil_1 = require("commonutil");
class ButtonInstaller {
    constructor(buttons) {
        this.class_sort_order = 'icon-sort-ordering';
        this.class_hms_button = 'button-hms-items';
        this.definitions = buttons;
    }
    install() {
        if (this.already_installed()) {
            return;
        }
        const buttons = this.create_buttons();
        this.put_buttons(buttons);
    }
    set_canvas(canvas) {
        this.canvas = canvas;
    }
    get_hms() {
        const hms = kintone.app.getHeaderMenuSpaceElement();
        if (hms == undefined) {
            const msg = 'ボタン配置スペースが取得できませんでした。';
            console.error(msg);
            throw new Error(msg);
        }
        return hms;
    }
    already_installed() {
        const hms_buttons = document.getElementsByClassName(this.class_hms_button);
        if (hms_buttons.length > 0) {
            return true;
        }
        return false;
    }
    put_buttons(buttons) {
        const hms = this.canvas === undefined ? this.get_hms() : this.canvas;
        buttons.forEach((btn) => {
            console.log(hms);
            hms.append(btn);
        });
    }
    create_buttons() {
        return this.definitions.buttons.map((shortcut) => {
            return this.create_shortcut_button(shortcut);
        });
    }
    create_shortcut_button(shortcut) {
        const icon_label = shortcut.icon;
        const url = shortcut.link;
        const tip = shortcut.tooltip;
        const icon = commonutil_1.Utils.ce('span', '', [], icon_label);
        icon.style.color = 'dodgerblue';
        let button = commonutil_1.Utils.ce('button', this.class_hms_button, [icon], '', {
            'title': tip
        });
        button = commonutil_1.Utils.decorate_menu_icon(button);
        console.log(icon_label.length);
        if (icon_label.length > 2) { // 2⃣文字までは28px、🐈など絵文字は2文字カウント
            button.style.fontSize = '16px';
        }
        if (url != "") {
            console.log({ url });
            button.addEventListener('click', (_event) => {
                location.href = url;
            });
        }
        return button;
    }
    get_header_element(index_text) {
        const headers = document.querySelectorAll('.recordlist-header-label-gaia');
        return Array.from(headers).filter((header) => {
            return header.textContent == index_text;
        });
    }
}
exports.ButtonInstaller = ButtonInstaller;
//# sourceMappingURL=../../../../../../src/ts/desktop/button_installer.js.map