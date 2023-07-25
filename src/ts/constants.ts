// 定数定義、configとdesktopの双方で使う定義値をここで記述する
export const CONSTANTS = {
    // プラグインのタイトル
    PLUGIN_NAME: 'ChatGPT連携プラグイン'

    // 分類が未選択の場合に表示する文字列
    , EMPTY_LABEL: "----"

    // ChatGPT呼び出しボタンの表記
    , BUTTON_FACE: 'BUTTON_FACE'

    // API Key
    , API_KEY: 'api_key'

    // ChatGPT Model ID
    , MODEL_ID: 'model_id'

    // 固定プロンプト
    , STATIC_PROMPT: 'static_prompt'

    // レコード個別プロンプト
    , UNIQUE_PROMPT: 'unique_prompt'

    // 入力フィールド選択
    , INPUT_FIELD: 'input_field'

    // 出力フィールド選択
    , OUTPUT_FIELD: 'output_field'

    // 実行ボタン配置スペース
    , BTN_SPACE_FIELD: 'btn_space_field'

    // レスポンスの最長トークン
    , NUMBER_MAX_TOKENS: 'NUMBER_MAX_TOKENS'

    // Temperatureの値
    , NUMBER_TEMPERATURE: 'NUMBER_TEMPERATURE'

    // Top_pの値
    , NUMBER_TOP_P: 'NUMBER_TOP_P'

    // systemロールのプロンプト
    , SYSTEM_PROMPT: 'system_prompt'

    // fewshotを定義するテーブル
    , TABLE_FEWSHOTS_PROMPT: 'table_fewshot_prompt'
    // テーブルの各項目
    , TABLE_FEWSHOTS: {
        'role': '役割'
        , 'content': 'プロンプト'
    }

    // embedding設定
    , APPID_INDEXING: 'appid_indexing'
    , EMBEDDING_API_KEY: 'embedding_api_key'
    , INDEXING_MODEL_ID: 'indexigin_model_id'
    , FIELDCODE_VECTORIZED: 'fieldcode_vectorized'
};

// export type fewshots_keys =  keyof typeof CONSTANTS.TABLE_FEWSHOTS
