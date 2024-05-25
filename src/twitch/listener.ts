import {AppTokenAuthProvider} from '@twurple/auth';
import {ApiClient} from '@twurple/api';
import {EventSubHttpListener, ReverseProxyAdapter} from "@twurple/eventsub-http";
import {streamOnline} from "../botclient/twitch.js";
import {getRepository} from "../data-source.js";
import {TwitchAlert} from "../entity/impl/TwitchAlert.js";
import {Message} from "discord.js";


const channelRepo = getRepository(TwitchAlert);

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchListenerSecret = process.env.TWITCH_LISTENER_SECRET;
const twitchCallbackHost = process.env.TWITCH_CALLBACK_HOST;

const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

let subMap = new Map<string, any>();

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
        alertStreamOnline(twitchAlert);
    }
}

export function alertStreamOnline(twitchAlert: TwitchAlert){
    let sub = listener.onStreamOnline(twitchAlert.twitchId, () => {
        if (subMap.has(String(twitchAlert.id))){
            streamOnline(twitchAlert).then((msg) => {
            if (twitchAlert.deleteMessage) {
                deleteMessageWhenOffline(twitchAlert, msg);
            }
    })}});
    subMap.set(String(twitchAlert.id), sub);
}

export function deleteMessageWhenOffline(twitchAlert: TwitchAlert, message: Message){
    const sub = listener.onStreamOffline(twitchAlert.twitchId, () => {
        message.delete();
        sub.stop();
    });
}

export function stopSub(id: string){
    let sub = subMap.get(id);
    if (sub){
        sub.stop();
        subMap.delete(id);
    }
}

export default apiClient;

