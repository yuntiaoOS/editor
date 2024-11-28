import { request } from '@/utils/request';
import type { IngredientDevMaterialListResult } from '@/api/model/materialModel';

const Api = {
  'ingredient_dev_material': '/ingredient_dev/material/', // 原料
  'material_fields': '/ingredient_dev/material/fields/', // 原料字段
};

export function getIngredient_dev_materialListFetch(params?: any) {
  return request.get<IngredientDevMaterialListResult>({
    url: Api.ingredient_dev_material,
    params
  });
}