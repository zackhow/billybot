import {Column, Entity} from "typeorm";
import {ChannelBase} from "../ChannelBase.js";


@Entity()
export class TwitchAlert extends ChannelBase{
    @Column()
    public twitchName: string;

    @Column({nullable: true})
    public onlineNote: string;

    @Column({default: false})
    public deleteMessage: boolean = false;
}