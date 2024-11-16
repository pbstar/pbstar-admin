export default [
  {
    name: '首页面板',
    path: '/admin/home',
    icon: 'home'
  }, {
    name: '模板管理',
    icon: 'user',
    roles: [],
    children: [{
      name: '页面一',
      path: '/admin/app_template?template=/about',
      roles: []
    }, {
      name: '页面二',
      path: '/admin/app_template?template=/',
      roles: []
    }]
  }, {
    name: '用户管理',
    path: '/admin/role',
    icon: 'user-safety',
    roles: []
  }, {
    name: '系统管理',
    icon: 'system-setting',
    roles: [],
    children: [{
      name: '用户管理',
      path: '/admin/notice',
      roles: []
    }, {
      name: '角色管理',
      path: '/admin/banner',
      roles: []
    }, {
      name: '菜单管理',
      path: '/admin/nav',
      roles: []
    }]
  }
]