import 'dotenv/config';
import client from "./botclient/botClient.js";
import dataSource from "./data-source.js";
import {refreshCommands} from "./botclient/commands.js";
import {listener, startListeners} from "./twitch/listener.js";

const token = process.env.DISCORD_TOKEN;
const appId = process.env.APP_ID;
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchListenerSecret = process.env.TWITCH_LISTENER_SECRET;
const twitchCallbackHost = process.env.TWITCH_CALLBACK_HOST;

if (!token) {
    console.error("Missing DISCORD_TOKEN in .env");
    process.exit(1);
}
if (!appId) {
    console.error("Missing APP_ID in .env");
    process.exit(1);
}
if (!twitchClientId || !twitchClientSecret) {
    console.error("Missing TWITCH_CLIENT_ID and/or TWITCH_CLIENT_SECRET in .env");
    process.exit(1);
}
if (!twitchListenerSecret) {
    console.error("Missing TWITCH_LISTENER_SECRET in .env");
    process.exit(1);
}
if (!twitchCallbackHost) {
    console.error("Missing TWITCH_CALLBACK_HOST in .env");
    process.exit(1);
}

dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        afterDbInit();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

function afterDbInit() {
    client.login(token);
    listener.start();
    refreshCommands();
    startListeners();
}
