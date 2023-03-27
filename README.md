# KintoneChatGPTPlugin
入力フィールドの内容でChatGPTに問い合わせて結果を出力フィールドに書き込む単機能のプラグインです。

## kintoneアプリの初期設定

以下の３つのフィールドを設定したアプリを作成してください。

- 複数行テキスト（入力）
- 複数行テキスト（出力）
- スペース

## プラグインのインストール
- [プラグインzipファイル](https://github.com/motohasystem/KintoneChatGPTPlugin/blob/main/dist/)をダウンロードしてアプリに適用してください。


## プラグインの設定

プラグイン設定画面から、下記5つの項目を設定してください。

- API Key
    - ChatGPT APIのAPI Tokenを指定してください。

- 固定プロンプト
    - 入力として毎回渡す固定のプロンプトを記入してください。
    - 入力フィールド文字列の頭につなげてChatGPTにリクエストします。

- 入力フィールド選択
    - 入力として使用するテキストフィールドを選択してください
    - 一行テキストと複数行テキストを候補としてリストアップします

- 出力フィールド選択
    - ChatGPTの返答を入力するフィールドを選択してください。
    - 複数行テキストフィールドを候補としてリストアップします

- 実行ボタン配置スペース選択
    - API呼び出しを実行するボタンを配置するスペースを選択してください。

# License

プレビュー＆インポートプラグインはMITライセンスの元で公開しています。
This plugin is licensed under MIT license.

Copyright (c) 2023 Daisuke Motohashi
https://opensource.org/licenses/MIT

# このプラグインについて

このプラグインは株式会社モノサスの[キン担ラボ](https://www.monosus.co.jp/service/kintanlab/)活動の一環として作成しました。
