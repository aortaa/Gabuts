import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "ws";

let totalRequests = 0;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        totalRequests++;
        res.status(200).json({ total: totalRequests });
    }
}

if (!global.wss) {
    const wss = new Server({ noServer: true });
    global.wss = wss;

    setInterval(() => {
        wss.clients.forEach(client => {
            client.send(JSON.stringify({ total: totalRequests }));
        });
    }, 1000);
}
