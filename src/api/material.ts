import { request } from '@/utils/request';
import type { ingredient_dev_materialListResult } from '@/api/model/materialModel';

const Api = {
  'ingredient_dev_material': '/tenant/current/', // '/ingredient_dev/material/', // 原料
  'material_fields': '/ingredient_dev/material/fields/', // 原料字段
  'material_batch': '/ingredient_dev/material/batch/', // 原料批次
};

export function getIngredient_dev_materialListFetch() {
  return request.get<ingredient_dev_materialListResult>({
    url: Api.ingredient_dev_material,
  });
}
