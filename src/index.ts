import {REST, Routes, Client, Events, GatewayIntentBits, WebhookClient} from 'discord.js';
import 'dotenv/config';
import client from "./botClient.js";
import dataSource from "./data-source.js";

dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });

// const guildRepo = getRepository(GuildEntity);
const token = process.env.DISCORD_TOKEN;
const webhook = process.env.WEBHOOK_URL;
const appId = process.env.APP_ID;





client.login(token);