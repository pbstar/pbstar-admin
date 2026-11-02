<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import { getNoticeDetail } from "@/api/notice";
import type { NoticePayload } from "@/api/notice";
import { getAllUsers } from "@/api/user";
import type { UserOption } from "@/api/user";
import { pCollapse, pItem } from "@Pcomponents";
import { noticeTypeOptions, getNoticeTypeLabel } from "../constants";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  id: {
    type: Number,
    default: 0,
  },
});
const detailInfo = ref<NoticePayload>({
  title: "",
  content: "",
  type: "notice",
  receiverIds: [],
});
const detailType = ref("");
const detailId = ref<number>(0);
const userList = ref<UserOption[]>([]);

onBeforeMount(() => {
  detailType.value = props.type;
  detailId.value = props.id;
  getUserList();
  if (detailType.value == "view" || detailType.value == "edit") {
    getDetailInfo();
  }
});
const getUserList = () => {
  getAllUsers().then((res) => {
    if (res.code === 200 && res.data) {
      userList.value = res.data;
    } else {
      ElMessage.error(res.msg || "获取用户列表失败");
    }
  });
};
const getDetailInfo = () => {
  getNoticeDetail({ id: detailId.value }).then((res) => {
    if (res && res.code == 200) {
      detailInfo.value = res.data;
    } else {
      ElMessage.error(res.msg || "操作异常");
    }
  });
};
/** 查看态把接收人 id 列表转成姓名串展示 */
const getReceiverText = () =>
  detailInfo.value.receiverIds
    .map((id) => userList.value.find((u) => u.id === id)?.name || id)
    .join("、");
const getFormValue = () => {
  return detailInfo.value;
};

defineExpose({
  getFormValue,
});
</script>

<template>
  <div class="detail">
    <p-collapse title="基础信息" :isControl="false" :showDownLine="false">
      <div class="items">
        <p-item
          class="dtItem"
          label="标题"
          :showText="detailType === 'view'"
          :text="detailInfo.title"
        >
          <el-input v-model="detailInfo.title" placeholder="请输入通知标题" />
        </p-item>
        <p-item
          class="dtItem"
          label="类型"
          :showText="detailType === 'view'"
          :text="getNoticeTypeLabel(detailInfo.type)"
        >
          <el-select v-model="detailInfo.type" placeholder="请选择通知类型">
            <el-option
              v-for="item in noticeTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </p-item>
        <p-item
          class="dtItem"
          label="接收人"
          :showText="detailType === 'view'"
          :text="getReceiverText()"
        >
          <el-select
            v-model="detailInfo.receiverIds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择接收人"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </p-item>
        <p-item
          class="dtItem"
          label="内容"
          :showText="detailType === 'view'"
          :text="detailInfo.content"
          isTextWrap
        >
          <el-input
            v-model="detailInfo.content"
            type="textarea"
            :rows="4"
            placeholder="请输入通知内容"
          />
        </p-item>
      </div>
    </p-collapse>
  </div>
</template>

<style scoped lang="scss">
.detail {
  .items {
    display: flex;
    flex-direction: column;

    .dtItem {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>
