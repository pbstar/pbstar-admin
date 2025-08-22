/**
 * 格式化数字，确保两位数
 * @param {number} num 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
const formatNumber = (num) => num.toString().padStart(2, "0");

/**
 * 获取当前时间并格式化
 * @param {string} format 格式字符串
 * @returns {string|Date} 格式化后的时间字符串或Date对象
 */
export function getNowTime(format) {
  const now = new Date();
  const year = now.getFullYear();
  const month = formatNumber(now.getMonth() + 1);
  const day = formatNumber(now.getDate());
  const hour = formatNumber(now.getHours());
  const minute = formatNumber(now.getMinutes());
  const second = formatNumber(now.getSeconds());

  const formats = {
    "yyyy-mm-dd": `${year}-${month}-${day}`,
    "hh:mm:ss": `${hour}:${minute}:${second}`,
    "yyyy-mm-dd hh:mm:ss": `${year}-${month}-${day} ${hour}:${minute}:${second}`,
    yyyymmddhhmmss: `${year}${month}${day}${hour}${minute}${second}`,
    yyyymmddhhmm: `${year}${month}${day}${hour}${minute}`,
  };

  return formats[format] || now;
}
