interface WeeklySchedule {
  weekNumber: number;
  weekLabel: string;           // "Minggu 1", "Minggu 2"
  dateRange: string;            // "10-16 Jul 2025"
  cpCode: string | null;        // null if holiday
  cpName: string | null;
  materiPokok: string;
  isHoliday: boolean;
  holidayName?: string;
  allocatedHours?: number;
}

interface Holiday {
  name: string;
  startDate: string;
  endDate: string;
}

interface ProsemGeneratorInput {
  protaId: string;
  simpleCalendarId: string;
  competencies: Array<{
    cpCode: string;
    cpName: string;
    allocatedWeeks: number;
  }>;
  startDate: string;            // "2025-07-10"
  endDate: string;
  holidays: Holiday[];
}

interface ProsemGeneratorOutput {
  weeklySchedule: WeeklySchedule[];
  totalWeeks: number;
  effectiveWeeks: number;
  holidayWeeks: number;
}

export class ProsemGenerator {
  private input: ProsemGeneratorInput;

  constructor(input: ProsemGeneratorInput) {
    this.input = input;
  }

  generate(): ProsemGeneratorOutput {
    const weeklySchedule: WeeklySchedule[] = [];
    const startDate = new Date(this.input.startDate);
    const endDate = new Date(this.input.endDate);

    let currentDate = new Date(startDate);
    let weekNumber = 1;
    let effectiveWeekCount = 0;

    // Expand competencies to weeks
    const cpWeeks: Array<{ cpCode: string; cpName: string }> = [];
    this.input.competencies.forEach((cp) => {
      for (let i = 0; i < cp.allocatedWeeks; i++) {
        cpWeeks.push({ cpCode: cp.cpCode, cpName: cp.cpName });
      }
    });

    let cpIndex = 0;

    while (currentDate <= endDate) {
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekRange = this.formatDateRange(currentDate, weekEnd);
      const holiday = this.getHolidayForWeek(currentDate, weekEnd);

      if (holiday) {
        // Holiday week
        weeklySchedule.push({
          weekNumber,
          weekLabel: `Minggu ${weekNumber}`,
          dateRange: weekRange,
          cpCode: null,
          cpName: null,
          materiPokok: `[LIBUR: ${holiday.name}]`,
          isHoliday: true,
          holidayName: holiday.name,
        });
      } else {
        // Effective week
        const cp = cpWeeks[cpIndex];
        if (cp) {
          weeklySchedule.push({
            weekNumber,
            weekLabel: `Minggu ${weekNumber}`,
            dateRange: weekRange,
            cpCode: cp.cpCode,
            cpName: cp.cpName,
            materiPokok: `Materi ${cp.cpName} - Bagian ${effectiveWeekCount + 1}`,
            isHoliday: false,
            allocatedHours: 4, // Default 4 jam per minggu
          });
          cpIndex++;
          effectiveWeekCount++;
        }
      }

      weekNumber++;
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return {
      weeklySchedule,
      totalWeeks: weeklySchedule.length,
      effectiveWeeks: effectiveWeekCount,
      holidayWeeks: weeklySchedule.length - effectiveWeekCount,
    };
  }

  private formatDateRange(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = start.toLocaleDateString('id-ID', options);
    const endStr = end.toLocaleDateString('id-ID', options);
    return `${startStr} - ${endStr}`;
  }

  private getHolidayForWeek(weekStart: Date, weekEnd: Date): Holiday | null {
    return this.input.holidays.find((h) => {
      const hStart = new Date(h.startDate);
      const hEnd = new Date(h.endDate);
      return (hStart <= weekEnd && hEnd >= weekStart);
    }) || null;
  }
}
