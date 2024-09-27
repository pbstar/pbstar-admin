import { ref } from 'vue'
import { defineStore } from 'pinia'

const leftNavListAll = [{
  name: '首页面板',
  path: '/admin/home',
  icon: 'home'
}, {
  name: '用户管理',
  icon: 'user',
  roles: [],
  children: [{
    name: '用户列表',
    path: '/admin/app_test?test=/about',
    roles: []
  }]
}, {
  name: '角色管理',
  path: '/admin/role',
  icon: 'user-safety',
  roles: []
}, {
  name: '店铺管理',
  icon: 'store',
  roles: [],
  children: [{
    name: '店铺列表',
    path: '/admin/shop',
    roles: []
  }]
}, {
  name: '商品管理',
  icon: 'shop',
  roles: [],
  children: [{
    name: '商品列表',
    path: '/admin/goods',
    roles: []
  }]
}, {
  name: '订单管理',
  icon: 'article',
  roles: [],
  children: [{
    name: '订单列表',
    path: '/admin/order',
    roles: []
  }]
}, {
  name: '系统管理',
  icon: 'system-setting',
  roles: [],
  children: [{
    name: '公告管理',
    path: '/admin/notice',
    roles: []
  }, {
    name: '轮播图管理',
    path: '/admin/banner',
    roles: []
  }, {
    name: '导航管理',
    path: '/admin/nav',
    roles: []
  }, {
    name: '资讯管理',
    path: '/admin/news',
    roles: []
  }, {
    name: '资讯类型管理',
    path: '/admin/newsType',
    roles: []
  }, {
    name: '圈子管理',
    path: '/admin/postsType',
    roles: []
  }, {
    name: '帖子管理',
    path: '/admin/posts',
    roles: []
  }]
}, {
  name: '金融管理',
  icon: 'money',
  roles: [],
  children: [{
    name: '余额管理',
    path: '/admin/balance',
    roles: []
  }, {
    name: '提现管理',
    path: '/admin/withdraw',
    roles: []
  }]
}]
export default defineStore('user', () => {
  let info = ref(null)

  function getInfo() {
    return info.value
  }
  function changeInfo(e) {
    info.value = e
  }
  function getLeftNav() {
    let role = localStorage.getItem("role") || ''
    let arr = []
    if (role) {
      leftNavListAll.forEach((item) => {
        if (!item.roles || item.roles.length == 0 || item.roles.indexOf(role) !== -1) {
          if (item.children && item.children.length > 0) {
            let i_arr = []
            item.children.forEach((item1) => {
              if (!item1.roles || item1.roles.length == 0 || item1.roles.indexOf(role) !== -1) {
                i_arr.push(item1)
              }
            })
            if (i_arr.length > 0) {
              item.children = i_arr
              arr.push(item)
            }
          } else {
            arr.push(item)
          }
        }
      })
    }
    return arr
  }

  return { getInfo, changeInfo, getLeftNav }
})