export interface ExperimentInfo {
  adminName: string;
  index: string;
  pdName: string;
  pdNum: string;
  pdType: string;
  purchaseNum: number;
  updateTime: Date;
}

export interface ExperimentInfoList {
  list: ExperimentInfo[];
}

