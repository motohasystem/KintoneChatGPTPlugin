// import { Utils } from 'commonutils';
import { ConfigDict } from 'plugin-parameters-helper';
import { CONSTANTS } from '../constants';

// import { Spinner } from 'spin.js';
import 'bootstrap'
import "../../scss/style.scss";
import { Utils } from 'kintoneplugin-commonutils';

import { Record } from '@kintone/rest-api-client/lib/client/types'
import { KintoneRestAPIClient } from '@kintone/rest-api-client'
import "@shin-chan/kypes";  // kintone types
import { EmbeddingController, VectorizedDB } from './embedding_controller';
import { FunctionCallingProcessor } from './function_calling_processor';

export class ChatGPTConnector {
    BUTTON_LABEL = 'ChatGPTに聞く'

    conf: ConfigDict | undefined
    // api_key: string | undefined;
    plugin_id: string | undefined
    static_prompt: string | undefined;
    fc_unique_prompt: string | undefined;
    fc_input_field: string | undefined;
    fc_output_field: string | undefined;
    space_btn_field: string | undefined;
    model_id: string | undefined;
    api_endpoint: string;
    flag_speech_edit: boolean;
    max_tokens: string = "256"
    temperature: string = "1.0"
    top_p: string = "1.0"

    system_prompt: string | undefined
    messages: { [key: string]: string }[] | undefined

    // embedding用の設定
    appid_indexing: string | undefined
    indexing_model_id: string | undefined
    fieldcode_vectorized: string | undefined

    constructor(conf: ConfigDict) {
        this.flag_speech_edit = false        // レコードを直接編集するモードフラグ

        this.conf = undefined
        this.loadConfig(conf)

        this.api_endpoint = 'https://api.openai.com/v1';

    }

    setup(plugin_id: string) {
        this.setButton(this.space_btn_field)
        this.plugin_id = plugin_id
    }

    loadConfig(conf: ConfigDict) {
        console.log(conf)
        this.conf = conf

        this.static_prompt = conf[CONSTANTS.STATIC_PROMPT] as string
        this.fc_unique_prompt = conf[CONSTANTS.UNIQUE_PROMPT] as string
        this.fc_input_field = conf[CONSTANTS.INPUT_FIELD] as string
        this.fc_output_field = conf[CONSTANTS.OUTPUT_FIELD] as string
        this.space_btn_field = conf[CONSTANTS.BTN_SPACE_FIELD] as string

        const mode_speech_edit = conf[CONSTANTS.MODE_SPEECH_EDIT] as string
        this.flag_speech_edit = mode_speech_edit == CONSTANTS.LABELS_SPEECH_EDIT.enable

        this.max_tokens = conf[CONSTANTS.NUMBER_MAX_TOKENS] == undefined ? "256" : conf[CONSTANTS.NUMBER_MAX_TOKENS] as string
        this.temperature = conf[CONSTANTS.NUMBER_TEMPERATURE] == undefined ? "1.0" : conf[CONSTANTS.NUMBER_TEMPERATURE] as string
        this.top_p = conf[CONSTANTS.NUMBER_TOP_P] == undefined ? "1.0" : conf[CONSTANTS.NUMBER_TOP_P] as string

        // 呼び出しボタンのラベル
        if (conf[CONSTANTS.BUTTON_FACE] != undefined && conf[CONSTANTS.BUTTON_FACE] as string != '') {
            this.BUTTON_LABEL = conf[CONSTANTS.BUTTON_FACE] as string
        }

        // ChatGPTのモデル名
        this.model_id = conf[CONSTANTS.MODEL_ID] as string

        // systemプロンプト
        this.system_prompt = conf[CONSTANTS.SYSTEM_PROMPT] as string

        // user / assitantの会話
        this.messages = conf[CONSTANTS.TABLE_FEWSHOTS_PROMPT] as { [key: string]: string }[]

        // embedding設定
        this.appid_indexing = conf[CONSTANTS.APPID_INDEXING] as string  // 未定義の場合はembedding無効フラグとして扱う
        console.log({ appid_indexing: this.appid_indexing })
        this.indexing_model_id = conf[CONSTANTS.INDEXING_MODEL_ID] as string
        this.fieldcode_vectorized = conf[CONSTANTS.FIELDCODE_VECTORIZED] as string
    }

