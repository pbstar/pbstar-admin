const list =[
  {
    id: 1,
    name: "超管",
    role: "superAdmin",
    menus: "all",
  },
  {
    id: 2,
    name: "用户",
    role: "user",
    menus: "1,2,3,4",
  },
];
const type = {
  id: 0,
  name: "",
  role: "",
  menus: "",
};
export default list.map((item) => {
  return { ...type, ...item };
});
