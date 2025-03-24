import dayjs from 'dayjs';
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isTomorrow);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// export const timeAgo = (timestamp: string | number | Date) => {
//   console.log('time----timestamp------------', timestamp)
//   const messages = {
//     justNow: t('time.justNow'),
//     past: (n: string | number | Date) =>
//       n.toString().match(/\d/) ? t('time.past', { n }) : n,
//     day: (n: Date | number | string) =>
//       n === 1 ? t('time.yesterday') : t('time.day', { n }),
//     hour: (n: string | number | Date) => t('time.hour', { n }),
//     minute: (n: string | number | Date) => t('time.minute', { n }),
//     second: (n: string | number | Date) => t('time.second', { n }),
//   } as const
//   const time = useTimeAgo(new Date(timestamp), {
//     messages: messages as any,
//   })
//   console.log('time----------------', time.value)
//   return  ""// time.value? time.value.replace(/"/gi, '') : ''
// }


export function timeAgo(date:any) {
  const now = dayjs();
  const inputDate = dayjs(date);

  const diffMinutes = now.diff(inputDate, "minute");
  const diffHours = now.diff(inputDate, "hour");
  const diffDays = now.diff(inputDate, "day");

  if (diffMinutes < 1) {
    return "几秒前";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  } else if (diffHours < 24 && inputDate.isToday()) {
    return `${diffHours} 小时前`;
  } else if (inputDate.isToday()) {
    return inputDate.format("HH:mm");
  } else if (inputDate.isYesterday()) {
    return `昨天 ${inputDate.format("HH:mm")}`;
  } else if (inputDate.isTomorrow()) {
    return `明天 ${inputDate.format("HH:mm")}`;
  } else if (diffDays === 2) {
    return `前天 ${inputDate.format("HH:mm")}`;
  } else if (diffDays < 7 && inputDate.isSameOrAfter(now.startOf("week"))) {
    const weekdayText = ["日", "一", "二", "三", "四", "五", "六"];
    return `周${weekdayText[inputDate.day()]} ${inputDate.format("HH:mm")}`;
  } else if (inputDate.isSame(now, "year")) {
    return inputDate.format("MM-DD HH:mm");
  } else {
    return inputDate.format("YYYY-MM-DD");
  }
}


/*
 * 字符串补位
 */
const padStart = (str: string, maxLength: number, fillString = ' ') => {
  if (str.length >= maxLength) return str

  const fillLength = maxLength - str.length
  let times = Math.ceil(fillLength / fillString.length)
  while ((times >>= 1)) {
      fillString += fillString
      if (times === 1) {
          fillString += fillString
      }
  }
  return fillString.slice(0, fillLength) + str
}

/*
 * 格式化时间戳
 */
export const timeFormat = (dateTime: string | number | null = null, fmt = 'yyyy-mm-dd hh:MM:ss') => {
  if (dateTime === 'none') return '无'
  if (!dateTime) dateTime = Number(new Date())
  if (dateTime.toString().length === 10) {
      dateTime = +dateTime * 1000
  }

  const date = new Date(dateTime)
  let ret
  const opt: any = {
      'y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'h+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      's+': date.getSeconds().toString(), // 秒
  }
  for (const k in opt) {
      ret = new RegExp('(' + k + ')').exec(fmt)
      if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : padStart(opt[k], ret[1].length, '0'))
      }
  }
  return fmt
}
