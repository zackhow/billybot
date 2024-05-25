import {REST, Routes} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const appId = process.env.APP_ID;

export const PING = "ping";
export const MODNOTES = "modnotes";
export const MODNOTESCLEAR = "modnotesclear";
export const TWITCH_STREAM_ONLINE = "twitchstreamonline";
export const TWITCH_STREAM_ONLINE_CLEAR = "twitchstreamonlineclear";

const commands = [
    {
        name: MODNOTES,
        description: 'Enable mod notices'
    },
    {
        name: MODNOTESCLEAR,
        description: 'Disable mod notices'
    },
    {
        name: PING,
        description: 'Replies with Pong!'
    },
    {
        name: TWITCH_STREAM_ONLINE,
        description: 'Alert when Twitch stream is online',
        options: [
            {
                name: 'streamer',
                type: 3,
                description: 'The name of the Twitch streamer',
                required: true
            },
            {
                name: 'deleteonoffline',
                type: 5,
                description: 'Delete the message when the stream goes offline',
                required: true
            }
        ]
    },
    {
        name: TWITCH_STREAM_ONLINE_CLEAR,
        description: 'Clear Twitch stream online alert',
        options: [
            {
                name: 'streamer',
                type: 3,
                description: 'The name of the Twitch streamer',
                required: true
            }
        ]
    }
];


export async function refreshCommands() {
    try {
        const rest = new REST({ version: '10' }).setToken(token);

        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(appId), {body: commands});

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}