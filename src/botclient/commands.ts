import {REST, Routes} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const appId = process.env.APP_ID;

export const PING = "ping";
export const MODNOTES = "modnotes";
export const MODNOTESCLEAR = "modnotesclear";

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