

type ChatCompletionResponsePrimary = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
}

type Choice = {
    index: number;
    message: Message;
    finish_reason: string;
}

interface Message {
    role: string;
    content: null;
    function_call: FunctionCall;
}

type FunctionCall = {
    name: string;
    arguments: string;
}

interface Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

// import { Record } from '@kintone/rest-api-client/lib/client/types'

export type KintoneAppRecordSet = {
    "record": {
        [fieldcode: string]: {
            'type': string
            , 'value': string
        }
    }
}

export class FunctionCallingProcessor {

    static Functions = [
        // どんなときにこの関数を使うか、引数はどうするか、という情報を与える
        // kintone.app.record.set(record) に直接渡せるrecordを構築する関数
        {
            "name": "get_json_for_kintone_app_record_set",
            "description": "kintone.app.record.set(record) に直接渡せるrecordを構築する",
            "parameters": {
                "type": "object",
                "properties": {
                    // record引数の情報
                    "record": {
                        "type": "object",
                        "properties": {
                            "フィールドコード": {
                                "type": "string",
                                "description": "書き換え後の文字列を入れます。日付はYYYY-MM-dd、時刻はHH:mm:ss 形式です。"
                            }

                        },
                        "description": "recordオブジェクトのpropertiesはフィールドコードをキーとしたobjectです。変更したいフィールドコードだけ持たせます。",
                    },
                },
                "required": ["record"],
            },
        }
    ]

    primary_response: ChatCompletionResponsePrimary
    status: number
    response_headers: { [key: string]: string }

    constructor(responses: [string, number, { [key: string]: string }]) {
        this.primary_response = JSON.parse(responses[0]) as ChatCompletionResponsePrimary
        this.status = responses[1]
        this.response_headers = responses[2]
    }

    makeSetRecord(): KintoneAppRecordSet | undefined {
        const function_call = this.findFunctionCallShouldRun()
        if (function_call == undefined) {
            throw new Error('呼び出すべき関数がありませんでした。')
        }

        if (function_call.name == 'get_json_for_kintone_app_record_set') {
            return this.get_json_for_kintone_app_record_set(function_call.arguments)
        }

        return undefined
    }

    // kintone.app.record.set(record) に直接渡せるrecordを構築する
    get_json_for_kintone_app_record_set(params_serialized: string) {
        // params = {
        //     "record": {
        //       "居住地": "岡山",
        //       "生年月日": "1909-01-01"
        // }
        const params = JSON.parse(params_serialized)
        const reference_record = kintone.app.record.get()
        if (reference_record == null) {
            throw new Error('kintone.app.record.get()がundefinedを返しました。')
        }
        const formatted: KintoneAppRecordSet = { "record": {} }
        console.log({ params })
        console.log({ reference_record })

        try {

            Array.from(Object.keys(params.record)).forEach((key: string) => {
                console.log({ key })
                const value = params.record[key] as string    // "岡山"
                if (key in reference_record.record) {
                    // @ts-ignore
                    const field_type = reference_record.record[key].type
                    formatted.record[key] = {
                        type: field_type
                        , value: value
                    }
                }
                else {
                    console.warn(`kintone上に存在しないフィールド[${key}]がOpenAI APIから指定されました。プロンプトを見直してください。`)
                }
            })
        }
        catch (err) {
            throw new Error(`OpenAI APIのレスポンスが想定しない形式を返しました。(${err} / ${params})`)
        }

        console.log({ formatted })

        return formatted
    }

    // function callingすべきresponseを探して関数名を返す。
    findFunctionCallShouldRun(): FunctionCall | undefined {
        if (this.primary_response == undefined) {
            throw new Error('APIレスポンスが未定義です。')
        }

        // function_callを実行すべきという回答があればtrueを返す
        const choice = this.primary_response.choices.find((choice: Choice) => {
            return choice.finish_reason == 'function_call'
        })

        if (choice == undefined) {
            return undefined
        }

        return choice.message.function_call
    }



    /**
     * function_callingを有効にした場合のレスポンスを受け取り、適切な関数を実行する。
     * function_callingを使わないという応答であればそのまま戻す
     * @param responce 
     */
    process() {

    }
}
