import "reflect-metadata"
import {DataSource, EntityTarget, Repository} from "typeorm"

const dataSource = new DataSource({
    type: "better-sqlite3",
    database: "billybot.db",
    synchronize: true,
    logging: true,
    entities: ['src/entity/impl/*.js'],
    subscribers: [],
    migrations: [],
})

export const getRepository = <Entity extends object>(
    target: EntityTarget<Entity>
): Repository<Entity> => {
    return dataSource.getRepository(target);
};

export default dataSource;
