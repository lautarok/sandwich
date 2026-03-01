import pino from "pino"
import qrcode from "qrcode-terminal"
import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState
} from "baileys"
import ParseLexer from "../../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import ParseSemantic from "../../../application/usecases/parser/parse-semantic/parseSemantic.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
}

export default class BaileysAdapter {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic

    constructor(deps: deps) {
        this.parseLexer = deps.parseLexer
        this.parseSyntax = deps.parseSyntax
        this.parseSemantic = deps.parseSemantic
        this.initialize()
    }

    private async initialize() {
        const {version} = await fetchLatestBaileysVersion(),
            {state, saveCreds} = await useMultiFileAuthState("auth") 

        const sock = makeWASocket({
            auth: state,
            version,
            logger: pino({level: "silent"})
        })

        sock.ev.on("creds.update", saveCreds)

        sock.ev.on("connection.update", update => {
            const {connection, lastDisconnect, qr} = update

            if (qr) {
                console.log("Escanea este QR")
                qrcode.generate(qr, {small: true})
            }

            if (connection === "close") {
                const shouldReconnect = lastDisconnect?.error?.["output"]?.["statusCode"] !== DisconnectReason.loggedOut

                console.log(`Conexión cerrada. Reconectar: `, shouldReconnect)

                if (shouldReconnect) {
                    this.initialize()
                }
            } else if (connection === "open") {
                console.log(`Cliente conectado`)
            }
        })

        sock.ev.on("messages.upsert", async ({messages, type}) => {
            if (type !== "notify") return 

            const message = messages[0]
            if (!message) return

            const from = message.key.remoteJid
            const text =
                message.message.conversation
                || message.message.extendedTextMessage?.text

            if (!text) return

            if (text === "/ping") {
                await sock.sendMessage(from, {
                    text: "pong ;)"
                })
            }

            const lexerResult = this.parseLexer.execute(text),
                syntaxResult = this.parseSyntax.execute(lexerResult),
                semanticResult = this.parseSemantic.execute(syntaxResult)

            console.log(text)
            console.log({...semanticResult})

            if (semanticResult.items.length > 0) {
                await sock.sendMessage(from, {
                    text: "Tu pedido:\n`" + semanticResult.items.reduce((acc, curr) => {
                        acc.push(`x${curr.quantity} ${curr.product} ${curr.feature}`)
                        return acc
                    }, []).join("\n") + "`"
                })
            }
        })
    }
}