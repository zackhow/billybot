// import {REST, Routes} from "discord.js";
//
// const token = process.env.DISCORD_TOKEN;
// const webhook = process.env.WEBHOOK_URL;
// const appId = process.env.APP_ID;
//
// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!',
//     },
// ];
//
// const rest = new REST({ version: '10' }).setToken(token);
//
// async function refreshCommands() {
//     try {
//         console.log('Started refreshing application (/) commands.');
//
//         await rest.put(Routes.applicationCommands(appId), {body: commands});
//
//         console.log('Successfully reloaded application (/) commands.');
//     } catch (error) {
//         console.error(error);
//     }
// }