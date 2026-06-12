import fs from 'fs';
import { parseScheduleExcel } from './src/utils/parseSchedule.js';
import XLSX from 'xlsx';

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  ["staff_id", "work_date", "start_time", "end_time"],
  [1, new Date("2024-05-01"), new Date("2024-05-01T09:00:00Z"), new Date("2024-05-01T18:00:00Z")],
]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

try {
    const result = parseScheduleExcel(buffer);
    console.log("Success:", result);
} catch (e) {
    console.error("Error:", e);
}
