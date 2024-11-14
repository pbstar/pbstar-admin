import { ref } from 'vue'
import { defineStore } from 'pinia'
import leftNavListAll from '@config/left_menus'

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