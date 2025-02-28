<template>
  <div class="examples">
    <div class="box">
      <umo-editor ref="editorRef" v-bind="options" />
    </div>
    <!-- <div class="box">
      <umo-editor editor-key="testaaa" :toolbar="{ defaultMode: 'classic' }" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { shortId } from '@/utils/short-id'
import { getOrg_memberFetch, attachments_fileFetch } from '@/api/index'
import { put_experiment_record_fetch } from '@/api/experiment'
import { checkBeforeSaveDoc } from '@/utils/index'
import Fuse from 'fuse.js';

const editorRef = $ref(null)
const templates = [
  {
    title: '工作任务',
    description: '工作任务模板',
    content:
      '<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>',
  },
  {
    title: '工作周报',
    description: '工作周报模板',
    content:
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>',
  },
]
const options = $ref({
  editorKey: 'experimentEdit',
  toolbar: {
    defaultMode: 'classic',
    // menus: ['base'],
    enableSourceEditor: true,
  },
  requestOptions: {
    dict_data: {
      test_conditions: [
        {
          "id": "125534c7-d47d-4952-af8d-e642e1a6ee23",
          "label": "日常",
          "value": "1",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "8592b7df-a9ab-48a0-bcae-da13a9f64fc1",
          "label": "光照",
          "value": "2",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "94008a0f-51ac-4dd2-a0b1-41bd73ab02ba",
          "label": "45±1℃",
          "value": "3",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 3,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "bc5850a2-753e-4958-b43a-e9c3dc963881",
          "label": "冷冻 -15±1℃",
          "value": "4",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 4,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "7b372a42-1423-44d5-ae3c-34b6117b5e4d",
          "label": "冷藏 4±1℃",
          "value": "5",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 5,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "e62594c6-b203-4868-ac56-cf3ab2dd94ad",
          "label": "交替循环",
          "value": "6",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 6,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "8bc51c00-0799-483c-8c15-0cc9cf14a077",
          "label": "暗",
          "value": "7",
          "parent": "0cdb6652-df7a-4968-9b32-0d416f6ad382",
          "type": 0,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 7,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        }
      ],
      evaluating_test_period: [
        {
          "id": "99a6be9d-4043-4ebe-bc0d-96d019183d14",
          "label": "周",
          "value": "1",
          "parent": "bd34187b-91b1-4d38-862d-5497e5332f6c",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 1,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        },
        {
          "id": "f5291072-8786-4236-a145-a162a72e2297",
          "label": "天",
          "value": "2",
          "parent": "bd34187b-91b1-4d38-862d-5497e5332f6c",
          "type": 1,
          "color": null,
          "is_value": false,
          "status": true,
          "sort": 2,
          "remark": "",
          "default": false,
          "app_category": [
            "formula_dev",
            "ingredient_dev",
            "safety_eval",
            "efficacy_eval",
            "sales_marketing"
          ]
        }
      ]
    },
    experiment_theme: {
      "id": "2270b604-cbeb-47dc-96c7-f0bc2381e926",
      "modifier_name": "赵紫文",
      "dept_belong_id": null,
      "creator_name": "赵紫文",
      "create_datetime": "2024-12-19 16:23:20",
      "update_datetime": "2024-12-19 17:41:51",
      "is_collect": false,
      "person_in_charge": {
        "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
        "user_id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
        "name": "赵紫文",
        "is_owner": true,
        "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_r9xK2Nq.png"
      },
      "participants": [
        {
          "id": "cea15e47-dcdd-4880-8bf3-ca6829109cf7",
          "user_id": "cea15e47-dcdd-4880-8bf3-ca6829109cf7",
          "name": "张三丰",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/f21be6bb-34b9-481d-88dd-5c6c3d6ed66b.png"
        },
        {
          "id": "69d25690-2f7a-458e-8f10-1c38162a1c58",
          "user_id": "69d25690-2f7a-458e-8f10-1c38162a1c58",
          "name": "张大彪",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/db1f268d-5b27-4bed-95f5-6426025519e0.png"
        },
        {
          "id": "995dda9e-dbee-46db-af4f-02686c470357",
          "user_id": "995dda9e-dbee-46db-af4f-02686c470357",
          "name": "胡汉三",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/5ea58e76-fcbd-43bc-9493-dde4ba269b3e.png"
        },
        {
          "id": "9dc2696a-b931-4abb-bb81-5fa2d088947e",
          "user_id": "9dc2696a-b931-4abb-bb81-5fa2d088947e",
          "name": "等待",
          "is_owner": false,
          "avatar": "http://192.168.2.11:8002/media/avatar/26e35b37-d464-48f6-a423-b73f17ca2538.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
          "user_id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
          "name": "赵紫文",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_r9xK2Nq.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3935",
          "user_id": "63aed191-f093-4e9d-b4ef-4a159ffa3935",
          "name": "小白1",
          "is_owner": true,
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_l1HXx8V.jpg"
        }
      ],
      "description": "wdewd了了了2柔柔弱弱柔柔弱弱柔柔弱弱揉揉揉呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃呃",
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "name": "SY121916230001",
      "sn": "SN-1734596573156",
      "icon": "/experiment/picture1.png",
      "label": null,
      "experiment_template": null,
      "start_time": null,
      "end_time": null,
      "attachment": [],
      "publish": false
    },
    experiment_record: {
      "id": "1333b668-3df8-4e63-95db-dd0fbc781fc9",
      "modifier_name": "赵紫文",
      "dept_belong_id": null,
      "creator_name": "赵紫文",
      "create_datetime": "2024-12-19 16:25:02",
      "update_datetime": "2024-12-19 19:02:50",
      "liked": false,
      "experimenter": [
        {
          "id": "cea15e47-dcdd-4880-8bf3-ca6829109cf7",
          "name": "张三丰",
          "avatar": "http://192.168.2.11:8002/media/avatar/f21be6bb-34b9-481d-88dd-5c6c3d6ed66b.png"
        },
        {
          "id": "69d25690-2f7a-458e-8f10-1c38162a1c58",
          "name": "张大彪",
          "avatar": "http://192.168.2.11:8002/media/avatar/db1f268d-5b27-4bed-95f5-6426025519e0.png"
        },
        {
          "id": "995dda9e-dbee-46db-af4f-02686c470357",
          "name": "胡汉三",
          "avatar": "http://192.168.2.11:8002/media/avatar/5ea58e76-fcbd-43bc-9493-dde4ba269b3e.png"
        },
        {
          "id": "9dc2696a-b931-4abb-bb81-5fa2d088947e",
          "name": "等待",
          "avatar": "http://192.168.2.11:8002/media/avatar/26e35b37-d464-48f6-a423-b73f17ca2538.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
          "name": "赵紫文",
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_r9xK2Nq.png"
        },
        {
          "id": "63aed191-f093-4e9d-b4ef-4a159ffa3935",
          "name": "小白1",
          "avatar": "http://192.168.2.11:8002/media/avatar/abf0f9c664c6c4b3e4b0fbaf054c1db7_l1HXx8V.jpg"
        }
      ],
      "description": null,
      "creator": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "modifier": "63aed191-f093-4e9d-b4ef-4a159ffa3938",
      "title": "LJ12191625",
      "sn": null,
      "start_time": null,
      "end_time": null,
      "experiment_design": null,
      "sample_number": null,
      "version": 1,
      "document_attachments": null,
      "json_data": {
        "type": "doc",
        "content": []
      },
      "experiment_theme": "2270b604-cbeb-47dc-96c7-f0bc2381e926",
      "previous_record": null,
      "catalog": null
    },
    umo_domain: 'http://192.168.2.11:8003/api', // 'https://msyf.eva.rongzhuamao.com/api',//
    umo_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQwNzQxMzk5LCJpYXQiOjE3NDA2NTQ5OTksImp0aSI6IjgzMDY3MDMxMTU4NDRhNGFhZjA5MWM4MGMyN2E2NmZiIiwidXNlcl9pZCI6Ijg1Mjg4NThmLTdjYjgtNDc3ZS1iZjE3LWZkZTNkMmZiYjIzZSJ9.BLIb-DtoHwCNtcpQCoNwVVx3QfOmrhLdtXGNB1JlqGk',
  },
  document: {
    placeholder: '输入 / 唤起更多',
    title: '测试文档',
    content: localStorage.getItem('document.content') ?? '<p>测试文档</p>',
    characterLimit: 10,
  },
  page: {
    showBookmark: true,
  },
  templates,
  cdnUrl: 'http://id.zw.rzm.com',
  shareUrl: 'http://id.zw.rzm.com',
  file: {
    // allowedMimeTypes: [
    //   'application/pdf',
    //   'image/svg+xml',
    //   'video/mp4',
    //   'audio/*',
    // ],
  },
  assistant: {
    enabled: true,
  },
  user: {
    id: 'umoeditor',
    label: 'Umo Editor',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
  users: [
    { id: 'umodoc', label: 'Umo Team' },
    { id: 'Cassielxd', label: 'Cassielxd' },
    { id: 'Goldziher', label: "Na'aman Hirschfeld" },
    { id: 'SerRashin', label: 'SerRashin' },
    { id: 'ChenErik', label: 'ChenErik' },
    { id: 'china-wangxu', label: 'china-wangxu' },
    { id: 'Sherman Xu', label: 'xuzhenjun130' },
    { id: 'testuser', label: '测试用户' },
  ],
  async onSave(content: string, page: number, document: { content: string }) {
    try {
      localStorage.setItem('document.content', document.content)
    } catch (error) {

    }
    const contentJson = editorRef.editorInstance.getJSON()
    checkBeforeSaveDoc(contentJson.content)
    return new Promise((resolve, reject) => {
      // const contentJson = editorRef.editorInstance.getJSON()
      let title = experiment_record.value?.title
      let sn = experiment_record.value?.sn
      let start_time = experiment_record.value?.start_time
      let end_time = experiment_record.value?.end_time
      let experimenter = experiment_record.value?.experimenter

      if (!contentJson || contentJson.content.length === 0) {
        reject('请先编辑实验设计,再保存')
      } else {
        const titleArr = contentJson.content.filter((ele: any) => ele.type === 'xmTitle' && ele.attrs.key === 'baseTitle')
        if (titleArr.length > 0) {
          if (titleArr[0].attrs.title.length > 0) {
            title = titleArr[0].attrs.title
          } else {
            reject('请输入实验标题')
          }
        } else {
          reject('缺少实验标题组件，联系管理员添加')
        }
        const formArr = contentJson.content.filter((ele: any) => ele.type === 'xmForm' && ele.attrs.key === 'baseInfo')
        if (formArr.length > 0) {
          sn = formArr[0].attrs.formData.sn
          start_time = formArr[0].attrs.formData.start_time
          end_time = formArr[0].attrs.formData.end_time
          experimenter = formArr[0].attrs.formData.experimenter
        } else {
          reject('缺少实验基本信息组件，联系管理员添加')
        }
      }
      const params = {
        title: title,
        sn: sn,
        start_time: start_time,
        end_time: end_time,
        experimenter: [],
        json_data: contentJson
      }
      put_experiment_record_fetch(experiment_record.value ? experiment_record.value.id : '6e252907-4fa3-4e50-a97c-6d8a33bbb579', params).then((res) => {

        if (res.data.code === 2000) {
          resolve('操作成功')
        } else {
          reject(res.data.message)
        }
      }).catch((err) => {
        reject(err.message)
      })
    })
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }
    const res = await attachments_fileFetch({ file: file})

    if (res.status === 201) {
      const fileUrl = localStorage.getItem('BASE_URL') + `/api/storage/files/${res.data.id}/preview/`
      const fileUrl2 = localStorage.getItem('BASE_URL') + `/api/storage/files/${res.data.id}/download/`
      return { ...res.data,src: fileUrl,url: fileUrl ,file:fileUrl2}
    } else {
      throw new Error(res.data.msg)
      // return {
      //   id: shortId(),
      //   url: file.url ?? URL.createObjectURL(file),
      //   name: file.name,
      //   type: file.type,
      //   size: file.size,
      // }
    }
  },
  onFileDelete(id: string, url: string) {
    console.log(id, url)
  },
  onCustomizeChartSettings(data: any, config: any) {
    return null
  },
  async onAssistant(payload:any, content:any) {
    console.log('assistant-----', payload, content)
    const FuseOptions = {
      keys: ['name','title','text'], // Set the keys to search on
      includeScore: false, // Optional: to include score for each match
      threshold: 0.7, // Adjust search sensitivity (0.0 exact, 1.0 everything)
    };
    const fuse = new Fuse(content.json.content, FuseOptions);
    console.log('assistant---fuse--', fuse, content.json.content)
    const result = fuse.search(payload.command)
    console.log('assistant--------result', result)
    return await Promise.resolve('<p>AI助手测试</p>')
  },
  async onCustomImportWordMethod() {
    return await Promise.resolve({
      value: '<p>测试导入word</p>',
    })
  },
})
</script>

<style>
.examples {
  margin: 20px;
  display: flex;
  height: calc(100vh - 40px);
}
.box {
  border: solid 1px #ddd;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}

html,
body {
  height: 100vh;
  overflow: hidden;
}
</style>
