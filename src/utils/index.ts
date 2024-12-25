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


export const fixedImageUrl = (url:string | null) => {
  if (!url) {
    return '';
  }
  const regex = /^(http:\/\/|https:\/\/)/i;
  return regex.test(url) ? url : localStorage.getItem('rzm_domain') + '/media/' + url; //'http://192.168.2.11:8003/media/' + url //  
}

export const fixedImageUrls = (urls:any[]) => {
  return urls.map((ele:any)=> (ele.url? fixedImageUrl(ele.url) : fixedImageUrl(ele.response.data.url)  ) )
}

//统一提交前检测未保存数据并继续上传数据
export function checkBeforeSaveDoc(content:any[],) {
  const changeDatas = content.filter(ele=> ele.isChanged)
  console.log('------------checkBeforeSaveDoc------43-------',changeDatas)
  if (changeDatas.length > 0) {
    const dialog = useConfirm({
      theme: 'warning',
      header: '提示',
      body: '存在数据未保存，是否现在提交保存',
      confirmBtn: {
        theme: 'primary',
        content: '保存',
      },
      onConfirm() {

        dialog.destroy()

        return
      },
    })
  }
}


export const getFieldValue = (field: string, row: any)=> {
  // console.log('----------getFieldName-----------------', field, row)
  let fieldName = ''
  if (!row || !field) {
    return fieldName
  }
  try {
    if (field && field.includes('.')) {
      const fieldArr = field.split('.')
      let fieldData: any = {}
      fieldArr.forEach((ele, index) => {
        if (index === 0) {
          fieldData = row[ele]
        } else if (fieldData) {
          fieldData = fieldData[ele]
        }
        fieldName = fieldData
      })
    } else {
      fieldName = row[field]
    }
  } catch (error) {
    console.log('----------getFieldName----error-------------',error, field, row)
  }
  
  // console.log('----------getFieldName----11111-------------', field, row)
  return fieldName
}

export function mergeRowsByFields(fields,baseField, data) {
  return ({ row, col, rowIndex }) => {
    const field = col.colKey ;

    // 检查字段是否在需要合并的列表中
    if (fields.includes(field)) {
      const prevRow = data[rowIndex - 1];
      const nextRow = data[rowIndex + 1];

      // 隐藏当前单元格，若上一个单元格值相同
      if (prevRow && prevRow[baseField] === row[baseField]) {
        return { rowspan: 0, colspan: 1 };
      }

      // 计算合并的行数
      if (nextRow && nextRow[baseField] === row[baseField]) {
        let rowspan = 1;
        for (let i = rowIndex + 1; i < data.length; i++) {
          if (data[i][baseField] === row[baseField]) {
            rowspan++;
          } else {
            break;
          }
        }
        return { rowspan, colspan: 1 }; // 合并单元格
      }
    }

    return { rowspan: 1, colspan: 1 }; // 默认不合并
  };
}