    // スペースフィールドにボタンを配置する
    setButton(fc_btn_field: string | undefined) {
        if (fc_btn_field == undefined) {
            return
        }

        const space_field = kintone.app.record.getSpaceElement(fc_btn_field)

        const btn = Utils.buildElement({
            tagName: 'button'
            , className: 'btn btn-primary'
            , attrs: {
                'id': 'button_request'
                , 'type': 'button'
            }
            , textContent: this.BUTTON_LABEL
            // , childElements: [spinner]
        })

        btn.addEventListener('click', this.run)
        space_field?.appendChild(btn)
        // space_field?.appendChild(spinner)
    }

    run = async (_clickevent: any) => {

        console.log('call chatGPT!')
        this.showSpinner()

        if (this.fc_input_field == undefined || this.fc_output_field == undefined) {
            console.error(`必須設定に undefined が残っています。/ fc_input_field: ${this.fc_input_field}  fc_output_field: ${this.fc_output_field}`)
            return
        }

        let prompt
        try {
            prompt = this.makePrompt(this.flag_speech_edit)
            if (prompt == undefined) {
                throw new Error('プロンプトの構築に失敗しました。')
            }
        } catch (error) {
            this.setFieldContent(this.fc_output_field, `エラーが発生しました。(${error})`)
            this.hideSpinner()
            return
        }

        console.log({ prompt })

        // // リクエスト実行と返り値の処理
        this.request(prompt)
            .then((response) => {
                console.log({ response })
                if (this.fc_output_field == undefined) {
                    console.error(`結果は得られましたが、出力フィールドが未定義です。(response: ${response})`)
                    return
                }

                if (this.flag_speech_edit) {
                    console.log({ response })
                    if (response == undefined) {
                        throw new Error('ChatGPTConnector.run(): response is empty!')
                    }
                    const processor = new FunctionCallingProcessor(response)

                    const record = processor.makeSetRecord()
                    console.log({ record })
                    if (record == undefined) {
                        throw new Error('function callingパラメータが定義できませんでした。')
                    }
                    // @ts-ignore
                    kintone.app.record.set(record)
                }
                else {
                    const result: any = JSON.parse(response[0])
                    let text
                    if ('choices' in result && result['choices'].length > 0 && 'message' in result['choices'][0]) {
                        text = result['choices'][0]['message']['content']
                    }
                    else {
                        text = response[0]
                    }
                    this.setFieldContent(this.fc_output_field, text.replace(/^\n+/, ''))
                }

                return
            })
            .catch((error) => {
                console.log("caught an error on run()")
                console.log({ error })
                if (this.fc_output_field == undefined) {
                    console.error('設定が不十分です。出力フィールドが未指定です。')
                    return
                }
                const message = `エラーが発生しました: ${error}`
                this.setFieldContent(this.fc_output_field, message)
                return
            })
            .finally(() => {
                this.hideSpinner()
            })
    }

    makePrompt(flag: boolean): string | undefined {
        if (this.fc_input_field == undefined) {
            return undefined
        }
        const prompt = this.getFieldContent(this.fc_input_field)

        if (flag) {
            // レコード編集モード
            console.info('レコード編集モードで実行します。')
            const record = kintone.app.record.get()
            console.log('---- mode: record modifier')
            // console.log({ record })
            const json = JSON.stringify(record)
            return `${prompt}\n\n${json}`
        }
        else {
            // 通常モード
            console.info('通常モードで実行します。')
            return prompt
        }
    }

    getFieldContent(fc: string): string {
        const record = kintone.app.record.get() as any
        if (record == null) {
            throw new Error('レコード情報が取得できません。')
        }

        if (fc in record.record) {
            const text = record.record[fc].value
            return text
        }

        throw new Error(`フィールドコード[${fc}]が見つかりません。フィールド設定またはプラグイン設定を見直してください。`)

    }

