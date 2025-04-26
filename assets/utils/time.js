//获取当前时间
export function getNowTime(format) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  function formatNumber(n) {
    return n < 10 ? "0" + n : n;
  }
  if (format === "yyyy-mm-dd") {
    return `${year}-${formatNumber(month)}-${formatNumber(day)}`;
  } else if (format === "hh:mm:ss") {
    return `${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(
      second
    )}`;
  } else if (format === "yyyy-mm-dd hh:mm:ss") {
    return `${year}-${formatNumber(month)}-${formatNumber(day)} ${formatNumber(
      hour
    )}:${formatNumber(minute)}:${formatNumber(second)}`;
  } else if (format === "yyyymmddhhmmss") {
    return `${year}${formatNumber(month)}${formatNumber(day)}${formatNumber(
      hour
    )}${formatNumber(minute)}${formatNumber(second)}`;
  } else if (format === "yyyymmddhhmm") {
    return `${year}${formatNumber(month)}${formatNumber(day)}${formatNumber(
      hour
    )}${formatNumber(minute)}`;
  } else {
    return date;
  }
}
