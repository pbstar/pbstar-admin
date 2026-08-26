import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import useSharedStore from "@Passets/stores/shared";
import { logout as logoutRequest } from "@/api";
import { logout } from "@/utils/auth";

/**
 * 顶部导航用户信息与常用操作（桌面/移动端共用）
 */
export function useUserHeader() {
  const sharedStore = useSharedStore();
  const router = useRouter();

  // 系统标题（静态值，无需响应式）
  const title = import.meta.env.PUBLIC_TITLE;
  const userName = ref(sharedStore.userInfo?.name || "管理员");
  const userImg = ref(sharedStore.userInfo?.avatar || "");

  const toUserInfo = () => {
    router.push({ path: "/admin/pUser" });
  };

  const toLoginOut = () => {
    logoutRequest().then((res) => {
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