import { Utils } from 'commonutils';
import { ConfigDict } from 'plugin-parameters-helper';
import { CONSTANTS } from '../constants';

// import axios from 'axios'

export class ChatGPTConnector {
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
    flag_record_modifier: boolean;
    max_tokens: number = 256

    constructor(conf: ConfigDict) {
        this.flag_record_modifier = false

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
        this.max_tokens = conf[CONSTANTS.NUMBER_MAX_TOKENS] == undefined ? 256 : conf[CONSTANTS.NUMBER_MAX_TOKENS] as number

        // レコード編集モードのフラグ
        this.flag_record_modifier = conf[CONSTANTS.FLAG_RECORD_MODIFIER] as string == CONSTANTS.LABELS_RECORD_MODIFIER[0]

        // ChatGPTのモデル名
        this.model_id = conf[CONSTANTS.MODEL_ID] as string
    }

    // スペースフィールドにボタンを配置する
    setButton(fc_btn_field: string | undefined) {
        if (fc_btn_field == undefined) {
            return
        }

        const space_field = kintone.app.record.getSpaceElement(fc_btn_field)
        const btn = Utils.buildElement({
            tagName: 'input'
            , className: 'kintoneplugin-button-normal'
            , attrs: {
                'type': 'button'
                , 'value': 'ChatGPTに聞く'
            }
        })
        btn.addEventListener('click', this.run)
        space_field?.appendChild(btn)
    }

    run = () => {
        console.log('call chatGPT!')

        if (this.fc_input_field == undefined || this.fc_unique_prompt == undefined) {
            console.error(`どこかundefinedが残っています。${this.fc_input_field} / ${this.fc_unique_prompt}`)
            return
        }

        const prompt: string = ((flag: boolean) => {
            if (flag) {
                // レコード編集モード
                const record = kintone.app.record.get()
                console.log('---- mode: record modifier')
                // console.log({ record })
                return JSON.stringify(record)
            }
            else {
                // 通常モード
                return this.getFieldContent(this.fc_input_field)
            }
        })(this.flag_record_modifier)

        const uniq_prompt = this.getFieldContent(this.fc_unique_prompt)
        // const json_suggestor = "\n\nこのあとに空行をはさんで処理対象のjsonをつづけます。\n\n"
        const connected_prompt = [this.static_prompt, uniq_prompt, prompt].filter((val) => { return val != undefined }).join('\n')

        // リクエスト実行と返り値の処理
        this.request(connected_prompt)
            .then((response) => {
                console.log({ response })
                if (this.fc_output_field == undefined) {
                    return
                }


                if (this.flag_record_modifier) {
                    console.log({ response })
                    if (response == undefined) {
                        throw new Error('ChatGPTConnector.run(): response is empty!')
                    }
                    const record = JSON.parse(response[0])
                    kintone.app.record.set(record)
                }
                else {
                    const result: any = JSON.parse(response[0])
                    const text = result['choices'][0]['text']
                    this.setFieldContent(this.fc_output_field, text.replace(/^\n+/, ''))
                }
            })
    }



    getFieldContent(fc: string) {
        const record = kintone.app.record.get() as any
        if (record == null) {
            throw new Error('レコード情報が取得できません。')
        }

        const text = record.record[fc].value
        console.log({ text })

        return text
    }

    setFieldContent(fc: string, content: string) {
        const current = kintone.app.record.get() as any
        current.record[fc].value = content
        kintone.app.record.set(current)
    }

    request(prompt: string) {
        console.log({ prompt })

        if (this.plugin_id == undefined) {
            throw new Error('プラグインIDが未定です')
        }
        const pluginId = this.plugin_id
        const url = this.api_endpoint + '/completions'
        const method = "POST"
        const headers = {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + this.api_key
        }

        if (this.model_id == undefined || this.model_id == "") {
            throw new Error(`指定されたChatGPTのモデル名[${this.model_id}]が不適切です。`)
        }
        const data = {
            "model": this.model_id,
            "prompt": prompt,
            "max_tokens": 1024,
            "temperature": 0.7
        }
        return kintone.plugin.app.proxy(pluginId, url, method, headers, data)
        // , (response) => {   // success
        //     console.log({ response })
        //     return response
        // }
        // , (error) => {   // failed
        //     console.error(error);
        //     return 'Error occurred while fetching response.';
        // })

        // try {
        //     const response = await axios.post(this.api_endpoint + '/completions', {
        //         "model": this.model_id,
        //         "prompt": prompt,
        //         "max_tokens": 1024,
        //         "temperature": 0.7
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             // 'Authorization': 'Bearer ' + this.api_key
        //         }
        //     });
        //     console.log({ response })
        //     return response.data.choices[0].text.trim();
        // } catch (error) {
        //     console.error(error);
        //     return 'Error occurred while fetching response.';
        // }
    }



}

