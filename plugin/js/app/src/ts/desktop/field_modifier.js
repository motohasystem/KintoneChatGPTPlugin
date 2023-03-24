"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldModifier = void 0;
// import { KintoneEvent } from "./main";
require("@shin-chan/kypes"); // kintone types
class FieldModifier {
    constructor(config) {
        console.log({ config });
        this.config = config;
    }
    make_editable(event) {
        console.log({ event });
        this.config.forEach((field) => {
            const fieldcode = field['フィールド'];
            // const comment = field['コメント']
            event.record[fieldcode].disabled = false;
            // フィールドの色を変えたい
        });
        return event;
    }
}
exports.FieldModifier = FieldModifier;
//# sourceMappingURL=../../../../../../src/ts/desktop/field_modifier.js.map