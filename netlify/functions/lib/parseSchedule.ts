import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import type { Element } from 'domhandler';

export interface Lesson {
  period: string;
  time: string;
  subject: string;
  teacher: string;
  note: string;
}

export interface DaySchedule {
  day: string;
  lessons: Lesson[];
}

interface SpanEntry {
  remaining: number;
  value: string;
}

/**
 * Converts a <table> element into a 2D matrix of text values,
 * correctly resolving rowspan/colspan (standard HTML table normalization).
 */
function tableToMatrix($: cheerio.CheerioAPI, table: Element): string[][] {
  const rows = $(table).find('tr').toArray();
  const matrix: string[][] = [];
  const spanMap: Record<number, SpanEntry> = {};

  for (const tr of rows) {
    const row: string[] = [];
    let col = 0;
    const cells = $(tr).find('td').toArray();
    let cellIdx = 0;

    while (true) {
      if (spanMap[col] && spanMap[col].remaining > 0) {
        row.push(spanMap[col].value);
        spanMap[col].remaining -= 1;
        col += 1;
        continue;
      }
      if (cellIdx >= cells.length) break;

      const td = cells[cellIdx];
      const text = $(td).text().replace(/\s+/g, ' ').trim();
      const colspan = parseInt($(td).attr('colspan') || '1', 10);
      const rowspan = parseInt($(td).attr('rowspan') || '1', 10);

      for (let i = 0; i < colspan; i++) {
        row.push(text);
        if (rowspan > 1) {
          spanMap[col] = { remaining: rowspan - 1, value: text };
        }
        col += 1;
      }
      cellIdx += 1;
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Parses the ГГПК schedule page (windows-1251 encoded) and returns
 * a clean schedule for the requested group, e.g. "ПГБ-121".
 */
export function parseSchedule(htmlBuffer: Buffer | string, groupName: string): DaySchedule[] {
  // The page is windows-1251 encoded, so we decode raw bytes.
  const html = Buffer.isBuffer(htmlBuffer) ? iconv.decode(htmlBuffer, 'win1251') : htmlBuffer;

  const $ = cheerio.load(html);
  const tables = $('table').toArray();
  const result: DaySchedule[] = [];

  for (const table of tables) {
    const matrix = tableToMatrix($, table as Element);
    if (matrix.length < 2) continue;

    const header = matrix[0];
    const groupCol = header.findIndex((h) => h === groupName);
    if (groupCol === -1) continue; // group not present in this table

    const dayLabel = matrix[1][0]; // date/day row, first cell (colspan covers whole row)

    const lessons: Lesson[] = [];
    // rows 2.. are lesson blocks of 3 rows: subject / teacher / note
    for (let i = 2; i < matrix.length; i += 3) {
      const subjectRow = matrix[i];
      const teacherRow = matrix[i + 1];
      const noteRow = matrix[i + 2];
      if (!subjectRow) break;

      const period = subjectRow[0];
      const time = subjectRow[1];
      const subject = (subjectRow[groupCol] || '').trim();
      const teacher = teacherRow ? (teacherRow[groupCol] || '').trim() : '';
      const note = noteRow ? (noteRow[groupCol] || '').trim() : '';

      if (subject || teacher || note) {
        lessons.push({ period, time, subject, teacher, note });
      }
    }

    result.push({ day: dayLabel, lessons });
  }

  return result;
}
