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
            'label': 'ChatGPT呼び出しボタンのラベル'
            , 'desc': 'プラグインを実行する際のボタンです。プロンプトに見合った名前に書き換えてください。'
            , 'code': CONSTANTS.BUTTON_FACE
            , 'type': FieldType.Text
            , 'default': 'ChatGPTに聞く'
            , 'required': true
        }
        , {
            'label': ''
            , 'desc': '=============================================='
            , 'type': FieldType.Separator
        }
        , {
            'label': 'OpenAI APIの設定'
            , 'desc': 'API呼び出しに必要な項目を指定します。'
            , 'type': FieldType.Label
        }
        , {
            'label': 'API key'
            , 'desc': 'API keyを指定してください。インデキシングにもここで指定したAPI Keyを利用します。'
            , 'code': CONSTANTS.API_KEY
            , 'type': FieldType.Text
            , 'required': true
            , 'secret': true
            , 'URL': ['https://api.openai.com/v1/chat/completions', 'https://api.openai.com/v1/embeddings']
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
            'label': '役割プロンプト(system)'
            , 'desc': 'ChatGPTの役割を与えます。あなたはカウンセラーです。のような役割をプロンプトしてください。'
            , 'code': CONSTANTS.SYSTEM_PROMPT
            , 'type': FieldType.MultilineText
            , 'rows': 3
            , 'cols': 50
            , 'required': false
        }
        , {
            'label': '対話例プロンプト(user / assistant)'
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
        }
        , {
            'label': 'ChatGPT APIのパラメータ設定'
            , 'desc': 'ChatGPTを呼び出す際の数値パラメータを設定します。基本的にデフォルトのままでOKです。'
            , 'type': FieldType.Label
        }
        , {
            'label': 'MAX Tokens'
            , 'desc': 'レスポンスの最大トークン長を指定してください。デフォルトは1024です。'
            , 'code': CONSTANTS.NUMBER_MAX_TOKENS
            , 'type': FieldType.Number
            , 'default': '1024'
            , 'required': true
        }
        , {
            'label': 'Temperature'
            , 'desc': '生成されるテキストのランダム性を制御するパラメータ、値が高いほど出力はランダムになり、低いほど確定的になります。0~2の間で指定してください。デフォルトは1.0です。'
            , 'code': CONSTANTS.NUMBER_TEMPERATURE
            , 'type': FieldType.Number
            , 'default': '1.0'
            , 'required': true
        }
        , {
            'label': 'Top P'
            , 'desc': '確率の高いトークンから順に並べて、累積確率がtop_pを超えるところまでのトークンのみを考慮するパラメータです。0~1.0の間で指定してください。数値を小さくすることで出力のブレを小さくできます。デフォルトは最大値である1.0です。'
            , 'code': CONSTANTS.NUMBER_TOP_P
            , 'type': FieldType.Number
            , 'default': '1.0'
            , 'required': true
        }


        , {
            'label': ''
            , 'desc': '=============================================='
            , 'type': FieldType.Separator
        }
        , {
            'label': 'kintoneのフィールド設定'
            , 'desc': 'ChatGPTに問い合わせる入力フィールドと、回答を出力する出力フィールド、実行ボタン配置用のスペースIDを設定します。'
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
            , 'accept': ['SINGLE_LINE_TEXT', 'MULTI_LINE_TEXT']
            , 'required': true
        }
        , {
            'label': '実行ボタン配置スペース選択'
            , 'desc': 'API呼び出しボタンを配置するスペースを選択してください。スペースにIDを指定していない場合、リストに出てこないのでご注意ください。'
            , 'code': CONSTANTS.BTN_SPACE_FIELD
            , 'type': FieldType.Dropdown_FieldSelect
            , 'accept': ['SPACER']
            , 'required': true
        }
        , {
            'label': ''
            , 'desc': '=============================================='
            , 'type': FieldType.Separator
        }
        , {
            'label': 'embedding設定'
            , 'desc': 'embedding機能を利用する際の設定項目です。通常は設定不要です。利用方法については、キン担ラボまでお問い合わせください。'
            , 'type': FieldType.Label
        }
        , {
            'label': 'ベクトル化モデル指定'
            , 'desc': 'アプリ情報のベクトル化に利用するモデル名を入力してください。デフォルトは "text-embedding-ada-002" です。'
            , 'code': CONSTANTS.INDEXING_MODEL_ID
            , 'type': FieldType.Text
            , 'default': 'text-embedding-ada-002'
            , 'required': false
        }
        , {
            'label': 'ベクトルビルダーアプリID'
            , 'desc': 'ベクトルビルダープラグインを適用したアプリのIDを指定してください。'
            , 'code': CONSTANTS.APPID_INDEXING
            , 'type': FieldType.Number
            , 'required': false
        }
        , {
            'label': 'ベクトル情報格納フィールドの指定'
            , 'desc': '指定したベクトルビルダーアプリの中で、ベクトル情報を格納している複数行テキストフィールドのフィールドコードを入力してください。'
            , 'code': CONSTANTS.FIELDCODE_VECTORIZED
            , 'type': FieldType.Text
            , 'required': false
        }
    ]
}
