export interface IRepository<T> {
  findAll(): T[];
  findById(id: string): T | undefined;
  save(entity: T): void;
  update(id: string, entity: Partial<T>): boolean;
  delete(id: string): boolean;
}
