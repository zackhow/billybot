import {Client, Events, GatewayIntentBits, WebhookClient} from "discord.js";
import {getRepository} from "./data-source.js";
import {GuildEntity} from "./entity/GuildEntity.js";
import {ActionEntry} from "./entity/ActionEntry.js";

const token = process.env.DISCORD_TOKEN;
const webhook = process.env.WEBHOOK_URL;

const channelRepo = getRepository(ActionEntry);
export const client = new Client({ intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const wc = new WebhookClient({url: webhook});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (oldMember.nickname !== newMember.nickname) {
        var oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
        var newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;
        var msg = "User [" + oldName + "] has changed their nickname to [" + newName+ "] !"
        // wc.send(msg);
        const channel = await channelRepo.findOne({
            where: {action: 'ping',
                guildId: newMember.guild.id}
        });

        if (channel) {
            console.log(msg);
            var chan = client.channels.cache.get(channel.channelId);
            if (chan.isTextBased()) {
                chan.send(msg);
            }
        }

    }
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'ping') {
        // await interaction.reply('Pong!');

        const channelRepo = getRepository(ActionEntry);
        const actionEntry = await channelRepo.findOne({
            where: {guildId: interaction.guildId, action: 'ping'}
        });

        if (actionEntry) {
            await interaction.reply(`Action already setup on name: ${actionEntry.channelName}`);
        } else {
            await channelRepo.save(
                {
                    channelId: interaction.channelId,
                    guildId: interaction.guildId,
                    channelName: interaction.channel.name,
                    action: 'ping'
                }
            );
            await interaction.reply(`Saved channel channelId: ${interaction.channelId} name: ${interaction.channel.name}`)
        }
        // await wc.send('testing 1234');
    }
});

client.login(token);

export default client;