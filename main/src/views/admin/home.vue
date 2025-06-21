<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { Plus, Close } from "@element-plus/icons-vue";
import useSharedStore from "@Passets/stores/shared";
import PCollapse from "@Pcomponents/base/p-collapse/index.vue";
import PItem from "@Pcomponents/base/p-item/index.vue";
import { useNavsStore } from "@/stores/navs";
import { flatten } from "@Passets/utils/array";

const sharedStore = useSharedStore();
const navsStore = useNavsStore();
const router = useRouter();
const userInfo = ref(sharedStore.userInfo || {});
const hello = ref("你好");
const docs = ref([
  {
    text: "简介",
    items: [
      { text: "什么是 PbstarAdmin ?", link: "/docs/what.html" },
      { text: "目录结构", link: "/docs/structure.html" },
      { text: "快速开始", link: "/docs/start.html" },
    ],
  },
  {
    text: "指南",
    items: [
      { text: "Cli 脚手架", link: "/docs/cli.html" },
      { text: "Components 组件库", link: "/docs/components.html" },
      { text: "Assets 静态资源", link: "/docs/assets.html" },
      { text: "Main 主应用", link: "/docs/main.html" },
      { text: "Apps 子应用", link: "/docs/apps.html" },
    ],
  },
  {
    text: "进阶",
    items: [
      { text: "Generator 代码生成器", link: "/docs/generator.html" },
      { text: "Server 服务端", link: "/docs/server.html" },
    ],
  },
  {
    text: "其他",
    items: [
      { text: "常见问题", link: "/docs/faq.html" },
      { text: "开发计划", link: "/docs/plan.html" },
      { text: "参与贡献", link: "/docs/contribute.html" },
      { text: "赞助支持", link: "/docs/sponsor.html" },
    ],
  },
]);
const navs = ref([]);
const navAddOptions = ref([]);
const isNavAdd = ref(false);
const navAddValue = ref("");

onMounted(() => {
  const diyNavs = localStorage.getItem("p_diyNavs");
  if (diyNavs) {
    navs.value = JSON.parse(diyNavs);
  }
  hello.value = getHello();
});
watch(
  () => sharedStore.userInfo,
  (newVal) => {
    userInfo.value = newVal;
    hello.value = getHello();
  },
);

