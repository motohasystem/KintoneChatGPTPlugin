/**
 *      const vectorizer = new EmbeddingController(<<API Key>>)
        await vectorizer.setSentences(sentences)
        const ans = await vectorizer.search("本橋はどこにいますか？", 1)    // 取得する知識の件数を指定
        console.log(ans)    // 回答の自然文配列

 */
import { Configuration, OpenAIApi } from 'openai'

// kintoneアプリの持っているレコードについて、ヘッダー情報とレコード情報をそれぞれKnowledge形式で持つ
export type VectorizedDB = {
    'headers': Knowledge
    , 'records': Knowledge[]
}

// テキストと検索用ベクトルのペア
export type Knowledge = { 'text': string, 'vector': number[] }

// 
export class EmbeddingController {
    // private sentences: string[] | undefined = undefined;
    public knowledges: Knowledge[] | undefined
    // private apiKey: string
    private openai: OpenAIApi | undefined
    private configuration: Configuration | undefined

    private model_vectorize = 'text-embedding-ada-002'  // ベクトル化に使用するモデル名

    // REST API呼び出しのときにkintone proxyで使用する
    private pluginId: string | undefined
    private endpoint: string = 'https://api.openai.com/v1/embeddings'

    // apiKey = undefinedのとき、kintoneのsecret機能を使ってAPIを呼び出す挙動をします.
    constructor(apiKey: string | null) {
        if (apiKey != null) {
            this.configuration = new Configuration({
                apiKey: apiKey,
            });
            this.openai = new OpenAIApi(this.configuration);
        }
    }

    setProxyInfo(pluginId: string) {
        this.pluginId = pluginId
    }

    // 知識となる文章の配列を渡してベクトル化する
    async setSentences(sentences: string[]) {
        if (sentences == undefined) {
            throw new Error('センテンスにundefinedが渡されました。')
        }

        // this.sentences = sentences;
        this.knowledges = await this.createVector(sentences)
    }

    // 知識配列をセットする。古い知識は忘れる。
    setKnowledges(knowledges: Knowledge[]) {
        if (knowledges == undefined) {
            throw new Error("知識にundefinedが渡されました")
        }
        this.knowledges = knowledges

        return
    }

    // 知識配列を加える。古い知識に追加される。
    appendKnowledges(knowledges: Knowledge[]) {
        if (knowledges == undefined) {
            throw new Error("知識にundefinedが渡されました")
        }
        if (this.knowledges == undefined) {
            this.knowledges = knowledges
        }
        else {
            this.knowledges.push(...knowledges)
        }

        return
    }


    // 与えた文章をベクトル化する
    async vectorize(input: string): Promise<number[]> {
        if (this.openai != undefined) {
            return this.vectorizeByOpenAI(input)
        }

        // kintoneのsecret機能を使う
        return this.vectorizeByRestAPI(input)
    }

    // OpenAI REST APIを呼び出してベクトル計算を行います。
    vectorizeByRestAPI(searchquery: string) {
        console.log({ searchquery })

        if (this.pluginId == undefined) {
            throw new Error('vectorizeByRestAPI(): プラグインIDが未定です')
        }
        const pluginId = this.pluginId
        const url = this.endpoint     // https://api.openai.com/v1/embeddings
        const method = "POST"
        const headers = {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + this.api_key
        }

        if (this.model_vectorize == undefined || this.model_vectorize == "") {
            throw new Error(`指定されたChatGPTのモデル名[${this.model_vectorize}]が不適切です。`)
        }
        const data = {
            "model": this.model_vectorize
            , "input": searchquery
        }
        console.log({ data })
        // return kintone.plugin.app.proxy(pluginId, url, method, headers, data)

        return kintone.plugin.app.proxy(pluginId, url, method, headers, data)
            .then((response) => {
                console.log({ response })
                const result: any = JSON.parse(response[0])
                console.log({ result })
                const query_vector = result['data'][0]['embedding'] as number[]

                return Promise.resolve(query_vector)
            })
    }



    // OpenAIライブラリを使ってベクトル化を行う
    async vectorizeByOpenAI(input: string): Promise<number[]> {
        if (this.openai == undefined) {
            throw new Error('OpenAI APIが初期化されていません。')
        }

        try {
            const vectors = await this.openai.createEmbedding({
                model: this.model_vectorize,
                input
            })
            return Promise.resolve(vectors.data.data[0].embedding)
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    // 与えた文章配列をまとめてベクトル化する
    async createVector(sentences: string[]): Promise<Knowledge[]> {
        const promised = sentences.map(async (sentence) => {
            return {
                text: sentence,
                vector: await this.vectorize(sentence)
            }
        })

        return await Promise.all(promised)

    }

    // 知識ベクトルから距離の近い文章を探してnumResultsの数だけ返す
    async search(input: string, knowledges: Knowledge[], numResults: number = 3): Promise<string[]> {
        const dot = (a: number[], b: number[]): number => {
            return a.map((_x, i) => a[i] * b[i]).reduce((m, n) => m + n)
        };
        const inputVector = await this.vectorize(input)

        if (knowledges == undefined) {
            throw new Error("知識ベクトルが未構築です。")
        }
        return knowledges.map((i: Knowledge): { knowledge: Knowledge, similarity: number } => {
            return {
                knowledge: i,
                similarity: dot(inputVector, i.vector)
            };
        }).sort((a, b) => b.similarity - a.similarity).slice(0, numResults).map(i => i.knowledge.text);
    }


    async pickupEmbeddings(query_vector: string, vectors: VectorizedDB, embed_count: number) {
        // TODO: vectors.recordsからsearch(embedding_controllerを参照)して、
        // 指定した数の元文章と、vectors.headersをセットで返す
        return await this.search(query_vector, vectors.records, embed_count)
            .then((answers: string[]) => {
                console.log(answers)

                const headers = vectors.headers.text
                answers.unshift(headers)
                return Promise.resolve(answers)
            })

    }


}
