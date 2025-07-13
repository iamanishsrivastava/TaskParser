// src/utils/extractDate.mts
import {
  parse,
  isValid,
  addDays,
  addWeeks,
  addMonths,
  setHours,
  setMinutes,
} from "date-fns";

const dateKeywords: Record<string, () => Date> = {
  yesterday: () => addDays(new Date(), -1),
  today: () => new Date(),
  tomorrow: () => addDays(new Date(), 1),
  tonight: () => setHours(new Date(), 21),
  "next week": () => addWeeks(new Date(), 1),
  "next month": () => addMonths(new Date(), 1),
};

export function extractDate(input: string): {
  date: Date | null;
  phrase: string | null;
} {
  if (!input || typeof input !== "string") {
    return { date: null, phrase: null };
  }

  const lower = input.toLowerCase();

  for (const [keyword, getDate] of Object.entries(dateKeywords)) {
    if (lower.includes(keyword)) {
      const time = extractTime(lower);
      let base = getDate();
      if (time) base = setTime(base, time);
      return { date: base, phrase: keyword + (time ? ` ${time.raw}` : "") };
    }
  }

  const isoMatch = input.match(/\d{4}-\d{2}-\d{2}/);

  if (isoMatch) {
    const date = parse(isoMatch[0], "yyyy-MM-dd", new Date());
    return isValid(date)
      ? { date, phrase: isoMatch[0] }
      : { date: null, phrase: null };
  }

  return { date: null, phrase: null };
}

function extractTime(input: string): { hour: number; raw: string } | null {
  const match = input.match(/(\d{1,2})(am|pm)/i);
  if (!match || match.length < 3) return null;

  let hour = parseInt(match[1]);
  const meridian = match[2]?.toLowerCase();

  if (meridian === "pm" && hour < 12) hour += 12;
  if (meridian === "am" && hour === 12) hour = 0;

  return { hour, raw: match[0] };
}

function setTime(date: Date, time: { hour: number }): Date {
  return setMinutes(setHours(date, time.hour), 0);
}
