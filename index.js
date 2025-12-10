// DirectAdmin webhostmost版
process.on("uncaughtException", () => { }); process.on("unhandledRejection", () => { });

const UUID = (process.env.UUID ?? "uuid").trim();
const DOMAIN = (process.env.DOMAIN ?? "my.domain.com").trim();

const PORT = Number(process.env.PORT) || 0;  // 0=随机端口

const http = require("http");
const net = require("net");
const { WebSocket } = require("ws");

const ADDR = ["www.visa.cn", "usa.visa.com", "time.is", "www.wto.org"];
const hex = UUID.replace(/-/g, "");

const server = http.createServer((req, res) => {
    if (req.url === `/${UUID}`) {
        res.end(ADDR.map(a => `vless://${UUID}@${a}:443?encryption=none&security=tls&sni=${DOMAIN}&fp=chrome&type=ws&host=${DOMAIN}&path=%2F#DA-${a}`).join("\n") + "\n");
    } else {
        res.end("OK");
    }
});

const wss = new WebSocket.Server({ server });  // 必须这样写！

wss.on("connection", ws => {
    ws.once("message", m => {
        try {
            // UUID校验
            for (let i = 0; i < 16; i++)if (m[1 + i] !== parseInt(hex.substr(i * 2, 2), 16)) return ws.close();

            let p = 17;
            const atyp = m[p++];
            let host = "";
            if (atyp === 1) {
                host = `${m[p++]}.${m[p++]}.${m[p++]}.${m[p++]}`;
            } else if (atyp === 2) {
                const len = m[p++];
                host = new TextDecoder().decode(m.slice(p, p += len));
            } else return ws.close();

            const port = m.readUInt16BE(p);

            ws.send(new Uint8Array([m[0], 0]));

            const r = net.connect(port, host, () => { r.write(m.slice(p + 2)) });
            ws.on("message", d => r.write(d));
            r.on("data", d => ws.send(d));
            r.on("error", () => ws.close());
            ws.on("close", () => r.destroy());
        } catch { ws.close() }
    });
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`VLESS 完美运行 → 127.0.0.1:${server.address().port}`);
    console.log(`访问 → https://${DOMAIN}/${UUID}`);
});
