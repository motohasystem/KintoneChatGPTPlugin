import { FieldType, KintoneConfigSetting, KintonePluginPreference } from "plugin-parameters-helper";
import { CONSTANTS } from "../constants";

// 設定項目に関する設定、デスクトップ側からも参照する。
export class Settings {
    // 設定項目の定義
    static preference: KintonePluginPreference = {
        'title': 'ChatGPT連携プラグインの設定'
        , 'description': ''
    }

    static input: KintoneConfigSetting = [
        {
            'label': 'ChatGPTの設定'
            , 'desc': 'API呼び出しに必要な項目を指定します。'
            , 'type': FieldType.Label
        }
        , {
            'label': 'API Key'
            , 'desc': 'ChatGPT APIのAPI Tokenを指定してください。'
            , 'code': CONSTANTS.API_KEY
            , 'type': FieldType.Text
            , 'required': true
        }
        , {
            'label': '固定プロンプト'
            , 'desc': '入力として毎回渡す固定のプロンプトを記入してください。'
            , 'code': CONSTANTS.STATIC_PROMPT
            , 'type': FieldType.MultilineText
            // , 'type': FieldType.Text
            // , 'accept': ['MULTI_LINE_TEXT']
            , 'required': false
        }
        , {
            'label': 'レコード別プロンプト'
            , 'desc': 'レコード別に指定するプロンプトフィールドを選択してください。'
            , 'code': CONSTANTS.UNIQUE_PROMPT
            , 'type': FieldType.Dropdown_FieldSelect
            , 'accept': ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT']
            , 'default': CONSTANTS.EMPTY_LABEL
            , 'required': false
        }
        , {
            'label': ''
            , 'desc': ''
            , 'type': FieldType.Separator
            , 'required': false
        }
        , {
            'label': 'kintoneのフィールド設定'
            , 'desc': '入出力フィールドなどを設定します。'
            , 'type': FieldType.Label
        }
        , {
            'label': '入力フィールド選択'
            , 'desc': '入力として使用するフィールドを選択してください'
            , 'code': CONSTANTS.INPUT_FIELD
            , 'type': FieldType.Dropdown_FieldSelect
            , 'accept': ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT']
            , 'required': true
        }
        , {
            'label': '出力フィールド選択'
            , 'desc': 'ChatGPTの返答を入力するフィールドを選択してください。'
            , 'code': CONSTANTS.OUTPUT_FIELD
            , 'type': FieldType.Dropdown_FieldSelect
            , 'accept': ['MULTI_LINE_TEXT']
            , 'required': true
        }
        // スペーサー選択がまだ未実装
        , {
            'label': '実行ボタン配置スペース選択'
            , 'desc': 'API呼び出しを実行するボタンを配置するスペースを選択してください。'
            , 'code': CONSTANTS.BTN_SPACE_FIELD
            , 'type': FieldType.Dropdown_FieldSelect
            , 'accept': ['SPACER']
            , 'required': true
        }
    ]
}
