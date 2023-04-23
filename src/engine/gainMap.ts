import { ArrivalMap } from './arrivalMap';
import { dbToGain, gainToDb } from '../utils';

export class GainMap {
  private readonly arrivals: ArrivalMap;
  private frequency: number = 60;
  private gain: number = 0;

  constructor(arrivals: ArrivalMap) {
    this.arrivals = arrivals;
  }

  setOptions(frequency: number, gain: number): void {
    this.frequency = frequency;
    this.gain = gain;
  }

  // should return value in dB
  get(x: number, y: number): number {
    // This amazing algorithm was derived from https://ccrma.stanford.edu/~jos/filters/Proof_Using_Trigonometry.html
    // 'ac' and 'as' are 'x' and 'y' - the sums of cosines and sines of each wave's phase multiplied by its gain
    const [ac, as] = this.arrivals.get(x, y).reduce(([ac, as], [source, arrival]) => {
      const delay = source.delay.value / 1000 + arrival.delay;
      const phase = 2 * Math.PI * (this.frequency * delay + (source.invert ? 0.5 : 0));
      const gain = dbToGain(source.gain.value) * arrival.gain;
      return [ac + gain * Math.cos(phase), as + gain * Math.sin(phase)];
    }, [0, 0]);

    return gainToDb(Math.sqrt(ac ** 2 + as ** 2)) + this.gain;
  }

  isEmpty(): boolean {
    return this.arrivals.isEmpty();
  }
}
