import { request } from '@/utils/request';
import type { IngredientDevMaterialListResult } from '@/api/model/materialModel';
import type { ExperimentInfo, ExperimentInfoList } from '@/api/model/experimentModel';

const Api = {
  experiment_theme: '/ingredient_dev/experiment/theme/',  //实验
  experiment_record: '/ingredient_dev/experiment/record/', //记录
};

export function get_experiment_theme_infoFetch(id:string,params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_theme}${id}/`,
    params
  });
}
export function get_experiment_record_infoFetch(id:string, params?: any) {
  return request.get<ExperimentInfo>({
    url: `${Api.experiment_record}${id}/` ,
    params
  });
}