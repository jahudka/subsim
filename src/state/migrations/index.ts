import { RawProject } from '../types';
import { migration001 } from './migration001';
import { migration002 } from './migration002';
import { migration003 } from './migration003';
import { migration004 } from './migration004';

const migrations = [
  migration001,
  migration002,
  migration003,
  migration004,
];

export function migrate(data: RawProject[]): RawProject[] {
  for (const applyMigration of migrations) {
    data = applyMigration(data);
  }

  return data;
}
