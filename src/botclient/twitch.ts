import {getRepository} from "../data-source.js";
import {TwitchAlert} from "../entity/impl/TwitchAlert.js";
import client from "./botClient.js";
import {CacheType, ChatInputCommandInteraction, Message} from "discord.js";
import apiClient, {alertStreamOnline, stopSub} from "../twitch/listener.js";

const channelRepo = getRepository(TwitchAlert);

export async function enableTwitchStreamOnline(interaction: ChatInputCommandInteraction<CacheType>) {
    const actionEntry = await channelRepo.findOne({
        where: {
            guildId: interaction.guildId,
            twitchName: interaction.options.getString('streamer')
        }
    });

    if (actionEntry) {
        await interaction.reply(`Action already setup on name: ${actionEntry.channelName}! run '/twitchstreamonlineclear to clear'`);
    } else {
        const user = await apiClient.users.getUserByName(interaction.options.getString('streamer'));
        const twitchAlert = await channelRepo.save(
            {
                channelId: interaction.channelId,
                guildId: interaction.guildId,
                channelName: interaction.channel.name,
                twitchId: user.id,
                twitchName: interaction.options.getString('streamer'),
                deleteMessage: interaction.options.getBoolean('deleteonoffline')
            }
        );
        alertStreamOnline(twitchAlert);
        await interaction.reply(`Enabled Twitch Stream Online on name: ${interaction.channel.name}`)
    }
}

export async function disableTwitchStreamOnline(interaction: ChatInputCommandInteraction<CacheType>){
    const actionEntry = await channelRepo.findOne({
        where: {guildId: interaction.guildId,
            twitchName: interaction.options.getString('streamer')}
    });
    if (actionEntry) {
        await channelRepo.remove(actionEntry);
        stopSub(String(actionEntry.id));
        await interaction.reply(`Removed Twitch notifications for ${actionEntry.twitchName}`);
    } else {
        await interaction.reply(`No action setup on this channel for ${interaction.options.getString('streamer')}!`);
    }
}

export async function streamOnline(twitchAlert: TwitchAlert) : Promise<Message> {
    const channel = client.channels.cache.get(twitchAlert.channelId);
    console.log("stream is online " + twitchAlert.twitchId);
    if (channel.isTextBased()) {

        let message = `https://www.twitch.tv/${twitchAlert.twitchName}\n@everyone ${twitchAlert.twitchName} is now streaming!`;
        if (twitchAlert.onlineNote)
        {
            message = twitchAlert.onlineNote;
        }
        return await channel.send(message);
    }
}