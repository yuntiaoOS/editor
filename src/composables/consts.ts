// 数据表格对应的数据存储字段
export const Xm_Table_key: Record<string, string> = {
  evaluating_table: "evaluating_table",   // 评测表格
  feedback_evaluation_table: "feedback_evaluation_table", // 反馈评估表格
  raw_material_table: "raw_material_table", // 物料表格
  sample_table: "sample_table",     // 样品表格
  technology_table: "technology_table", // 工艺路线
  experimental_design: "experimental_design", // 实验设计表格
  test_record_table: "test_record_table", // 测试记录表格
};

// 物料数据存储字段固定字段 -- 后续用作特殊判断
export const XM_raw_material_key = "xm_raw_material"