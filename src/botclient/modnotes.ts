import {ChatInputCommandInteraction, Events} from "discord.js";
import {client} from "./botClient.js";
import {getRepository} from "../data-source.js";
import {ModNotes} from "../entity/impl/ModNotes.js";

const modNotesRepo = getRepository(ModNotes);

export async function enableModnotes(interaction: ChatInputCommandInteraction) {
    const modNotesEntity = await modNotesRepo.findOne({
        where: {guildId: interaction.guildId ?? undefined}
    });

    if (modNotesEntity) {
        await disableModnotes(interaction);
    }
    if (!interaction.channel || !interaction.channelId) {
        await interaction.reply('Could not determine channel.');
        return;
    }
    const channelName = 'name' in interaction.channel ? interaction.channel.name : interaction.channelId!;
    await modNotesRepo.save({
        channelId: interaction.channelId!,
        guildId: interaction.guildId ?? undefined,
        channelName,
    } as any);
    await interaction.reply(`Enabled Mod Notes on channel: ${channelName}`);
}

 export async function disableModnotes(interaction: ChatInputCommandInteraction) {
    const modNotesEntity = await modNotesRepo.findOne({
        where: {guildId: interaction.guildId ?? undefined}
    });

    if (modNotesEntity) {
        await modNotesRepo.remove(modNotesEntity);
        await interaction.reply(`Removed Mod Notes from channel: ${modNotesEntity.channelName}`);
    } else {
        await interaction.reply(`No mod notes setup on this guild!`);
    }
}

export function addModnotesListeners(): void {
    client.on(Events.GuildMemberAdd, async member => {
        const modNotesEntity = await modNotesRepo.findOne({
            where: {
                guildId: member.guild.id
            }
        });
        if (modNotesEntity) {
            const channel = client.channels.cache.get(modNotesEntity.channelId);
            if (channel && !channel.partial && channel.isTextBased()) {
                (channel as any).send(`[${member.user}] has joined the server!`);
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
            if (channel && !channel.partial && channel.isTextBased()) {
                (channel as any).send(`[${ban.user}] has been banned!`);
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
            if (channel && !channel.partial && channel.isTextBased()) {
                (channel as any).send(`[${ban.user}] has been unbanned!`);
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
                const channel = client.channels.cache.get(modNotesEntity.channelId);
                if (channel && !channel.partial && channel.isTextBased()) {
                    (channel as any).send(`[${member.user}] has left the server!`);
                }
            }
    });

    client.on(Events.GuildMemberUpdate, async (member, oldMember) => {
        if (oldMember.nickname !== member.nickname) {
            const modNotesEntity = await modNotesRepo.findOne({
                where: {
                    guildId: member.guild.id
                }
            });

            if (modNotesEntity) {
                const oldName = oldMember.nickname ?? oldMember.user.username;
                const newName = member.nickname ?? member.user.username;
                const msg = `${oldMember.user} has changed their name!\n Old Name:[${oldName}]\nNew Name:[${newName}]!`;

                const channel = client.channels.cache.get(modNotesEntity.channelId);
                if (channel && !channel.partial && channel.isTextBased()) {
                    (channel as any).send(msg);
                }
            }

        }
    });
}