<template>
  <t-base-table row-key="id" :data="tableData" :columns="columns"></t-base-table>
</template>

<script setup>
import { get_assign_record_process_dataFetch,getProcesses_attributeListFetch  } from '@/api/experiment'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  designParams: {
    type: Array,
    required: true,
  },
})

const columns = ref([])
const tableData = ref([])
const initial = async () =>{
  console.log('----------21-----initial------',props)
  //使用工艺id获取工艺数据
  if (props.designParams && props.designParams.length > 0) {
    const technology_id = props.designParams[0].technology
    const resT = await get_assign_record_process_dataFetch({change_log: technology_id})
    if (resT.data.code === 2000) {
      columns.value = [
        {
          title: '工序',
          colKey: 'name',
          width: 120,
        },
        {
          title: '工艺过程简述',
          colKey: 'content',
          width: 200,
        },
        {
          title: '注意事项',
          colKey: 'description',
          width: 200,
        }
      ]
      if ( resT.data.data?.process?.step && resT.data.data.process.step.length > 0){
        console.log('----------46--------------',resT.data.data.process.step)
        const steps = resT.data.data.process.step
        steps.forEach(step => {
          const row = {
            name: step.name,
            content: '',
            description: step.description ? step.description : '' ,
          }
          const content = []
          if ( step.children && step.children.length > 0  ) {
            console.log('----------56--------------',content)
            step.children.forEach( ele =>{
              const child = props.designParams.find(eleF=> eleF.id === ele.id)
              const childVal = props.row.param.find(eleF=> eleF.step_attribute_id === ele.id)
              console.log('----------59--------------',child,childVal)
              let  container = ''
              if (child.attribute_type === 'single') {
                if (child.key.includes(XM_raw_material_key) ) {
                  const rawM = child.props.options?.filter(eleO => childVal.value.includes(eleO.id))?.map(eleO => eleO.name)?.join("/") 
                  container = `${child.name  }:${  rawM  }`  
                }else{
                  container = `${child.name  }:${  childVal.value  }${child.props.suffix  }${child.description}`
                }
              } else if (child.attribute_type === 'compound') {
                container += `${child.name  }:`  
                if (child.group && child.group.length > 0) {
                  const containerArr = []
                  child.group.forEach( eleC => {
                    if (eleC.key.includes(XM_raw_material_key) ) {
                      const rawM = eleC.props.options?.filter(eleO => childVal.value[eleC.key].includes(eleO.id))?.map(eleO => eleO.name)?.join("/") 
                      containerArr.push( `${eleC.name  }:${  rawM }`)   
                    }else{
                      containerArr.push( `${eleC.name  }:${  childVal.value[eleC.key]  }${eleC.props.suffix}` ) 
                    }
                  })
                  container += containerArr.join('，')
                  container += child.description
                }
              }
              content.push(container) 
            })
          }
          console.log('----------70--------------',content)
          row.content = content.join('; ')
          tableData.value.push(row)
        });

      }


      
    }
  }
  
}
onMounted(async () => {
  initial()
});

</script>

<style lang="scss" scoped>

</style>
