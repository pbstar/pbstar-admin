<template>
  <div class="page">
    <p-title :list="['用户列表']"></p-title>
    <p-search style="margin-top: 10px" @search="toSearch" @reset="toReset">
      <p-item class="item" label="姓名">
        <el-input v-model="searchValue.name" placeholder="请输入姓名" />
      </p-item>
      <p-item class="item" label="年龄">
        <el-input-number
          v-model="searchValue.age"
          :controls="false"
          placeholder="请输入年龄"
        />
      </p-item>
      <p-item class="item" label="性别">
        <el-select v-model="searchValue.sex" placeholder="请选择性别">
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </p-item>
      <p-item class="item" label="是否健康">
        <el-select v-model="searchValue.isHealthy" placeholder="请选择">
          <el-option
            v-for="item in booleanOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </p-item>
    </p-search>
    <p-table
      style="margin-top: 10px"
      :data="data"
      :pagination="pagination"
      @paginationChange="toPageChange"
    >
      <template #column>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄">
          <template #default="{ row }">
            <span v-show="row.age < 25">{{ row.age }}</span>
            <span v-show="row.age >= 25">{{ row.age }}（老年人）</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template #default="{ row }">
            {{ getOptionLabel(sexOptions, row.sex) }}
          </template>
        </el-table-column>
        <el-table-column prop="ethnic" label="民族">
          <template #default="{ row }">
            {{ getOptionLabel(ethnicOptions, row.ethnic) }}
          </template>
        </el-table-column>
        <el-table-column prop="isHealthy" label="是否健康">
          <template #default="{ row }">
            {{ getOptionLabel(booleanOptions, row.isHealthy) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="handleView(row)">
              查看
            </el-button>
            <el-button type="primary" size="small" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-dropdown trigger="click">
              <el-button
                style="margin-left: 5px; margin-top: 2px"
                type="primary"
                link
                size="small"
              >
                <span>更多</span>
                <p-icon name="el-icon-arrow-down" />
              </el-button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleDelete(row)"
                    >删除
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleOther()"
                    >其他
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </template>
      <template #topLeft>
        <el-button type="primary" @click="handleAdd()"> 新增 </el-button>
      </template>
    </p-table>
    <p-dialog
      title="用户列表详情页"
      type="drawer"
      width="1000px"
      v-model="isDetail"
    >
      <Detail ref="detailRef" :type="detailType" :id="detailId"></Detail>
      <template #footer>
        <el-button
          type="primary"
          @click="handleSave()"
          v-if="detailType !== 'view'"
        >
          保存
        </el-button>
        <el-button @click="handleBack()"> 返回 </el-button>
      </template>
    </p-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPersonList, deletePersons, createPerson, updatePerson } from "@/api/person";
import {
  pTable,
  pSearch,
  pTitle,
  pDialog,
  pIcon,
  pItem,
} from "@Pcomponents";
import { booleanOptions, ethnicOptions, sexOptions, getOptionLabel } from "@/constants/options";
import Detail from "./components/detail.vue";
const data = ref<any[]>([]);

const pagination = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
});
const searchValue = ref<Record<string, any>>({});
const isDetail = ref(false);
const detailType = ref("");
const detailId = ref<string | number>("");
const detailRef = ref<InstanceType<typeof Detail> | null>(null);

onMounted(() => {
  initTable();
});
const toSearch = () => {
  pagination.value.pageNumber = 1;
  initTable();
};
const toReset = () => {
  searchValue.value = {};
  toSearch();
};
const toPageChange = ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  pagination.value.pageNumber = pageNumber;
  pagination.value.pageSize = pageSize;
  initTable();
};
const initTable = () => {
  getPersonList({ ...searchValue.value, ...pagination.value })
    .then((res) => {
      if (res && res.code == 200) {
        data.value = res.data.list;
        pagination.value.total = res.data.total;
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const handleAdd = () => {
  detailType.value = "add";
  detailId.value = "";
  isDetail.value = true;
};
const handleView = (row: any) => {
  detailType.value = "view";
  detailId.value = row.id;
  isDetail.value = true;
};
const handleEdit = (row: any) => {
  detailType.value = "edit";
  detailId.value = row.id;
  isDetail.value = true;
};
const handleDelete = (row: any) => {
  ElMessageBox.confirm("确认删除吗?", "提示", {
    type: "warning",
  }).then(() => {
    deletePersons([row.id])
      .then((res) => {
        if (res && res.code == 200) {
          ElMessage.success("删除成功");
          initTable();
        } else {
          ElMessage.error(res.msg || "操作异常");
        }
      });
  });
};
const handleOther = () => {
  ElMessage.success("其他");
};
const handleSave = () => {
  const detailInfo = detailRef.value?.getFormValue();
  if (!detailInfo) {
    return;
  }
  const save = detailType.value == "add" ? createPerson : updatePerson;
  save(detailInfo).then((res) => {
      if (res && res.code == 200) {
        ElMessage.success("保存成功");
        isDetail.value = false;
        initTable();
      } else {
        ElMessage.error(res.msg || "操作异常");
      }
    });
};
const handleBack = () => {
  isDetail.value = false;
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 0 10px 10px;
  background-color: var(--c-bg);

  .item {
    width: 250px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>
