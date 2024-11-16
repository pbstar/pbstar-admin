import menu from './controller/menu';
const request = (e) => {
  return new Promise((resolve, reject) => {
    resolve({
      code: 200,
      data: menu,
      msg: 'success'
    })
  })
}
export default request;