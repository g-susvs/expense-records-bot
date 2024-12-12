import * as dotenv from "dotenv";
dotenv.config();

interface IEnvironment {
    bot_token: string;
    mongodb_uri: string;
}
export const environment: IEnvironment = {
    bot_token: process.env.BOT_TOKEN ?? '',
    mongodb_uri: process.env.MONGODB_URI ?? '',
}