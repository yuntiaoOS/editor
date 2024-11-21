import { request } from '@/utils/request';
import type { IngredientDevMaterialListResult } from '@/api/model/materialModel';
import type { ExperimentInfo, ExperimentInfoList } from '@/api/model/experimentModel';

const Api = {
  experiment_theme: '/ingredient_dev/experiment/theme/',  //实验
  experiment_record: '/ingredient_dev/experiment/record/', //记录
  experiment_material: '/ingredient_dev/experiment/material/', //新增记录-原材料
  processes_attribute: '/processes/attribute/', //操作属性
  ingredient_dev_experiment_sn : '/ingredient_dev/experiment/sn/' , //实验编号创建
  eval_execute_standard: '/evaluation_metric/eval_execute_standard/', //评估执行标准
  execute_standard_item: '/evaluation_metric/execute_standard_item/', //评估执行标准里面的指标项
  experiment_data: '/ingredient_dev/experiment/data/', //实验数据暂存
  material_change_logs: '/ingredient_dev/experiment/material/change_logs/', //'试验原料版本列表
  material_multiple_delete: '/ingredient_dev/experiment/material/multiple_delete/', //'试验原料版本列表-批量删除
  experiment_process: '/ingredient_dev/experiment/process/', //工艺、操作属性
  get_assign_record_process_data: '/ingredient_dev/experiment/process/get_assign_record_process_data/', //工艺详情get接口
  experiment_samples:'/ingredient_dev/experiment/samples/', //样品

};
/*-------------------------------------实验-样品--------------------------------------------*/
export function get_experiment_samples_infoFetch(id:string,params?: any) {
  return request.get({url: `${Api.experiment_samples}${id}/`,params});
}
export function get_experiment_samplesListFetch(params?: any) {
  return request.get({url: Api.experiment_samples,params});
}
export function post_experiment_samples_fetch(params: any) {
  return request.post({ url: Api.experiment_samples, data: params });
}
export function put_experiment_samples_fetch(id:string,params: any) {
  return request.put({ url:`${Api.experiment_samples}${id}/`, data: params });
}
export function delete_experiment_samplesFetch(id:string,params: any) {
  return request.delete( { url:`${Api.experiment_samples}${id}/`, params });
}
/*-------------------------------------实验工艺--------------------------------------------*/
export function get_assign_record_process_dataFetch(params?: any) {
  return request.get<ExperimentInfoList>({
    url: Api.get_assign_record_process_data,
    params
  });
}
export function get_experiment_processListFetch(params?: any) {
  return request.get<ExperimentInfoList>({
    url: Api.experiment_process,
    params
  });
}
export function post_experiment_process_fetch(params: any) {
  return request.post({ url: Api.experiment_process, data: params });
}
export function put_experiment_process_fetch(id:string,params: any) {
  return request.put({ url:`${Api.experiment_process}${id}/`, data: params });
}
export function delete_process_multiple_deleteFetch(params: any) {
  return request.delete({ url: Api.experiment_process, params });
}
/*-------------------------------------实验数据暂存--------------------------------------------*/
export function post_experiment_data_fetch(params: any) {
  return request.post({ url: Api.experiment_data, data: params });
}
/*-------------------------------------评估执行标准--------------------------------------------*/
export function getEval_execute_standardListFetch(params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.eval_execute_standard}`,
    params
  });
}
export function getExecute_standard_itemInfoFetch(params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.execute_standard_item}`,
    params
  });
}
/*-------------------------------------实验编号创建--------------------------------------------*/
export function getIngredient_dev_experimentListFetch(params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.ingredient_dev_experiment_sn}`,
    params
  });
}

/*-------------------------------------记录-原材料--------------------------------------------*/
export function getProcesses_attributeListFetch(params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.processes_attribute}`,
    params
  });
}

/*-------------------------------------记录-原材料--------------------------------------------*/
export function delete_material_multiple_deleteFetch(params: any) {
  return request.delete({ url: Api.material_multiple_delete, params });
}

export function get_material_change_logs_fetch(params: any) {
  return request.get({ url: Api.material_change_logs, params });
}
export function get_experiment_material_fetch(params: any) {
  return request.get({ url: Api.experiment_material, params });
}
export function post_experiment_material_fetch(params: any) {
  return request.post({ url: Api.experiment_material, data: params });
}
export function put_experiment_material_fetch(id:string,params: any) {
  return request.put({ url:`${Api.experiment_material}${id}/`, data: params });
}
/*-------------------------------------实验------------------------------------------*/
export function get_experiment_theme_infoFetch(id:string,params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_theme}${id}/`,
    params
  });
}

// 评论接口
export function post_experiment_record_commentFetch(id:string,params?: any) {
  return request.post<ExperimentInfo>({
    url: `${Api.experiment_record}${id}/comment/`,
    params
  });
}
// 评论接口list
export function get_experiment_record_commentListFetch(id:string,params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_record}${id}/comment/`,
    params
  });
}
// 点赞接口
export function post_experiment_record_likeFetch(id:string,params?: any) {
  return request.post<ExperimentInfo>({
    url: `${Api.experiment_record}${id}/like/`,
    params
  });
}
// 点赞接口list
export function get_experiment_record_likeListFetch(id:string,params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_record}${id}/like/`,
    params
  });
}
/*-------------------------------------记录--------------------------------------------*/
export function get_experiment_record_infoFetch(id:string, params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_record}${id}/` ,
    params
  });
}