    setFieldContent(fc: string, content: string) {
        const current = kintone.app.record.get() as any
        if (fc in current.record) {
            current.record[fc].value = content
            kintone.app.record.set(current)
        }
        else {
            // エラー出力先のフィールドが見つからない状況なのでアラートダイアログで代用
            const msg = `⛔[ERROR] フィールドコード[${fc}]が見つかりません。フィールド設定またはプラグイン設定を見直してください。`
            console.error(msg)
            alert(msg)
        }
    }

    request(prompt: string) {
        console.log({ prompt })

        if (this.plugin_id == undefined) {
            throw new Error('プラグインIDが未定です')
        }
        const pluginId = this.plugin_id
        const url = this.api_endpoint + '/chat/completions'
        const method = "POST"
        const headers = {
            'Content-Type': 'application/json',
        }

        if (this.model_id == undefined || this.model_id == "") {
            throw new Error(`指定されたChatGPTのモデル名[${this.model_id}]が不適切です。`)
        }

        const max_tokens = parseInt(this.max_tokens)
        const temperature = parseFloat(this.temperature)
        const top_p = parseFloat(this.top_p)

        return this.getEmbeddings(
            this.appid_indexing
            , this.indexing_model_id
            , this.fieldcode_vectorized
            , prompt
        ).then((prompt: string) => {
            const messages = this.composeMessages(this.system_prompt, this.messages, prompt)
            const data: { [key: string]: any } = {
                "model": this.model_id,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
            }

            // function callingを使用する場合に付与するパラメータ
            if (this.flag_speech_edit) {
                data["functions"] = FunctionCallingProcessor.Functions
                data["function_call"] = "auto"
            }

            console.log({ data })
            return kintone.plugin.app.proxy(pluginId, url, method, headers, data)
        }).catch((error) => {
            console.log("caught an error on request()")
            return Promise.reject(error)
        })

    }

    // embeddingする情報を、指定したappidのアプリから取得します
    getEmbeddings(appid: string | undefined, model: string | undefined, fc_vectors: string | undefined, prompt: string = "") {
        console.log({ appid: appid })
        console.log({ model })
        if (appid == undefined || appid.length == 0 || model == undefined) {
            console.warn(`getEmbeddings(): embedせずに実行します。(appid:${appid}, model:${model})`)
            return Promise.resolve(prompt)
        }

        if (fc_vectors == undefined) {
            // throw new Error('getEmbeddings(): ベクトル格納フィールドが未指定です。')
            return Promise.reject('getEmbeddings(): ベクトル格納フィールドが未指定です。')
        }

        const embeddedPrompt = this.getEmbeddedPrompt(appid, prompt, 3).catch((error) => {
            console.log("caught an error on getEmbeddings()")
            console.log({ error })
            return Promise.reject(error)
        })
        return Promise.resolve(embeddedPrompt)
    }

    // 指定したアプリからベクトル情報を取得して、systemプロンプトとして返します。
    async getEmbeddedPrompt(appid: string, query_vector: string, embed_count: number = 3): Promise<string> {
        console.log({ appid })
        console.log({ query_vector })
        console.log({ embed_count })

        const embedding_prompt = await this.getAllRecords(appid).then((records: Record[]) => {
            // 全件取得した状態から、1レコードずつベクトル演算する
            console.log(records)

            if (this.plugin_id == undefined) {
                throw new Error(`getKnowledgesFromIndexingApp(): プラグインIDが未定義のままProxyを呼び出そうとしました。`)
            }

            const controller = new EmbeddingController(null)
            controller.setProxyInfo(this.plugin_id)

            const allKnowledges = records.map(record => {

                if (this.fieldcode_vectorized != undefined && this.fieldcode_vectorized in record) {
                    // フィールドが存在する場合
                    const vectors: VectorizedDB = JSON.parse(record[this.fieldcode_vectorized].value as string)
                    console.log({ vectors })
                    return controller.pickupEmbeddings(query_vector, vectors, embed_count)
                }
                else {
                    throw new Error(`指定したフィールド[${this.fieldcode_vectorized}]が指定したアプリ[${appid}]に存在しませんでした。設定を見直してください。`)
                }
            })

            return Promise.all(allKnowledges)
        }).then((allKnowledges) => {
            const joined_prompts = allKnowledges.map((knowledges) => {
                return knowledges.join('\n')
            }).join('\n\n====\n\n')

            return Promise.resolve(joined_prompts)
        })

        return [embedding_prompt, query_vector].join('\n\n====\n\n')
    }


