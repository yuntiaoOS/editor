import { request } from '@/utils/request';

const Api = {
  'app_init': '/init/', // 原料字段
  'org_member': '/org/member/', // 组织成员
};

export function getOrg_memberFetch(params?: any) {
  return request.get({
    url: Api.org_member,
    params
  });
}