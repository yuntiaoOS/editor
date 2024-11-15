import { request } from '@/utils/request';

const Api = {
  'app_init': '/init/', // 原料字段
};

export function getApp_initFetch(params?: any) {
  return request.get({
    url: Api.app_init,
    params
  });
}