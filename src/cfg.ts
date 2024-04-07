import "dotenv/config"
import { IConfig } from "./types/client/client.types";

export const config: IConfig = {
    client: {
        id: "830555641739083837",
        token: process.env.TOKEN as string,
        guild: "871204257649557604"
    },
    colors: {
        base: "#E08828",
        error: "#ff0000",
        success: "#00ff00",
        warning: "#ffff00",
    },
    database: {
        url: process.env.MONGO as string
    },
    snaily: {
        errors: "1205399936666177546",
        channel: "1204369097639591956",
        logo: "https://cordx.lol/users/510065483693817867/e8HJKF6N.png",
        judge: "https://cordx.lol/users/510065483693817867/ajwZF1Gx.gif",
        terms: "https://cordx.lol/users/510065483693817867/gRRuQQac.png"
    },
    roles: {
        support: "1138246343412953218",
        developer: "871275407134040064"
    },
    server: {
        port: "10420",
        host: "0.0.0.0"
    }
}