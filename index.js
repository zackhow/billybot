import {REST, Routes, Client, Events, GatewayIntentBits, WebhookClient} from 'discord.js';
import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;
const webhook = process.env.WEBHOOK_URL;
const appId = process.env.APP_ID;

// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!',
//     },
// ];
//
// const rest = new REST({ version: '10' }).setToken(token);
//
// try {
//     console.log('Started refreshing application (/) commands.');
//
//     await rest.put(Routes.applicationCommands(appId), { body: commands });
//
//     console.log('Successfully reloaded application (/) commands.');
// } catch (error) {
//     console.error(error);
// }
const wc = new WebhookClient({url: webhook});

const client = new Client({ intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
        var oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
        var newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;
        var msg = "User [" + oldName + "] has changed their nickname to [" + newName+ "] !"
        wc.send(msg);
        console.log(msg);
    }
});

// client.on('interactionCreate', async interaction => {
//     if (!interaction.isChatInputCommand()) return;
//
//     if (interaction.commandName === 'ping') {
//         await interaction.reply('Pong!');
//     }
//
//
//     await wc.send('testing 1234');
//
// });

client.login(token);