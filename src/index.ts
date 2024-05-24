import 'dotenv/config';
import client from "./botclient/botClient.js";
import dataSource from "./data-source.js";
import {refreshCommands} from "./botclient/commands.js";
import {listener, startListeners} from "./twitch/listener.js";

const token = process.env.DISCORD_TOKEN;

dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")

        client.login(token);
        listener.start();

        refreshCommands();
        startListeners();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

// const guildRepo = getRepository(GuildEntity);




// setInterval(notifyTwitchStreamStatus, 60 * 1000);