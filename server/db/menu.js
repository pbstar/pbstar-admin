export default [
  {
    id: 1,
    parentId: 0,
    name: '首页面板',
    path: '/admin/home',
    icon: 'home'
  }, {
    id: 2,
    parentId: 0,
    name: '模板管理',
    icon: 'user',
  },
  {
    id: 3,
    parentId: 2,
    name: '页面一',
    path: '/admin/app_template?template=%2Fabout',
  },
  {
    id: 4,
    parentId: 2,
    name: '页面二',
    path: '/admin/app_template?template=%2F',
  },
  {
    id: 5,
    parentId: 0,
    name: '系统管理',
    icon: 'system-setting',
  },
  {
    id: 6,
    parentId: 5,
    name: '用户管理',
    path: '/admin/user',
  },
  {
    id: 7,
    parentId: 5,
    name: '角色管理',
    path: '/admin/role',
  },
  {
    id: 8,
    parentId: 5,
    name: '菜单管理',
    path: '/admin/menu',
  }
]