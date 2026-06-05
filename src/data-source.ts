import "reflect-metadata"
import {DataSource, EntityTarget, Repository} from "typeorm"

const dataSource = new DataSource({
    type: "better-sqlite3",
    database: "billybot.db",
    synchronize: true,
    logging: process.env.NODE_ENV !== 'production',
    entities: ['dist/entity/impl/*.js'],
    subscribers: [],
    migrations: [],
})

export const getRepository = <Entity extends object>(
    target: EntityTarget<Entity>
): Repository<Entity> => {
    return dataSource.getRepository(target);
};

export default dataSource;
