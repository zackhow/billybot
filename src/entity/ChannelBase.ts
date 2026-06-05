import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


export abstract class ChannelBase {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public channelId!: string;

    @Column()
    public guildId!: string;

    @Column()
    public channelName!: string;
}