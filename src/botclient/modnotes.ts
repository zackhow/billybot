import {Events} from "discord.js";
import {MODNOTES} from "./commands.js";
import {client} from "./botClient.js";
import {getRepository} from "../data-source.js";
import {ActionEntry} from "../entity/ActionEntry.js";

const channelRepo = getRepository(ActionEntry);

export async function enableModnotes(interaction)
{
    const channelRepo = getRepository(ActionEntry);
    const actionEntry = await channelRepo.findOne({
        where: {guildId: interaction.guildId, action: MODNOTES}
    });

    if (actionEntry) {
        await interaction.reply(`Action already setup on name: ${actionEntry.channelName}! run '/modnotesclear to clear'`);
    } else {
        await channelRepo.save(
            {
                channelId: interaction.channelId,
                guildId: interaction.guildId,
                channelName: interaction.channel.name,
                action: MODNOTES
            }
        );
        await interaction.reply(`Enabled Mod Notes on name: ${interaction.channel.name}`)
    }
}

export async function disableModnotes(interaction){
    const channelRepo = getRepository(ActionEntry);
    const actionEntry = await channelRepo.findOne({
        where: {guildId: interaction.guildId, action: MODNOTES}
    });

    if (actionEntry) {
        await channelRepo.remove(actionEntry);
        await interaction.reply(`Removed Mod Notes from channel: ${actionEntry.channelName}`);
    } else {
        await interaction.reply(`No action setup on this channel!`);
    }
}

export function addModnotesListeners() {
    client.on(Events.GuildMemberAdd, async member => {
        const actionEntry = await channelRepo.findOne({
            where: {
                action: MODNOTES,
                guildId: member.guild.id
            }
        });
        if (actionEntry) {
            var channel = client.channels.cache.get(actionEntry.channelId);
            if (channel.isTextBased()) {
                channel.send(`[${member.user}] has joined the server!`);
            }
        }
    })

    client.on(Events.GuildMemberRemove, async member => {
        const actionEntry = await channelRepo.findOne({
            where: {
                action: MODNOTES,
                guildId: member.guild.id
            }
        });
        if (actionEntry) {
            var channel = client.channels.cache.get(actionEntry.channelId);
            if (channel.isTextBased()) {
                channel.send(`[${member.user}] has left the server!`);
            }
        }
    })

    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        if (oldMember.nickname !== newMember.nickname) {
            // wc.send(msg);
            const actionEntry = await channelRepo.findOne({
                where: {
                    action: MODNOTES,
                    guildId: newMember.guild.id
                }
            });

            if (actionEntry) {
                var oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
                var newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;
                var msg = `${oldMember.user} has changed their name!\n Old Name:[` + oldName + "] New Name:[" + newName + "] !";

                console.log(msg);
                var channel = client.channels.cache.get(actionEntry.channelId);
                if (channel.isTextBased()) {
                    channel.send(msg);
                }
            }

        }
    });
}