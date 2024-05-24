import {getRepository} from "../data-source.js";
import {TwitchAlert} from "../entity/impl/TwitchAlert.js";
import client from "./botClient.js";
import {Message} from "discord.js";

const channelRepo = getRepository(TwitchAlert);

export async function enableTwitchStreamOnline(interaction){
    const actionEntry = await channelRepo.findOne({
        where: {guildId: interaction.guildId,
                twitchName: interaction.options.getString('streamer')}
    });

    if (actionEntry) {
        await interaction.reply(`Action already setup on name: ${actionEntry.channelName}! run '/twitchstreamonlineclear to clear'`);
    } else {
        await channelRepo.save(
            {
                channelId: interaction.channelId,
                guildId: interaction.guildId,
                channelName: interaction.channel.name,
                twitchName: interaction.options.getString('streamer'),
            }
        );
        await interaction.reply(`Enabled Twitch Stream Online on name: ${interaction.channel.name}`)
    }
}

export async function streamOnline(twitchAlert: TwitchAlert) : Promise<Message> {
    const channel = client.channels.cache.get(twitchAlert.channelId);
    console.log("stream is online " + twitchAlert.twitchName);
    if (channel.isTextBased()) {

        let message = `https://www.twitch.tv/${twitchAlert.twitchName}\nThe Twitch stream ${twitchAlert.twitchName} is now online!`;
        if (twitchAlert.onlineNote)
        {
            message = twitchAlert.onlineNote;
        }
        return await channel.send(message);
    }
}