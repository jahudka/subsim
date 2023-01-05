import { Project } from '../types';
import { migration001 } from './migration001';

const migrations = [
  migration001,
];

export function migrate(data: Project[]): Project[] {
  for (const applyMigration of migrations) {
    data = applyMigration(data);
  }

  return data;
}
