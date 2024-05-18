import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import {GuildEntity} from "./GuildEntity.js";

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