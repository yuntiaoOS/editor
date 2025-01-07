import { request } from '@/utils/request';

const Api = {
  'app_init': '/init/', // 原料字段
  'org_member': '/org/member/', // 组织成员
  attachments_file: '/storage/attachments/upload/', // 文件上传接口
};

export function getOrg_memberFetch(params?: any) {
  return request.get({
    url: Api.org_member,
    params
  });
}

export function attachments_fileFetch(params: any) {
  return request.post( {
    url: Api.attachments_file,
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
    data: params
  });

}
