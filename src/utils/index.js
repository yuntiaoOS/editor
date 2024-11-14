export const makeColumnsWithJson = (designParams, onEdited) => {
  const columns = []
  designParams.forEach(item => {
    const componentName = ['SelectPlusRadio', 'SelectPlus'].indexOf(item.type) === -1 ? TInput : TSelect
    const options = ['SelectPlusRadio', 'SelectPlus'].indexOf(item.type) === -1 ? [] : item.props.options.map(ele => ({ label: ele.name, value: ele.id }))
    if (item.key === XM_raw_material_key) {
      columns.unshift({
        title: item.name,
        colKey: item.key,
        width: 100,
        render(h, { row }) {
          const dataR = row[item.key]
          return dataR ? item.props.options?.filter(eleO => dataR.includes(eleO.id))?.map(eleO => eleO.name)?.join(";") : ''
        }
      })
    } else {
      columns.push({
        title: item.name,
        colKey: item.key,
        width: 100,
        edit: {
          component: componentName,
          props: {
            clearable: true,
            autofocus: true,
            multiply: true,
            options
            // autoWidth: true,
          },
          rules: [
            {
              required: false,
              message: '不能为空'
            }
          ],
          showEditIcon: true,
          abortEditOnEvent: ['onEnter', 'onBlur'],
          onEdited: onEdited,
          validateTrigger: 'change',
          on: (editContext) => {
            onBlur: (ctx) => {
              console.log('失去焦点', editContext)
              ctx?.e?.preventDefault()
            }
            onEnter: (ctx) => {
              ctx?.e?.preventDefault()
              console.log('onEnter', ctx)
            }
            // 默认是否为编辑状态
            defaultEditable: true,
          }
        }
      })
    }
  }
  return columns
};

