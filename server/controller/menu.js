import menu from '../db/menu';
const getLeftNav = (e) => {
  console.log(menu, e);
  return {
    code: 200,
    data: menu,
    msg: '成功'
  }
}
export default {
  getLeftNav
}