const getHello = () => {
  const hour = new Date().getHours();
  let text = "";
  if (hour >= 5 && hour < 8) {
    text = "早上好";
  } else if (hour >= 8 && hour < 11) {
    text = "上午好";
  } else if (hour >= 11 && hour < 14) {
    text = "中午好";
  } else if (hour >= 14 && hour < 18) {
    text = "下午好";
  } else if (hour >= 18 && hour < 24) {
    text = "晚上好";
  } else {
    text = "你好";
  }
  text = text + "，" + userInfo.value?.name || "管理员";
  return text;
};
const toNav = (item) => {
  if (item.url) {
    router.push(item.url);
  }
};
const showNavAdd = () => {
  if (navsStore.navsTree && navsStore.navsTree.length > 0) {
    const list = flatten(navsStore.navsTree).map((item) => {
      return { label: item.name, value: item.id, ...item };
    });
    nextTick(() => {
      navAddOptions.value = list;
    });
  }
  isNavAdd.value = true;
};
const toNavAdd = () => {
  if (navAddValue.value) {
    const val = navAddOptions.value.find(
      (item) => item.value == navAddValue.value,
    );
    if (val) {
      navs.value.push({ name: val.name, url: val.url });
      localStorage.setItem("p_diyNavs", JSON.stringify(navs.value));
    }
  }
  isNavAdd.value = false;
};
const removeNav = (index) => {
  navs.value.splice(index, 1);
  localStorage.setItem("p_diyNavs", JSON.stringify(navs.value));
};
</script>
<template>
  <div class="page">
    <div class="r1 iBox">
      <div class="r1Left">
        <div class="avatar">
          <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="" />
          <img v-else src="@/assets/imgs/user.png" alt="" />
        </div>
        <div class="more">
          <p>{{ hello }}！</p>
          <p>只有脚踏实地的人，才能说：路，就在我的脚下。</p>
        </div>
      </div>
      <div class="r1Right"></div>
    </div>
    <div class="r2">
      <div class="r2Left">
        <div class="r2l1 iBox">
          <p-collapse title="文档快看" :isControl="false">
            <div class="docs">
              <div
                v-for="(group, gIndex) in docs"
                :key="gIndex"
                class="doc-group"
              >
                <h3>{{ group.text }}</h3>
                <div class="doc-items">
                  <a
                    v-for="(item, iIndex) in group.items"
                    :key="iIndex"
                    :href="'http://pbstar-admin-docs.pbstar.cn' + item.link"
                    target="_blank"
                  >
                    {{ item.text }}
                  </a>
                </div>
              </div>
            </div>
          </p-collapse>
        </div>
        <div class="r2l2 iBox">
          <p-collapse title="最新动态" :isControl="false">
            <div class="news">
              <div class="news-item">
                <p>
                  2025-05-01：PbstarAdmin 即将发布，欢迎大家使用和反馈问题。
                </p>
              </div>
              <div class="news-item">
                <p>
                  2025-05-01：PbstarAdmin 即将发布，欢迎大家使用和反馈问题。
                </p>
              </div>
            </div>
          </p-collapse>
        </div>
      </div>
      <div class="r2Right">
        <div class="r2r1 iBox">
          <p-collapse title="快捷导航" :isControl="false">
            <div class="navs">
              <div
                class="nav-item"
                v-for="(item, index) in navs"
                :key="index"
                @click="toNav(item)"
              >
                <span>{{ item.name }}</span>
                <el-icon class="delete-icon" @click.stop="removeNav(index)"
                  ><Close />
                </el-icon>
              </div>
              <el-popover
                placement="bottom"
                title="添加快捷导航"
                :width="200"
                trigger="click"
                :visible="isNavAdd"
              >
                <template #reference>
                  <div class="nav-add" @click="showNavAdd">
                    <el-icon><Plus /></el-icon>
                  </div>
                </template>
                <template #default>
                  <p-item
                    :config="{
                      type: 'selectTree',
                      options: navAddOptions,
                    }"
                    v-model="navAddValue"
                  ></p-item>
                  <el-button
                    style="width: 100%; margin-top: 10px"
                    type="primary"
                    @click="toNavAdd"
                  >
                    确定
                  </el-button>
                </template>
              </el-popover>
            </div>
          </p-collapse>
        </div>
        <div class="r2r2 iBox">
          <p-collapse title="其他内容" :isControl="false">
            <span>其他内容</span>
          </p-collapse>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page {
  .iBox {
    padding: 0 10px;
    background-color: var(--c-bg);
  }
  .r1 {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .r1Left {
      width: 70%;
      height: 100%;
      display: flex;
      align-items: center;
      .avatar {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .more {
        width: calc(100% - 70px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p:nth-child(1) {
          font-size: 18px;
          color: var(--c-text);
          font-weight: bold;
          margin-bottom: 5px;
        }
        p:nth-child(2) {
          font-size: 14px;
          color: var(--c-text2);
        }
      }
    }
  }
  .r2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .r2Left {
      width: 60%;
      display: flex;
      flex-direction: column;
      .r2l1 {
        width: 100%;
        margin-bottom: 10px;
        padding-bottom: 15px;
        .docs {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .doc-group {
            width: 100%;
            margin-top: 10px;
            h3 {
              font-size: 16px;
              color: var(--c-text);
              font-weight: bold;
              margin-bottom: 2px;
            }
            .doc-items {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              a {
                height: 20px;
                line-height: 20px;
                margin-right: 20px;
                font-size: 14px;
                color: var(--c-text);
                text-decoration: none;
                &:hover {
                  color: var(--c-text3);
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
      .r2l2 {
        width: 100%;
        padding-bottom: 15px;
        .news {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .news-item {
            width: 100%;
            border-bottom: 1px solid var(--c-border);
            padding: 10px 5px;

            p {
              line-height: 18px;
              font-size: 14px;
              color: var(--c-text);
            }
          }
        }
      }
    }
    .r2Right {
      width: calc(40% - 10px);
      display: flex;
      flex-direction: column;
      .r2r1 {
        width: 100%;
        margin-bottom: 10px;
        .navs {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          margin-top: 10px;
          .nav-item,
          .nav-add {
            width: 70px;
            height: 70px;
            line-height: 20px;
            margin-right: 10px;
            margin-bottom: 10px;
            padding: 5px;
            font-size: 14px;
            color: var(--c-text);
            background-color: var(--c-bg-box);
            border-radius: 2px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            &:hover {
              color: var(--c-text3);
              .delete-icon {
                display: block;
              }
            }
            .delete-icon {
              width: 20px;
              height: 20px;
              color: var(--c-text);
              background-color: var(--c-bg);
              display: none;
              position: absolute;
              top: 2px;
              right: 2px;
              font-size: 12px;
              border-radius: 50%;
              line-height: 22px;
              text-align: center;
              cursor: pointer;
            }
          }
        }
      }
      .r2r2 {
        width: 100%;
        height: 230px;
        padding-bottom: 15px;
        span {
          font-size: 14px;
          color: var(--c-text);
        }
      }
    }
  }
  @media screen and (max-width: 700px) {
    .r2 {
      flex-direction: column;
      .r2Left {
        width: 100%;
        margin-bottom: 10px;
        .r2l2 {
          .news-item {
            padding-bottom: 10px;
          }
        }
      }
      .r2Right {
        width: 100%;
      }
    }
  }
}
</style>
