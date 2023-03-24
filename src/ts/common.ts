
// fields.json レスポンスのproperties の各要素
export type FieldProperty = {
    type: string
    label: string
    code: string
    defaultValue?: string
    defaultNowValue?: boolean
    noLabel?: boolean
    required?: boolean
    unique?: boolean
}

export class Common {
    /**
     * フィールドコードからラベル文字列を取得する
     * @param props fields.jsonのresponse.properties
     * @param fc_target ラベルを取得したいフィールドコード
     */
    static fieldcode_to_label(props: { [code: string]: FieldProperty }, fc_target: string): string | undefined {
        for (const fieldcode of Object.keys(props)) {
            if (fieldcode == fc_target) {
                return props[fieldcode].label
            }
        }
        return undefined
    }
}