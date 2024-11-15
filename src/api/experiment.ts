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
};

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
export function post_experiment_material_fetch(params: any) {
  return request.post({ url: Api.experiment_material, data: params });
}
export function put_experiment_material_fetch(id:string,params: any) {
  return request.put({ url:`${Api.experiment_material}${id}/`, data: params });
}
export function delete_experiment_material_fetch(id:string ) {
  return request.delete({ url:`${Api.experiment_material}${id}/` });
}
/*-------------------------------------实验------------------------------------------*/
export function get_experiment_theme_infoFetch(id:string,params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_theme}${id}/`,
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