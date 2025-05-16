import process from 'process';
import { IRepository } from './IRepository';
import { Persona } from '../models/Persona';
import { Auto } from '../models/Auto';
import { PersonaStaticRepository } from './PersonaStaticRepository';

export abstract class RepositoryFactory {
    private static personaRepositorySingletonInstance: IRepository<Persona> | undefined = undefined;
    private static autoRepositorySingletonInstance: IRepository<Auto> | undefined = undefined;

    public static personaRepository(): IRepository<Persona> {
        if (RepositoryFactory.personaRepositorySingletonInstance === undefined) {
            RepositoryFactory.personaRepositorySingletonInstance =
                RepositoryFactory.getPersonaRepositoryByConfiguration();
        }
        return RepositoryFactory.personaRepositorySingletonInstance;
    }

    /*public static autoRepository(): IRepository<Auto> {
        if (RepositoryFactory.autoRepositorySingletonInstance === undefined) {
            RepositoryFactory.autoRepositorySingletonInstance = RepositoryFactory.getAutoRepositoryByConfiguration();
        }
        return RepositoryFactory.autoRepositorySingletonInstance;
    }
*/
    private static getPersonaRepositoryByConfiguration(): IRepository<Persona> {
        if (process.env.REPOSITORY === 'transient') {
            return new PersonaStaticRepository();
        }
        // Default es transient
        return new PersonaStaticRepository();
    }

    /*private static getAutoRepositoryByConfiguration(): IRepository<Auto> {
        if (process.env.REPOSITORY === 'transient') {
            return new AutoTransientRepository();
        }
        // Default es transient
        return new AutoTransientRepository();
    }
        */
}
