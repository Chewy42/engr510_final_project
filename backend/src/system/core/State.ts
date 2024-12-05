import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';

export interface StateOptions {
  persistence?: 'local' | 'cloud';
  backupInterval?: number; // milliseconds
  maxBackups?: number;
}

export class State {
  private state: Map<string, any>;
  private events: EventEmitter;
  private options: Required<StateOptions>;
  private backupTimer?: NodeJS.Timer;
  private lastBackup: number;

  constructor(options: StateOptions = {}) {
    this.state = new Map();
    this.events = new EventEmitter();
    this.lastBackup = Date.now();

    // Set default options
    this.options = {
      persistence: 'local',
      backupInterval: 5 * 60 * 1000, // 5 minutes
      maxBackups: 5,
      ...options
    };

    // Start backup timer if enabled
    if (this.options.persistence === 'local' && this.options.backupInterval > 0) {
      this.startBackupTimer();
    }
  }

  private startBackupTimer(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }

    this.backupTimer = setInterval(
      () => this.backup(),
      this.options.backupInterval
    );
  }

  public async set(key: string, value: any): Promise<void> {
    const oldValue = this.state.get(key);
    this.state.set(key, value);

    this.events.emit('state:updated', {
      key,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    });

    if (this.options.persistence === 'local') {
      await this.persistLocal();
    }
  }

  public get(key: string): any {
    return this.state.get(key);
  }

  public delete(key: string): boolean {
    const deleted = this.state.delete(key);
    if (deleted) {
      this.events.emit('state:deleted', {
        key,
        timestamp: Date.now()
      });
    }
    return deleted;
  }

  public clear(): void {
    this.state.clear();
    this.events.emit('state:cleared', {
      timestamp: Date.now()
    });
  }

  private async persistLocal(): Promise<void> {
    const stateDir = path.join(process.cwd(), '.state');
    const stateFile = path.join(stateDir, 'state.json');

    try {
      await fs.mkdir(stateDir, { recursive: true });
      await fs.writeFile(
        stateFile,
        JSON.stringify(Array.from(this.state.entries()), null, 2)
      );

      this.events.emit('state:persisted', {
        type: 'local',
        timestamp: Date.now()
      });
    } catch (error) {
      this.events.emit('state:error', {
        type: 'persistence',
        error: error.message,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  private async backup(): Promise<void> {
    const stateDir = path.join(process.cwd(), '.state');
    const backupDir = path.join(stateDir, 'backups');
    const backupFile = path.join(
      backupDir,
      `state_${Date.now()}.json`
    );

    try {
      // Create backup directory
      await fs.mkdir(backupDir, { recursive: true });

      // Write backup file
      await fs.writeFile(
        backupFile,
        JSON.stringify(Array.from(this.state.entries()), null, 2)
      );

      // Clean old backups
      const backups = await fs.readdir(backupDir);
      if (backups.length > this.options.maxBackups) {
        const oldBackups = backups
          .map(file => ({
            file,
            time: parseInt(file.split('_')[1])
          }))
          .sort((a, b) => b.time - a.time)
          .slice(this.options.maxBackups);

        await Promise.all(
          oldBackups.map(backup =>
            fs.unlink(path.join(backupDir, backup.file))
          )
        );
      }

      this.lastBackup = Date.now();
      this.events.emit('state:backup', {
        file: backupFile,
        timestamp: this.lastBackup
      });
    } catch (error) {
      this.events.emit('state:error', {
        type: 'backup',
        error: error.message,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  public async restore(timestamp?: number): Promise<void> {
    const stateDir = path.join(process.cwd(), '.state');
    const backupDir = path.join(stateDir, 'backups');

    try {
      let stateFile: string;

      if (timestamp) {
        // Restore from specific backup
        stateFile = path.join(backupDir, `state_${timestamp}.json`);
      } else {
        // Restore from latest state
        stateFile = path.join(stateDir, 'state.json');
      }

      const data = await fs.readFile(stateFile, 'utf-8');
      const entries = JSON.parse(data);
      
      this.state = new Map(entries);

      this.events.emit('state:restored', {
        timestamp: Date.now(),
        source: timestamp ? 'backup' : 'latest'
      });
    } catch (error) {
      this.events.emit('state:error', {
        type: 'restore',
        error: error.message,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  public on(event: string, listener: (data: any) => void): void {
    this.events.on(event, listener);
  }

  public off(event: string, listener: (data: any) => void): void {
    this.events.off(event, listener);
  }

  public getStatus(): {
    size: number;
    lastBackup: number;
    persistence: string;
  } {
    return {
      size: this.state.size,
      lastBackup: this.lastBackup,
      persistence: this.options.persistence
    };
  }
}
