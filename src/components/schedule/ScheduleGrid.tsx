// src/components/schedule/ScheduleGrid.tsx
'use client';

import React from 'react';

interface Schedule {
  scheduleId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  subject: {
    subjectName: string;
    subjectCode?: string | null;
  };
  teacher: {
    fullName: string;
  };
}

interface ScheduleGridProps {
  schedules: Schedule[];
  onEdit?: (scheduleId: string) => void;
  onDelete?: (scheduleId: string) => void;
}

const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

export default function ScheduleGrid({ schedules, onEdit, onDelete }: ScheduleGridProps) {
  // Helper: Cek apakah jadwal ada di slot tertentu
  const getScheduleForSlot = (day: number, time: string) => {
    return schedules.find(s => {
      if (s.dayOfWeek !== day) return false;
      // Cek apakah time slot berada dalam range jadwal
      return s.startTime <= time && s.endTime > time;
    });
  };

  // Helper: Hitung berapa row yang harus di-span
  const calculateRowSpan = (schedule: Schedule) => {
    const startIndex = TIME_SLOTS.indexOf(schedule.startTime);
    const endIndex = TIME_SLOTS.findIndex(t => t >= schedule.endTime);
    if (startIndex === -1 || endIndex === -1) return 1;
    return endIndex - startIndex;
  };

  // Track cells yang sudah di-render (untuk rowspan)
  const renderedCells = new Set<string>();

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="border border-gray-300 p-3 text-sm font-semibold text-gray-700 w-24">
              Waktu
            </th>
            {[1, 2, 3, 4, 5].map((day) => (
              <th key={day} className="border border-gray-300 p-3 text-sm font-semibold text-gray-700">
                {DAY_NAMES[day]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time, timeIdx) => (
            <tr key={timeIdx} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2 text-xs text-center font-medium text-gray-600 bg-gray-50">
                {time}
              </td>
              {[1, 2, 3, 4, 5].map((day) => {
                const cellKey = `${day}-${time}`;
                
                // Skip jika cell ini sudah di-render sebagai bagian dari rowspan
                if (renderedCells.has(cellKey)) {
                  return null;
                }

                const schedule = getScheduleForSlot(day, time);

                // Jika ada jadwal dan ini adalah slot pertama dari jadwal tersebut
                if (schedule && schedule.startTime === time) {
                  const rowSpan = calculateRowSpan(schedule);
                  
                  // Mark cells yang akan di-span
                  for (let i = 0; i < rowSpan; i++) {
                    if (TIME_SLOTS[timeIdx + i]) {
                      renderedCells.add(`${day}-${TIME_SLOTS[timeIdx + i]}`);
                    }
                  }

                  return (
                    <td
                      key={day}
                      rowSpan={rowSpan}
                      className="border border-gray-300 p-2 align-top"
                    >
                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-2 h-full">
                        <div className="font-semibold text-sm text-blue-900 mb-1">
                          {schedule.subject.subjectName}
                        </div>
                        <div className="text-xs text-gray-700 mb-1">
                          {schedule.teacher.fullName}
                        </div>
                        {schedule.room && (
                          <div className="text-xs text-gray-500 mb-1">
                            📍 {schedule.room}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          ⏰ {schedule.startTime} - {schedule.endTime}
                        </div>
                        
                        {(onEdit || onDelete) && (
                          <div className="flex gap-1 mt-2">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(schedule.scheduleId)}
                                className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                              >
                                Edit
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(schedule.scheduleId)}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                }

                // Jika tidak ada jadwal di slot ini
                if (!schedule) {
                  return (
                    <td key={day} className="border border-gray-300 p-2 bg-white h-16">
                      {/* Empty cell */}
                    </td>
                  );
                }

                return null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
