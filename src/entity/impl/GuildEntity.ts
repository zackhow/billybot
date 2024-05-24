import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class GuildEntity {
    @PrimaryColumn()
    guildId: string

    @Column()
    name: string
}