import "reflect-metadata"
import {DataSource, Entity, EntityTarget, Repository} from "typeorm"
import { ActionEntry } from "./entity/ActionEntry.js"
import { GuildEntity } from "./entity/GuildEntity.js"
import exp from "constants";

const dataSource = new DataSource({
    type: "better-sqlite3",
    database: "billybot.db",
    synchronize: true,
    logging: true,
    entities: [ActionEntry, GuildEntity],
    subscribers: [],
    migrations: [],
})

export const getRepository = <Entity extends object>(
    target: EntityTarget<Entity>
): Repository<Entity> => {
    return dataSource.getRepository(target);
};

export default dataSource;
