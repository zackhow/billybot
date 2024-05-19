import {Client, Events, GatewayIntentBits, WebhookClient} from "discord.js";
import {getRepository} from "../data-source.js";
import {GuildEntity} from "../entity/GuildEntity.js";
import {ActionEntry} from "../entity/ActionEntry.js";
import {MODNOTES, MODNOTESCLEAR, PING} from "./commands.js";
import {addModnotesListeners, disableModnotes, enableModnotes} from "./modnotes.js";

const token = process.env.DISCORD_TOKEN;
const webhook = process.env.WEBHOOK_URL;

export const client = new Client({ intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const wc = new WebhookClient({url: webhook});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.commandName) {
        case MODNOTES:
            await enableModnotes(interaction);
            break;
        case MODNOTESCLEAR:
            await disableModnotes(interaction);
            break;
        case PING:
            await interaction.reply('Pong!');
            break;
        default:
            return;
    }
});

addModnotesListeners();

client.login(token);

export default client;