type NonNullableObject<T> = {
  [P in keyof T]: T[P] extends null ? never : T[P] extends object ? NonNullableObject<T[P]> : T[P];
};

/**
 * 移除对象中的 null 键值对
 *
 * @param obj 要处理的对象
 * @returns 返回移除 null 键值对后的对象，如果输入为数组，则返回数组中每个元素都移除 null 键值对后的新数组
 */
export function removeNullKeys<T extends Record<string, any>>(obj: T): { [P in keyof T]: NonNullable<T[P]> } {
  if (Array.isArray(obj)) {
    return obj.map(item => removeNullKeys(item)) as any;
  } else if (obj && typeof obj === 'object') {
    const result = {} as { [P in keyof T]: NonNullable<T[P]> };
    for (const key in obj) {
      // 使用Object.prototype.hasOwnProperty的调用方式
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== null) {
        result[key] = removeNullKeys(obj[key] as any) as NonNullable<T[keyof T]>;
      }
    }
    return result;
  }
  return obj as any;
}


export const fixedImageUrl = (url:string) => {
  const regex = /^(http:\/\/|https:\/\/)/i;
  return regex.test(url) ? url : 'http://192.168.2.11:8003/media/' + url //  localStorage.getItem('umo_domain') + '/' + url;
}
export const fixedImageUrls = (urls:any[]) => {
  return urls.map((ele:any)=> (ele.url? fixedImageUrl(ele.url) : fixedImageUrl(ele.response.data.url)  ) )
}