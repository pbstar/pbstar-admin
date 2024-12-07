const list =[
  {
    id: 1,
    name: "超管",
    key: "superAdmin",
    menus: "all",
  },
  {
    id: 2,
    name: "用户",
    key: "user",
    menus: "1,2,3,4",
  },
];
const type = {
  id: 0,
  name: "",
  key: "",
  menus: "",
  createTime: "2000-01-01 00:00:00",
};
export default list.map((item) => {
  return { ...type, ...item };
});