    // commonutilsに入れたい
    async getAllRecords(appid: string, query: string | undefined = undefined, limit: string = '500'): Promise<any[]> {
        // クライアントの作成
        const client = new KintoneRestAPIClient();

        const allRecords: Record[] = []

        let hasNext = true

        // リクエストパラメータの設定
        let last_record_id = '0'
        while (hasNext) {

            const params = {
                app: appid,
                query: ((last_record_id, query) => {
                    if (query) {
                        return `${query} and $id > ${last_record_id} order by $id asc limit ${limit}`
                    }
                    else {
                        return `$id > ${last_record_id} order by $id asc limit ${limit}`
                    }
                })(last_record_id, query),
                totalCount: true
            };

            // レコードの取得
            const resp = await client.record.getRecords(params);
            const { records, totalCount } = resp
            console.log({ records });
            console.log({ totalCount })

            if (totalCount == null) {
                throw new Error('getAllRecords(): totalCount に null が返りました。')
            }

            allRecords.push(...records)

            if (parseInt(totalCount) == 0) {
                hasNext = false
                continue
            }

            const last_record = records[records.length - 1]
            last_record_id = last_record['$id'].value as string
        }

        return allRecords;
    }




    // ChatCompletion に与えるmessagesを構築する
    composeMessages(system: string | undefined, messages: { [key: string]: string }[] | undefined, prompt: string) {
        if (system == undefined) {
            system = ""
        }

        if (messages == undefined) {
            messages = []
        }

        const chats = messages.map(msg => {
            return {
                "role": msg[CONSTANTS.TABLE_FEWSHOTS.role]
                , "content": msg[CONSTANTS.TABLE_FEWSHOTS.content]
            }
        })

        const conversations: typeof messages = [
            { "role": "system", "content": system }
            , ...chats
            , { "role": "user", "content": prompt }
        ]


        return conversations
    }


    // スピナーを動作させる関数
    showSpinner() {
        console.log('show spinner')

        // 要素作成等初期化処理
        if (document.getElementsByClassName('kintone-spinner').length === 0) {
            const spin_div = Utils.buildElement({
                tagName: 'div'
                , className: 'spinner-grow text-primary kintone-spinner'
                , attrs: {
                    'role': 'status'
                    , 'id': 'spinner_in_button'
                    , 'aria-hidden': 'true'
                    , 'style': 'position: fixed; top: 50%; left: 50%; z-index: 510;'
                }
            }) as HTMLElement
            // spin_div.style.display = "none"

            const spin_bg_div = Utils.buildElement({
                tagName: 'div'
                , className: 'kintone-spinner'
                , attrs: {
                    id: 'kintone-spin-bg'
                    , style: "position: fixed; top: 0px; left: 0px; z-index: 500; width: 100%; height: 200%; background-color: #000; opacity: 0.5; filter: alpha(opacity=50); -ms-filter: alpha(opacity=50)"
                }
            })

            // スピナー用要素をbodyにappend
            document.getElementsByTagName('body')[0].append(spin_div, spin_bg_div);
        };

        // スピナー始動（表示）
        const spinners = document.getElementsByClassName('kintone-spinner') as HTMLCollectionOf<HTMLElement>
        Array.from(spinners).forEach(el => {
            el.style.display = "block"
        })

    }

    // スピナーを停止させる関数
    hideSpinner() {
        console.log('hide spinner')
        // スピナー停止（非表示）
        const spinners = document.getElementsByClassName('kintone-spinner') as HTMLCollectionOf<HTMLElement>
        Array.from(spinners).forEach(el => {
            el.style.display = "none"
        })
    };

}

