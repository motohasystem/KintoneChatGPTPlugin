// 定数定義、configとdesktopの双方で使う定義値をここで記述する
export const CONSTANTS = {
    // プラグインのタイトル
    PLUGIN_NAME: 'ChatGPT連携プラグイン'

    // 分類が未選択の場合に表示する文字列
    , EMPTY_LABEL: "----"

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

    // レコード編集モード
    , FLAG_RECORD_MODIFIER: 'flag_record_modifier'
    , LABELS_RECORD_MODIFIER: ['enable', 'disable']

    // レスポンスの最長トークン
    , NUMBER_MAX_TOKENS: 'NUMBER_MAX_TOKENS'
};
