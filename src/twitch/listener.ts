import {AppTokenAuthProvider} from '@twurple/auth';
import {ApiClient, HelixUserApi} from '@twurple/api';
import {EventSubHttpListener, ReverseProxyAdapter} from "@twurple/eventsub-http";
import {streamOnline} from "../botclient/twitch.js";
import dataSource, {getRepository} from "../data-source.js";
import {TwitchAlert} from "../entity/impl/TwitchAlert.js";
import {Message} from "discord.js";


const channelRepo = getRepository(TwitchAlert);

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchListenerSecret = process.env.TWITCH_LISTENER_SECRET;
const twitchCallbackHost = process.env.TWITCH_CALLBACK_HOST;

const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

export const listener = new EventSubHttpListener({
    apiClient,
    adapter: new ReverseProxyAdapter({
        hostName: twitchCallbackHost, // The host name the server is available from
        port: 8080 // The port to listen on, defaults to 8080
    }),
    secret: twitchListenerSecret
});

export async function startListeners() {
    let allChannels = await channelRepo.find();

    for (const twitchAlert of allChannels) {

        const user = await apiClient.users.getUserByName(twitchAlert.twitchName);

        listener.onStreamOnline(user.id, () => streamOnline(twitchAlert).then((msg) => {
            if (twitchAlert.deleteMessage) {
                deleteMessageWhenOffline(twitchAlert, msg);
            }
            }));
    }
}

export function deleteMessageWhenOffline(twitchAlert: TwitchAlert, message: Message){
    const sub = listener.onStreamOffline(twitchAlert.twitchName, () => {
        message.delete();
    });
    sub.stop();
}


