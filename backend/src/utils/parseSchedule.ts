import XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Schedule {
  staff_id: number;
  start_time: string;
  end_time: string;
  work_date: string;
  status: "active" | "cancelled";
}

export interface ErrorMessage {
  row: number;
  message: string;
}

interface RawExcelRow {
  staff_id?: string | number;
  start_time?: string | Date;
  end_time?: string | Date;
  work_date?: string | Date;
  [key: string]: string | number | Date | undefined;
}

const toUTC = (dateStr: string, timeInput: string | Date): string | null => {
  let timePart: string = "";

  if (timeInput instanceof Date) {
    // xlsx parses time as UTC Date objects (e.g., 09:00 -> 1899-12-30T09:00:00.000Z)
    // We MUST use getUTCHours to get the correct time regardless of the server's timezone
    const hour = timeInput.getUTCHours().toString().padStart(2, "0");
    const min = timeInput.getUTCMinutes().toString().padStart(2, "0");
    timePart = `${hour}:${min}`;
  } else if (typeof timeInput === "string") {
    timePart = timeInput.trim();
  }

  if (!timePart) return null;

  const combined = dayjs.tz(`${dateStr} ${timePart}`, "Asia/Taipei");
  // toISOString automatically converts the Taipei time to UTC correctly (e.g. 09:00 Taipei -> 01:00 UTC)
  return combined.toISOString();
};

export function parseScheduleExcel(buffer: Buffer) {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellDates: true,
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const jsonData = XLSX.utils.sheet_to_json<RawExcelRow>(sheet, {
    defval: "",
  });

  const errors: ErrorMessage[] = [];
  const records: Schedule[] = [];

  jsonData.forEach((datum, index) => {
    const rowNum = index + 2;

    const rawStaffId = datum["staff_id"];
    const staffId =
      typeof rawStaffId === "string"
        ? parseInt(rawStaffId, 10)
        : Number(rawStaffId);

    const startTime = datum["start_time"];
    const endTime = datum["end_time"];
    const workDate = datum["work_date"];

    if (!staffId || isNaN(staffId)) {
      errors.push({ row: rowNum, message: "員工編號應為有效數字" });
      return;
    }

    if (!startTime || !endTime || !workDate) {
      errors.push({ row: rowNum, message: "日期與上下班時間不可為空" });
      return;
    }

    let parsedDate: string = "";
    if (workDate instanceof Date) {
      // xlsx creates Date objects in UTC. Using dayjs.utc prevents timezone shifts
      // where 2024-05-01T00:00:00Z in a UTC-8 server becomes 2024-04-30
      parsedDate = dayjs.utc(workDate).format("YYYY-MM-DD");
    } else {
      parsedDate = dayjs(String(workDate)).format("YYYY-MM-DD");
    }

    if (parsedDate === "Invalid Date") {
      errors.push({ row: rowNum, message: `日期格式無效` });
      return;
    }

    const parsedStartTime = toUTC(parsedDate, startTime);
    const parsedEndTime = toUTC(parsedDate, endTime);

    if (!parsedStartTime || !parsedEndTime) {
      errors.push({ row: rowNum, message: "時間格式錯誤" });
      return;
    }

    if (dayjs(parsedEndTime).isBefore(dayjs(parsedStartTime))) {
      errors.push({ row: rowNum, message: "下班時間不可早於上班時間" });
      return;
    }

    records.push({
      staff_id: staffId,
      start_time: parsedStartTime,
      end_time: parsedEndTime,
      work_date: parsedDate,
      status: "active",
    });
  });

  return { records, errors };
}
