/**
 * 静态选项常量（替代原枚举能力，供下拉与label映射使用）
 */

// 是否健康
export const booleanOptions = [
  { label: "是", value: "是" },
  { label: "否", value: "否" },
];

// 性别
export const sexOptions = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];

// 民族（56个）
export const ethnicOptions = [
  "汉族",
  "蒙古族",
  "回族",
  "藏族",
  "维吾尔族",
  "苗族",
  "彝族",
  "壮族",
  "布依族",
  "朝鲜族",
  "满族",
  "侗族",
  "瑶族",
  "白族",
  "土家族",
  "哈尼族",
  "哈萨克族",
  "傣族",
  "黎族",
  "傈僳族",
  "佤族",
  "畲族",
  "高山族",
  "拉祜族",
  "水族",
  "东乡族",
  "纳西族",
  "景颇族",
  "柯尔克孜族",
  "土族",
  "达斡尔族",
  "仫佬族",
  "羌族",
  "布朗族",
  "撒拉族",
  "毛南族",
  "仡佬族",
  "锡伯族",
  "阿昌族",
  "普米族",
  "塔吉克族",
  "怒族",
  "乌孜别克族",
  "俄罗斯族",
  "鄂温克族",
  "德昂族",
  "保安族",
  "裕固族",
  "京族",
  "塔塔尔族",
  "独龙族",
  "鄂伦春族",
  "赫哲族",
  "门巴族",
  "珞巴族",
  "基诺族",
].map((name) => ({ label: name, value: name }));

/**
 * 根据 value 获取 label
 * @param {Array<{label:string,value:*} >} options 选项列表
 * @param {*} value 值
 * @returns {string} 对应 label，未匹配则返回原值
 */
export const getOptionLabel = (options, value) => {
  const item = options.find((o) => o.value === value);
  return item ? item.label : value;
};