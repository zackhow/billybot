import {REST, Routes, GatewayIntentBits} from 'discord.js';
import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;
const appId = process.env.APP_ID;

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(appId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }


    await wc.send('testing 1234');

});

client.login(token);