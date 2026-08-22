import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
import request from "@Passets/utils/request";
import { logout } from "@/utils/auth";

/**
 * 顶部导航用户信息与常用操作（桌面/移动端共用）
 */
export function useUserHeader() {
  const sharedStore = useSharedStore();
  const router = useRouter();

  // 系统标题（静态值，无需响应式）
  const title = import.meta.env.PUBLIC_TITLE;
  // 用户名称
  const userName = ref(sharedStore.userInfo?.name || "管理员");
  // 用户头像
  const userImg = ref(sharedStore.userInfo?.avatar || "");

  // 跳转个人资料
  const toUserInfo = () => {
    router.push({ path: "/admin/pUser" });
  };

  // 退出登录
  const toLoginOut = () => {
    request.post({ url: "/main/logout" }).then((res) => {
      if (res.code === 200) {
        logout();
      }
    });
  };

  watch(
    () => sharedStore.userInfo,
    (newVal) => {
      if (newVal) {
        userName.value = newVal.name || "管理员";
        userImg.value = newVal.avatar || "";
      }
    },
  );

  return {
    title,
    userName,
    userImg,
    toUserInfo,
    toLoginOut,
  };
}