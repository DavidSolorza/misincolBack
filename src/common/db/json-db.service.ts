import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JsonDbService {
  private readonly logger = new Logger(JsonDbService.name);
  private readonly dataDir = path.resolve(process.cwd(), 'data');

  constructor() {
    this.ensureDataDir();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getFilePath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  async read<T>(collection: string, defaultData: T[] = []): Promise<T[]> {
    const filePath = this.getFilePath(collection);
    try {
      if (!fs.existsSync(filePath)) {
        await this.write(collection, defaultData);
        return defaultData;
      }
      const raw = await fs.promises.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaultData;
    } catch (err: any) {
      this.logger.warn(`Error leyendo colección '${collection}': ${err.message}. Usando datos base.`);
      return defaultData;
    }
  }

  async write<T>(collection: string, data: T[]): Promise<void> {
    this.ensureDataDir();
    const filePath = this.getFilePath(collection);
    const tempPath = `${filePath}.tmp`;
    const serialized = JSON.stringify(data, null, 2);
    try {
      await fs.promises.writeFile(tempPath, serialized, 'utf-8');
      await fs.promises.rename(tempPath, filePath);
    } catch {
      await fs.promises.writeFile(filePath, serialized, 'utf-8');
    }
  }

  async resetCollection<T>(collection: string, cleanData: T[]): Promise<T[]> {
    await this.write(collection, cleanData);
    this.logger.log(`Colección '${collection}' restablecida a su versión limpia oficial.`);
    return cleanData;
  }
}
