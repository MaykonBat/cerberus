import WebSocket, { WebSocketServer } from "ws";
import Config from "./config";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { JWT } from "commons";

let wss: CerberusWSS;

const whiteList = Config.CORS_ORIGIN.split(",");

class CerberusWS extends WebSocket {
  id: string;

  constructor(address: string) {
    super(address);
    this.id = "";
  }
}

export class CerberusWSS extends WebSocketServer {
  isConnected(userId: string): boolean {
    if (!this.clients || !this.clients.size) return false;
    return ([...this.clients] as CerberusWS[]).some((c) => c.id === userId);
  }

  getConnections(): string[] {
    if (!this.clients || !this.clients.size) return [];
    return ([...this.clients] as CerberusWS[]).map((c) => c.id);
  }

  direct(userId: string, jsonObj: Object) {
    console.log("Sending a direct message to " + userId);
    if (!this.clients || !this.clients.size) return;
    ([...this.clients] as CerberusWS[]).forEach((client) => {
      if (client.id === userId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonObj));
        return;
      }
    });
  }

  broadcast(jsonObj: Object) {
    if (!this.clients || !this.clients.size) return;
    ([...this.clients] as CerberusWS[]).forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonObj));
        return;
      }
    });
  }
}

function corsValidation(origin: string) {
  return whiteList[0] === "*" || whiteList.includes(origin);
}

export default (): CerberusWSS => {
  if (wss) return wss;

  wss = new CerberusWSS({
    port: Config.WS_PORT,
  });

  wss.on("connection", (ws: CerberusWS, req: IncomingMessage) => {
    if (!req.url || !req.headers.origin || !corsValidation(req.headers.origin))
      throw new Error(`Cors Policy`);

    const token = req.url.split("token=")[1];
    if (!token) return;

    const decoded = jwt.verify(token, Config.JWT_SECRET) as JWT;
    if (decoded && !wss.isConnected(decoded.userId)) {
      ws.id = decoded.userId;
      ws.on("message", (data) => console.log(data));
      ws.on("error", (err) => console.error(err));
      console.log("es.onConnection: " + req.url);
    }
  });

  console.log(`Cerberus WebSocket Server is Running.`);
  return wss;
};
