import {Client, Events, GatewayIntentBits} from "discord.js";
import {MODNOTES, MODNOTESCLEAR, PING, TWITCH_STREAM_ONLINE, TWITCH_STREAM_ONLINE_CLEAR} from "./commands.js";
import {addModnotesListeners, disableModnotes, enableModnotes} from "./modnotes.js";
import {disableTwitchStreamOnline, enableTwitchStreamOnline} from "./twitch.js";

const token = process.env.DISCORD_TOKEN;
const intents = [GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages];

export const client = new Client({intents: intents});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.commandName) {
        case MODNOTES:
            await enableModnotes(interaction);
            break;
        case MODNOTESCLEAR:
            await disableModnotes(interaction);
            break;
        case TWITCH_STREAM_ONLINE:
            await enableTwitchStreamOnline(interaction);
            break;
        case TWITCH_STREAM_ONLINE_CLEAR:
            await disableTwitchStreamOnline(interaction);
            break;
        case PING:
            // await test();

            await interaction.reply('Pong!');
            break;
        default:
            return;
    }
});

addModnotesListeners();

export default client;