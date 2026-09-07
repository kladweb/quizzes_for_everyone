import type { DaySchedule } from './parseSchedule';

export function formatSchedule(schedule: DaySchedule[], groupName: string): string {
  const lines: string[] = [`📅 Расписание ${groupName} обновилось:`, ''];

  for (const day of schedule) {
    if (!day.lessons.length) continue;
    lines.push(`*${day.day}*`);
    for (const lesson of day.lessons) {
      const timeShort = lesson.time.replace(/\s+/g, ' ');
      let line = `${lesson.period}. ${timeShort} — ${lesson.subject || '—'}`;
      if (lesson.teacher) line += `\n    👤 ${lesson.teacher}`;
      // "note" is only meaningful (subgroup/room) when it differs from the teacher line
      if (lesson.note && lesson.note !== lesson.teacher) line += ` (${lesson.note})`;
      lines.push(line);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}
