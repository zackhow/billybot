import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class ChannelBase {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public channelId: string

    @Column()
    public guildId: string

    @Column()
    public channelName: string
}