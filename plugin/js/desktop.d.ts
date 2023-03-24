interface KintoneEvent {
    record: kintone.types.SavedFields;
    error: string[];
}
declare function assertIsDefined<T>(val: T): asserts val is NonNullable<T>;
declare class KintoneAppValidator {
    /**
       * kintoneアプリのフィールドの設定状況をチェックします。
       * 現在定数定義にしている部分を、プラグイン化にともない設定画面からセットできるように変更する
       */
    static FC_ATTACH_SOURCE: keyof kintone.types.Fields;
    static FC_ATTACH_CONVERTED: keyof kintone.types.Fields;
    static FC_MULTILINE_RESULT: keyof kintone.types.Fields;
    static FC_CB_FLG_READY: keyof kintone.types.Fields;
    fc_attach_source: string;
    fc_attach_converted: string;
    fc_multiline_result: string;
    fc_cb_flg_ready: string;
    constructor(config: {
        [x: string]: string;
    });
    app_field_checker(event: KintoneEvent, fieldcode: string, label?: string): void;
    check_fields(event: KintoneEvent): void;
}
declare class AttachedFileViewer {
    /**
     * 添付ファイルのプレビューを表示します。
     */
    show(event: KintoneEvent): KintoneEvent | undefined;
    static showCsvTable(textdata: string, element: HTMLElement): void;
}
