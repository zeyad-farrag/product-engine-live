// No database needed — Product Engine Dashboard reads from GitHub API / mock data
export interface IStorage {}
export class MemoryStorage implements IStorage {}
export const storage = new MemoryStorage();
