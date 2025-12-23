interface Competency {
  cpCode: string;
  cpName: string;
  allocatedWeeks?: number;  // Will be calculated
  percentage?: number;
}

interface ProtaGeneratorInput {
  simpleCalendarId: string;
  mapelCode: string;
  mapelName: string;
  cpList: Array<{ cpCode: string; cpName: string }>;
  strategy: 'proportional' | 'linear' | 'manual';
  manualAllocations?: Record<string, number>;  // For manual strategy
}

interface ProtaGeneratorOutput {
  competencies: Competency[];
  totalWeeks: number;
  strategy: string;
}

export class ProtaGenerator {
  private input: ProtaGeneratorInput;
  private effectiveWeeks: number;

  constructor(input: ProtaGeneratorInput, effectiveWeeks: number) {
    this.input = input;
    this.effectiveWeeks = effectiveWeeks;
  }

  generate(): ProtaGeneratorOutput {
    let competencies: Competency[];

    switch (this.input.strategy) {
      case 'proportional':
        competencies = this.generateProportional();
        break;
      case 'linear':
        competencies = this.generateLinear();
        break;
      case 'manual':
        competencies = this.generateManual();
        break;
      default:
        throw new Error(`Unknown strategy: ${this.input.strategy}`);
    }

    return {
      competencies,
      totalWeeks: this.effectiveWeeks,
      strategy: this.input.strategy,
    };
  }

  private generateProportional(): Competency[] {
    const cpCount = this.input.cpList.length;
    const baseWeeks = Math.floor(this.effectiveWeeks / cpCount);
    const remainder = this.effectiveWeeks % cpCount;

    return this.input.cpList.map((cp, index) => ({
      cpCode: cp.cpCode,
      cpName: cp.cpName,
      allocatedWeeks: baseWeeks + (index < remainder ? 1 : 0),
      percentage: ((baseWeeks + (index < remainder ? 1 : 0)) / this.effectiveWeeks) * 100,
    }));
  }

  private generateLinear(): Competency[] {
    // Equal distribution
    const weeksPerCp = Math.floor(this.effectiveWeeks / this.input.cpList.length);
    
    return this.input.cpList.map((cp) => ({
      cpCode: cp.cpCode,
      cpName: cp.cpName,
      allocatedWeeks: weeksPerCp,
      percentage: (weeksPerCp / this.effectiveWeeks) * 100,
    }));
  }

  private generateManual(): Competency[] {
    if (!this.input.manualAllocations) {
      throw new Error('Manual allocations required for manual strategy');
    }

    return this.input.cpList.map((cp) => ({
      cpCode: cp.cpCode,
      cpName: cp.cpName,
      allocatedWeeks: this.input.manualAllocations![cp.cpCode] || 0,
      percentage: ((this.input.manualAllocations![cp.cpCode] || 0) / this.effectiveWeeks) * 100,
    }));
  }
}
