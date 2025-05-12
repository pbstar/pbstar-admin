const create = async (json) => {
  let code = "";
  code += await createScript(json);
  code += await createHtml(json);
  code += await createStyle(json);
  return code;
};

const createScript = async (json) => {
  const tableColumn = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("table")) return;
    let obj = {
      label: field.label,
      key: field.key,
    };
    if (field.enumType) {
      obj = { ...obj, enumType: field.enumType };
    }
    tableColumn.push(obj);
  });

  let code = `
  <script setup>
    import { ref, onBeforeMount, watch } from "vue";
    import { cloneDeep } from "es-toolkit/object";
    import { ElMessageBox } from "element-plus";
    import PTable from "@Pcomponents/base/p-table/index.vue";
    import PDialog from "@Pcomponents/base/p-dialog/index.vue";
    ${json.detailDiaType !== "box" ? `import PCollapse from "@Pcomponents/base/p-collapse/index.vue";` : ""}
    import PItem from "@Pcomponents/base/p-item/index.vue";
  
    const props = defineProps({
      type: {
        type: String,
        default: "",
      },
      modelValue: {
        type: Array,
        default: () => [],
      },
    });
    const emit = defineEmits(["update:modelValue", "change"]);

    onBeforeMount(() => {
      if (props.type == "view") {
        tableTopBtn.value = [];
        tableRightBtn.value = [];
      } else {
        tableTopBtn.value = [{ label: "新增", value: "add"}];
        tableRightBtn.value = [{ label: "编辑", value: "edit"}, { label: "删除", value: "delete"}];
      }
    });
  
    const tableColumn = ref(${JSON.stringify(tableColumn)});
    const tableData = ref([]);
    const tableRightBtn = ref([]);
    const tableTopBtn = ref([]);
    const detailType = ref("");
    const detailInfo = ref({});
    const isDetail = ref(false);
    
    const getWebId = () => {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      return "webId_" + timestamp + "_" + randomNum;
    };
    const handleChange = (val) => {
      let arr = cloneDeep(val);
      arr.forEach((item) => {
        if (item["webId"]) {
          delete item["webId"];
        }
      });
      emit("update:modelValue", arr);
      emit("change", arr);
    };
    
    const tableRightBtnClick = (row, btn) => {
      if (btn === "edit") {
        detailType.value = btn;
        const index = tableData.value.findIndex((item) => {
          return item.webId == row.webId;
        });
        if (index > -1) {
          detailInfo.value = cloneDeep(tableData.value[index]);
        }
        isDetail.value = true;
      } else if (btn === "delete") {
        ElMessageBox.confirm("确认删除吗?", "提示", {
          type: "warning",
        })
          .then(() => {
            const index = tableData.value.findIndex((item) => {
              return item.webId == row.webId;
            });
            if (index > -1) {
              tableData.value.splice(index, 1);
              handleChange(tableData.value);
            }
          })
          .catch(() => {});
      }
    };
    
    const tableTopBtnClick = (btn) => {
      if (btn === "add") {
        detailType.value = "add";
        detailInfo.value = {};
        detailInfo.value.webId = getWebId();
        isDetail.value = true;
      }
    };
    
    const diaBotBtnClick = (btn) => {
      if (btn === "save") {
        if (detailType.value === "add") {
          tableData.value.push(detailInfo.value);
        } else if (detailType.value === "edit") {
          const index = tableData.value.findIndex((item) => {
            return item.webId == detailInfo.value.webId;
          });
          if (index > -1) {
            tableData.value[index] = detailInfo.value;
          }
        }
        handleChange(tableData.value);
        isDetail.value = false;
      } else if (btn === "back") {
        isDetail.value = false;
      }
    };
    
    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        if (newVal && newVal.length > 0) {
          tableData.value = cloneDeep(newVal);
          tableData.value.forEach((item) => {
            if (!item.webId) {
              item.webId = getWebId();
            }
          });
        } else {
          tableData.value = [];
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );
  </script>
  `;
  return code;
};

const createHtml = async (json) => {
  const formData = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("form")) return;
    let obj = {
      label: field.label,
      type: field.type,
      key: field.key,
    };
    if (field.enumType) {
      obj = { ...obj, enumType: field.enumType };
    }
    formData.push(obj);
  });

  const topCode = `
  <template>
    <div class="box">
  `;

  const contentCode = `
      <p-table
        :column="tableColumn"
        :data="tableData"
        :rightBtn="tableRightBtn"
        :topBtn="tableTopBtn"
        @rightBtnClick="tableRightBtnClick"
        @topBtnClick="tableTopBtnClick"
      />
  `;

  const diaCode = `
      <p-dialog
        type="${json.detailDiaType}"
        title="${json.title}详情页"
        v-model="isDetail"
        :botBtn="[
          { label: '保存', key: 'save' },
          { label: '返回', key: 'back' },
        ]"
        @botBtnClick="diaBotBtnClick"
      >
        ${
          json.detailDiaType === "drawer"
            ? `<div class="detail"><collapse title="基础信息" :isControl="false" :showDownLine="false">`
            : ""
        }
          <div class="items">
            ${formData
              .map(
                (field) => `
            <formItem
              class="dtItem"
              :config="{
                key: '${field.key}',
                type: '${field.type}',
                label: '${field.label}',
                ${field.enumType ? `enumType: '${field.enumType}',` : ""}
              }"
              v-model="detailInfo.${field.key}"
            />`,
              )
              .join("")}
          </div>
          ${json.detailDiaType === "drawer" ? `</collapse></div>` : ""}
      </p-dialog>
  `;

  const bottomCode = `
    </div>
  </template>
  `;

  let code = "";
  code += topCode;
  code += contentCode;
  code += diaCode;
  code += bottomCode;
  return code;
};

const createStyle = async (json) => {
  const code = `
<style scoped lang="scss">
  .box {
    width: 100%;
    padding-top: 10px;
    ${json.detailDiaType === "drawer" ? `.detail { padding: 0 10px;` : ""}
    
    .items {
      ${json.detailDiaType === "box" ? `padding: 20px;` : ""}
      display: flex;
      flex-direction: column;
      
      .dtItem {
        width: 100%;
        margin-bottom: 10px;
      }
    }
    ${json.detailDiaType === "drawer" ? `}` : ""}
  }
</style>
  `;
  return code;
};

export default {
  create,
};
