const create = (json) => {
  return `{
  path: "/${json.key}",
  name: "${json.key}",
  component: () => import("@/views/${json.key}.vue"),
},
`;
};
export default {
  create,
};
