interface IRepository<T> {
  create(item: T): Promise<T>
  update(id: string, item: Partial<T>): Promise<Boolean>
  delete(id: string): Promise<Boolean>
  find(): Promise<T[]>
  findOne(id: string): Promise<T | null>
}

export default IRepository