import process from 'process';
import { IPersonaRepository } from './IPersonaRepository';
import { IAutoRepository } from './IAutoRepository';
import { PersonaTransientRepository } from './Transient/PersonaTransientRepository';
import { AutoTransientRepository } from './Transient/AutoTransientRepository';

export abstract class RepositoryFactory {
  private static personaRepositorySingletonInstance: IPersonaRepository | undefined = undefined;
  private static autoRepositorySingletonInstance: IAutoRepository | undefined = undefined;

  public static personaRepository(): IPersonaRepository {
    if (this.personaRepositorySingletonInstance === undefined) {
      this.personaRepositorySingletonInstance = this.getPersonaRepositoryByConfiguration();
    }
    return this.personaRepositorySingletonInstance;
  }

  public static autoRepository(): IAutoRepository {
    if (this.autoRepositorySingletonInstance === undefined) {
      this.autoRepositorySingletonInstance = this.getAutoRepositoryByConfiguration();
    }
    return this.autoRepositorySingletonInstance;
  }

  private static getPersonaRepositoryByConfiguration(): IPersonaRepository {
    if (process.env.REPOSITORY === 'transient') {
      return new PersonaTransientRepository();
    }
    return new PersonaTransientRepository();
  }

  private static getAutoRepositoryByConfiguration(): IAutoRepository {
    if (process.env.REPOSITORY === 'transient') {
      return new AutoTransientRepository();
    }
    return new AutoTransientRepository();
  }
}
