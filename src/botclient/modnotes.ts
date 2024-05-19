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
        await interaction.reply(`Saved channel channelId: ${interaction.channelId} name: ${interaction.channel.name}`)
    }
}

export async function disableModnotes(interaction){
    const channelRepo = getRepository(ActionEntry);
    const actionEntry = await channelRepo.findOne({
        where: {guildId: interaction.guildId, action: MODNOTES}
    });

    if (actionEntry) {
        await channelRepo.remove(actionEntry);
        await interaction.reply(`Removed action from channel: ${actionEntry.channelName}`);
    } else {
        await interaction.reply(`No action setup on this channel!`);
    }
}

export function addModnotesListeners() {
    client.on(Events.GuildMemberAdd, async member => {
        const channel = await channelRepo.findOne({
            where: {
                action: MODNOTES,
                guildId: member.guild.id
            }
        });
        if (channel) {
            var chan = client.channels.cache.get(channel.channelId);
            if (chan.isTextBased()) {
                chan.send(`[${member.user.username}] has joined the server!`);
            }
        }
    })

    client.on(Events.GuildMemberRemove, async member => {
        const channel = await channelRepo.findOne({
            where: {
                action: MODNOTES,
                guildId: member.guild.id
            }
        });
        if (channel) {
            var chan = client.channels.cache.get(channel.channelId);
            if (chan.isTextBased()) {
                chan.send(`[${member.user.username}] has left the server!`);
            }
        }
    })

    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        if (oldMember.nickname !== newMember.nickname) {
            var oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
            var newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;
            var msg = "User [" + oldName + "] has changed their nickname to [" + newName + "] !"
            // wc.send(msg);
            const channel = await channelRepo.findOne({
                where: {
                    action: MODNOTES,
                    guildId: newMember.guild.id
                }
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
}