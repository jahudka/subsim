import { Project } from '../types';
import { migration001 } from './migration001';
import { migration002 } from './migration002';

const migrations = [
  migration001,
  migration002,
];

export function migrate(data: Project[]): Project[] {
  for (const applyMigration of migrations) {
    data = applyMigration(data);
  }

  return data;
}
