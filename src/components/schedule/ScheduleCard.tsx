// src/components/schedule/ScheduleCard.tsx
'use client';

import React from 'react';

interface ScheduleCardProps {
  schedule: {
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
    class: {
      className: string;
    };
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{schedule.subject.subjectName}</h3>
          <p className="text-sm text-gray-600">{schedule.class.className}</p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
          {DAY_NAMES[schedule.dayOfWeek]}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <span>👨‍🏫</span>
          <span>{schedule.teacher.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏰</span>
          <span>{schedule.startTime} - {schedule.endTime}</span>
        </div>
        {schedule.room && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{schedule.room}</span>
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-3 border-t">
          {onEdit && (
            <button
              onClick={() => onEdit(schedule.scheduleId)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 rounded font-medium transition"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(schedule.scheduleId)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded font-medium transition"
            >
              Hapus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
