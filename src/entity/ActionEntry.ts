import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class ActionEntry {

    @PrimaryColumn()
    channelId: string

    @Column()
    guildId: string

    @Column()
    channelName: string

    @Column()
    action: string
}