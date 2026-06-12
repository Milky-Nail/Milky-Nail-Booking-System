const XLSX = require("xlsx");
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([
  ["staff_id", "work_date", "start_time", "end_time"],
  [1, new Date("2024-05-01"), new Date("2024-05-01T09:00:00Z"), new Date("2024-05-01T18:00:00Z")],
]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

const readWb = XLSX.read(buffer, { type: "buffer", cellDates: true });
const readWs = readWb.Sheets[readWb.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(readWs, { defval: "" });
console.log(jsonData[0].start_time);
console.log(jsonData[0].start_time.getHours());
console.log(jsonData[0].start_time.getUTCHours());
