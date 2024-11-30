const list = [
  {
    id: 1,
    name: "超管",
    username: "admin",
    password: "123456",
    role: 1,
  },
  {
    id: 2,
    name: "普通用户",
    username: "user",
    password: "123456",
    role: 2,
  },
];
const type = {
  id: 0,
  name: "",
  phone: "",
  username: "",
  password: "",
  role: 2,
  status: 1,
  createTime: "2000-01-01 00:00:00",
};
export default list.map((item) => {
  return { ...type, ...item };
});
