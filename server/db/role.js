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
};
export default list.map((item) => {
  return { ...type, ...item };
});
