import { Utils } from 'commonutils';
import { ConfigDict } from 'plugin-parameters-helper';
import { CONSTANTS } from '../constants';

import axios from 'axios'

export class ChatGPTConnector {
    conf: ConfigDict | undefined
    api_key: string | undefined;
    static_prompt: string | undefined;
    fc_input_field: string | undefined;
    fc_output_field: string | undefined;
    space_btn_field: string | undefined;
    model_id: string;
    api_endpoint: string;

    constructor(conf: ConfigDict) {
        this.conf = undefined
        this.loadConfig(conf)


        this.api_endpoint = 'https://api.openai.com/v1';
        // this.apiKey = 'YOUR_API_KEY_HERE';
        this.model_id = 'text-davinci-003'; // ChatGPT model ID

    }

    setup() {
        this.setButton(this.space_btn_field)
    }

    loadConfig(conf: ConfigDict) {
        console.log(conf)
        this.conf = conf

        this.api_key = conf[CONSTANTS.API_KEY] as string
        this.static_prompt = conf[CONSTANTS.STATIC_PROMPT] as string
        this.fc_input_field = conf[CONSTANTS.INPUT_FIELD] as string
        this.fc_output_field = conf[CONSTANTS.OUTPUT_FIELD] as string
        this.space_btn_field = conf[CONSTANTS.BTN_SPACE_FIELD] as string
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

        if (this.fc_input_field == undefined || this.api_key == undefined) {
            console.error(`どこかundefinedが残っています。${this.fc_input_field} / ${this.api_key}`)
            return
        }

        const prompt = this.getFieldContent(this.fc_input_field)
        this.request(`${this.static_prompt}\n${prompt}`)
            .then((response: string) => {
                console.log(response)
                if (this.fc_output_field == undefined) {
                    return
                }
                this.setFieldContent(this.fc_output_field, response)
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

    async request(prompt: string): Promise<string> {
        console.log({ prompt })
        try {
            const response = await axios.post(this.api_endpoint + '/completions', {
                "model": this.model_id,
                "prompt": prompt,
                "max_tokens": 256,
                // n: 1,
                // stop: '\n',
                "temperature": 0.7
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.api_key
                }
            });
            console.log({ response })
            return response.data.choices[0].text.trim();
        } catch (error) {
            console.error(error);
            return 'Error occurred while fetching response.';
        }
    }



}

