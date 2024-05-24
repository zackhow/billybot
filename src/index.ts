import 'dotenv/config';
import client from "./botclient/botClient.js";
import dataSource from "./data-source.js";
import {refreshCommands} from "./botclient/commands.js";
import {listener} from "./twitch/listener.js";

dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

// const guildRepo = getRepository(GuildEntity);
const token = process.env.DISCORD_TOKEN;

refreshCommands();

client.login(token);
listener.start();

// setInterval(notifyTwitchStreamStatus, 60 * 1000);