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
            , 'secret': true
            , 'URL': 'https://api.openai.com/v1/chat/completions'
            , 'method': 'POST'
            , 'header': 'Authorization Bearer'
        }
        , {
            'label': 'ChatGPTの利用モデル'
            , 'desc': '利用モデル名を入力してください。デフォルトは "gpt-3.5-turbo" です。'
            , 'code': CONSTANTS.MODEL_ID
            , 'type': FieldType.Text
            , 'default': 'gpt-3.5-turbo'
            , 'required': true
        }
        , {
            'label': 'MAX Tokens'
            , 'desc': 'レスポンスの最大トークン長を指定してください。'
            , 'code': CONSTANTS.NUMBER_MAX_TOKENS
            , 'type': FieldType.Number
            , 'default': '512'
            , 'required': true
        }
        , {
            'label': '役割プロンプト'
            , 'desc': 'ChatGPTの役割を与えます。あなたはカウンセラーです。のような役割をプロンプトしてください。'
            , 'code': CONSTANTS.SYSTEM_PROMPT
            , 'type': FieldType.MultilineText
            , 'rows': 3
            , 'cols': 50
            , 'required': false
        }
        , {
            'label': '対話例プロンプト'
            , 'desc': '会話の例をChatGPTに教えます。この項目が長くなる場合はMAX Tokensの値を増やしてください。'
            , 'code': CONSTANTS.TABLE_FEWSHOTS_PROMPT
            , 'type': FieldType.IncrementalTable
            , 'required': false
            , 'table_cols': [
                {
                    'header': CONSTANTS.TABLE_FEWSHOTS.role
                    , 'type': FieldType.Dropdown
                    , 'accept': ['user', 'assistant']
                }
                , {
                    'header': CONSTANTS.TABLE_FEWSHOTS.content
                    , 'type': FieldType.MultilineText
                }
            ]
        }
        , {
            'label': ''
            , 'desc': '=============================================='
            , 'type': FieldType.Separator
            , 'required': false
        }
        , {
            'label': 'プラグインの動作設定'
            , 'desc': 'ボタンの配置やレコード単位でプロンプトとして使用するフィールドなどを設定します。'
            , 'type': FieldType.Label
        }
        , {
            'label': '実行ボタン配置スペース選択'
            , 'desc': 'API呼び出しを実行するボタンを配置するスペースを選択してください。'
            , 'code': CONSTANTS.BTN_SPACE_FIELD
            , 'type': FieldType.Dropdown_FieldSelect
            , 'accept': ['SPACER']
            , 'required': true
        }
        // , {
        //     'label': '固定プロンプト'
        //     , 'desc': '入力として毎回渡す固定のプロンプトを記入してください。'
        //     , 'code': CONSTANTS.STATIC_PROMPT
        //     , 'type': FieldType.MultilineText
        //     , 'required': false
        // }
        // , {
        //     'label': 'レコード別プロンプト'
        //     , 'desc': 'レコード別に指定するプロンプトフィールドを選択してください。'
        //     , 'code': CONSTANTS.UNIQUE_PROMPT
        //     , 'type': FieldType.Dropdown_FieldSelect
        //     , 'accept': ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT']
        //     , 'default': CONSTANTS.EMPTY_LABEL
        //     , 'required': false
        // }
        , {
            'label': '[danger] レコード編集モード'
            , 'desc': '有効にするとレコード全体を編集対象として書き換えるモードで動作します。その際、↓以降の設定は無効になります。よくわからない場合はdisableにしておいてください。'
            , 'code': CONSTANTS.FLAG_RECORD_MODIFIER
            , 'type': FieldType.Radio
            , 'accept': CONSTANTS.LABELS_RECORD_MODIFIER
            , 'default': CONSTANTS.LABELS_RECORD_MODIFIER[1]
            , 'required': true
        }
        , {
            'label': ''
            , 'desc': '=============================================='
            , 'type': FieldType.Separator
            , 'required': false
        }
        , {
            'label': 'kintoneのフィールド設定'
            , 'desc': 'ChatGPTに問い合わせる入力フィールドと、回答を出力する出力フィールドを設定します。'
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
    ]
}
