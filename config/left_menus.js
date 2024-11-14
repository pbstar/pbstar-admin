export default [
  {
    name: '首页面板',
    path: '/admin/home',
    icon: 'home'
  }, {
    name: '子应用管理',
    icon: 'user',
    roles: [],
    children: [{
      name: '页面一',
      path: '/admin/app_test?test=/about',
      roles: []
    },{
      name: '页面二',
      path: '/admin/app_test?test=/',
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
  }
]