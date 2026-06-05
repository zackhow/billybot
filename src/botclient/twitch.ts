import {getRepository} from "../data-source.js";
import {TwitchAlert} from "../entity/impl/TwitchAlert.js";
import client from "./botClient.js";
import {CacheType, ChatInputCommandInteraction, Message} from "discord.js";
import apiClient, {alertStreamOnline, stopSub} from "../twitch/listener.js";

const channelRepo = getRepository(TwitchAlert);

export async function enableTwitchStreamOnline(interaction: ChatInputCommandInteraction<CacheType>) {
    const streamer = interaction.options.getString('streamer');
    if (!streamer) {
        await interaction.reply('Please provide a streamer name!');
        return;
    }
    const actionEntry = await channelRepo.findOne({
        where: {
            guildId: interaction.guildId ?? undefined,
            twitchName: streamer
        }
    });

    if (actionEntry) {
        await interaction.reply(`Action already setup on channel: ${actionEntry.channelName}! Run '/twitchstreamonlineclear' to clear.`);
    } else {
        const user = await apiClient.users.getUserByName(streamer);
        if (!user) {
            await interaction.reply(`Twitch user ${streamer} not found!`);
            return;
        }
        if (!interaction.channel || !interaction.channelId) {
            await interaction.reply('Could not determine channel.');
            return;
        }
        const channelId = interaction.channelId!;
        const guildId = interaction.guildId!;
        const channelName = 'name' in interaction.channel ? interaction.channel.name : channelId;
        const twitchAlert = await channelRepo.save({
            channelId,
            guildId: guildId ?? undefined,
            channelName,
            twitchId: user.id,
            twitchName: streamer,
            deleteMessage: interaction.options.getBoolean('deleteonoffline') ?? false,
            onlineNote: interaction.options.getString('onlinenote') ?? undefined
        });
        alertStreamOnline(twitchAlert);
        await interaction.reply(`Enabled Twitch Stream Online on channel: ${channelName}`);
    }
}

export async function disableTwitchStreamOnline(interaction: ChatInputCommandInteraction<CacheType>) {
    const streamer = interaction.options.getString('streamer');
    if (!streamer) {
        await interaction.reply('Please provide a streamer name!');
        return;
    }
    const actionEntry = await channelRepo.findOne({
        where: {
            guildId: interaction.guildId ?? undefined,
            twitchName: streamer
        }
    });
    if (actionEntry) {
        stopSub(String(actionEntry.id));
        await channelRepo.remove(actionEntry);
        await interaction.reply(`Removed Twitch notifications for ${actionEntry.twitchName}`);
    } else {
        await interaction.reply(`No action setup on this channel for ${streamer}!`);
    }
}

 export async function streamOnline(twitchAlert: TwitchAlert): Promise<Message<boolean> | undefined> {
    const channel = client.channels.cache.get(twitchAlert.channelId);
    console.log("stream is online " + twitchAlert.twitchId);
    if (channel?.isTextBased()) {
        let message = `https://www.twitch.tv/${twitchAlert.twitchName}\n@everyone ${twitchAlert.twitchName} is now streaming!`;
        if (twitchAlert.onlineNote) {
            message = twitchAlert.onlineNote;
        }
        return await channel.send(message);
    }
    return undefined;
}