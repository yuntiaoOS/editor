export const timeAgo = (timestamp: string | number | Date) => {
  const messages = {
    justNow: t('time.justNow'),
    past: (n: string | number | Date) =>
      n.toString().match(/\d/) ? t('time.past', { n }) : n,
    day: (n: Date | number | string) =>
      n === 1 ? t('time.yesterday') : t('time.day', { n }),
    hour: (n: string | number | Date) => t('time.hour', { n }),
    minute: (n: string | number | Date) => t('time.minute', { n }),
    second: (n: string | number | Date) => t('time.second', { n }),
  } as const
  const time = useTimeAgo(new Date(timestamp), {
    messages: messages as any,
  })
  return time.value.replace(/"/gi, '')
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