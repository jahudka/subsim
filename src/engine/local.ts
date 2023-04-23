import { Guide, Source } from '../state';
import { safeDeepClone } from '../utils';
import { Engine } from './engine';

export class LocalEngine extends Engine {
  mergeSource(source: Source) {
    super.mergeSource(safeDeepClone(source));
  }

  mergeGuide(guide: Guide) {
    super.mergeGuide(safeDeepClone(guide));
  }
}
