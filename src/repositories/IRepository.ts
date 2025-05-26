export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
  save(entity: T): Promise<void>;
  update(id: string, entity: Partial<T>): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
