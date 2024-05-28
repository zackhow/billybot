import {Events} from "discord.js";
import {client} from "./botClient.js";
import {getRepository} from "../data-source.js";
import {ModNotes} from "../entity/impl/ModNotes.js";

const modNotesRepo = getRepository(ModNotes);

export async function enableModnotes(interaction) {
    const modNotesEntity = await modNotesRepo.findOne({
        where: {guildId: interaction.guildId}
    });

    if (modNotesEntity) {
        await interaction.reply(`Action already setup on name: ${modNotesEntity.channelName}! run '/modnotesclear to clear'`);
    } else {
        await modNotesRepo.save(
            {
                channelId: interaction.channelId,
                guildId: interaction.guildId,
                channelName: interaction.channel.name,
            }
        );
        await interaction.reply(`Enabled Mod Notes on name: ${interaction.channel.name}`)
    }
}

export async function disableModnotes(interaction) {
    const modNotesEntity = await modNotesRepo.findOne({
        where: {guildId: interaction.guildId}
    });

    if (modNotesEntity) {
        await modNotesRepo.remove(modNotesEntity);
        await interaction.reply(`Removed Mod Notes from channel: ${modNotesEntity.channelName}`);
    } else {
        await interaction.reply(`No action setup on this channel!`);
    }
}

export function addModnotesListeners() {
    client.on(Events.GuildMemberAdd, async member => {
        const modNotesEntity = await modNotesRepo.findOne({
            where: {
                guildId: member.guild.id
            }
        });
        if (modNotesEntity) {
            const channel = client.channels.cache.get(modNotesEntity.channelId);
            if (channel.isTextBased()) {
                channel.send(`[${member.user}] has joined the server!`);
            }
        }
    });
    client.on(Events.GuildBanAdd, async ban => {
        const modNotesEntity = await modNotesRepo.findOne({
            where: {
                guildId: ban.guild.id
            }
        });
        if (modNotesEntity) {
            const channel = client.channels.cache.get(modNotesEntity.channelId);
            if (channel.isTextBased()) {
                channel.send(`[${ban.user}] has been banned!`);
            }
        }
    });

    client.on(Events.GuildBanRemove, async ban => {
        const modNotesEntity = await modNotesRepo.findOne({
            where: {
                guildId: ban.guild.id
            }
        });
        if (modNotesEntity) {
            const channel = client.channels.cache.get(modNotesEntity.channelId);
            if (channel.isTextBased()) {
                channel.send(`[${ban.user}] has been unbanned!`);
            }
        }
    });

    client.on(Events.GuildMemberRemove, async member => {
        const modNotesEntity = await modNotesRepo.findOne({
            where: {
                guildId: member.guild.id
            }
        });
        if (modNotesEntity) {
            let channel = client.channels.cache.get(modNotesEntity.channelId);
            if (channel.isTextBased()) {
                channel.send(`[${member.user}] has left the server!`);
            }
        }
    });

    client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
        if (oldMember.nickname !== newMember.nickname) {
            const modNotesEntity = await modNotesRepo.findOne({
                where: {
                    guildId: newMember.guild.id
                }
            });

            if (modNotesEntity) {
                const oldName = oldMember.nickname == null ? oldMember.user.username : oldMember.nickname;
                const newName = newMember.nickname == null ? newMember.user.username : newMember.nickname;
                const msg = `${oldMember.user} has changed their name!\n Old Name:[` + oldName + "]\nNew Name:[" + newName + "] !";

                console.log(msg);
                const channel = client.channels.cache.get(modNotesEntity.channelId);
                if (channel.isTextBased()) {
                    channel.send(msg);
                }
            }

        }
    });
}