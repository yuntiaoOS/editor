export interface ingredient_dev_materialListResult {
  list: Array<ingredient_dev_materialListInfo>;
}
export interface ingredient_dev_materialListInfo {
  adminName: string;
  index: string;
  pdName: string;
  pdNum: string;
  pdType: string;
  purchaseNum: number;
  updateTime: Date;
}

