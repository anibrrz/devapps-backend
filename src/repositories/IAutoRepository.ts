import { IRepository } from './IRepository';
import { Auto } from '../models/Auto';

export interface IAutoRepository extends IRepository<Auto> {
  saveWithOwner(idPersona: string, auto: Auto): boolean;
  findByFullMatch(idPersona: string, data: Omit<Auto, 'id'>): Auto | undefined;
}
