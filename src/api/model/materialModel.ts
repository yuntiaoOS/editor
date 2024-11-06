export interface IngredientDevMaterialListInfo {
  adminName: string;
  index: string;
  pdName: string;
  pdNum: string;
  pdType: string;
  purchaseNum: number;
  updateTime: Date;
}

export interface IngredientDevMaterialListResult {
  list: IngredientDevMaterialListInfo[];
}

