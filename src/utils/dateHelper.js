/**
 * Helper to parse Vietnamese date strings from the timeline
 * Handles formats like: 
 * - "Tháng 03.2026"
 * - "31.03.2026"
 * - "06/04/2026"
 * - "09-10.04.2026"
 */
export const parseTimelineDate = (dateStr) => {
  if (!dateStr) return new Date(2099, 11, 31);
  
  const cleanStr = dateStr.trim();
  
  // 1. "Tháng 03.2026" or "Tháng 03/2026"
  let m = cleanStr.match(/Tháng (\d{1,2})[./](\d{4})/i);
  if (m) return new Date(+m[2], +m[1] - 1, 1);
  
  // 2. Range: "09-10.04.2026"
  m = cleanStr.match(/(\d{1,2})-(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (m) return new Date(+m[4], +m[3] - 1, +m[2]);
  
  // 3. Simple: "31.03.2026" or "06/04/2026"
  m = cleanStr.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  
  // 4. Fallback for year only
  m = cleanStr.match(/(\d{4})/);
  if (m) return new Date(+m[1], 0, 1);

  return new Date(2099, 11, 31);
};

/**
 * Sorts a timeline array by date string
 */
export const sortTimelineItems = (items) => {
  if (!items) return [];
  return [...items].sort((a, b) => {
    const timeA = parseTimelineDate(a.date).getTime();
    const timeB = parseTimelineDate(b.date).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return (a.id || 0) - (b.id || 0); // Preserve stable ID order for same dates
  });
};
