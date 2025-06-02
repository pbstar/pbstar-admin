const create = (json) => {
  let code = "";
  code += createScript(json);
  code += createHtml(json);
  code += createStyle();
  return code;
};

const createScript = (json) => {
  const tableColumn = [];
  const formData = [];
  json.fields.forEach((field) => {
    if (field.showIn.includes("table")) {
      let obj = {
        label: field.label,
        key: field.key,
      };
      if (field.enumKey) {
        obj = { ...obj, enumKey: field.enumKey };
      }
      tableColumn.push(obj);
    }
    if (field.showIn.includes("form")) {
      let obj = {
        label: field.label,
        type: field.type,
        key: field.key,
      };
      if (field.enumKey) {
        obj = { ...obj, enumKey: field.enumKey };
      }
      formData.push(obj);
    }
  });

  let code = `
  <script setup>
    import { ref, onBeforeMount, watch } from "vue";
    import { cloneDeep } from "es-toolkit/object";
    import { ElMessageBox } from "element-plus";
    import PTable from "@Pcomponents/base/p-table/index.vue";
    import PDialog from "@Pcomponents/base/p-dialog/index.vue";
    ${json.detailDiaType !== "box" ? `import PCollapse from "@Pcomponents/base/p-collapse/index.vue";` : ""}
    import PForm from "@Pcomponents/base/p-form/index.vue";
  
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
        tableTopBtn.value = [{ label: "新增", key: "add"}];
        tableRightBtn.value = [{ label: "编辑", key: "edit"}, { label: "删除", key: "delete"}];
      }
    });
  
    const tableColumn = ref(${JSON.stringify(tableColumn)});
    const tableData = ref([]);
    const tableRightBtn = ref([]);
    const tableTopBtn = ref([]);
    const detailType = ref("");
    const detailInfo = ref({});
    const isDetail = ref(false);
    const formData = ref(${JSON.stringify(formData)});
    
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
    
    const tableRightBtnClick = ({row, btn}) => {
      if (btn === "edit") {
        detailType.value = btn;
        const index = tableData.value.findIndex((item) => {
          return item.webId == row.webId;
        });
        isDetail.value = true;
        if (index > -1) {
          detailInfo.value = cloneDeep(tableData.value[index]);
        }
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
    
    const tableTopBtnClick = ({btn}) => {
      if (btn === "add") {
        detailType.value = "add";
        detailInfo.value = {};
        detailInfo.value.webId = getWebId();
        isDetail.value = true;
      }
    };
    
    const diaBotBtnClick = ({btn}) => {
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

const createHtml = (json) => {
  const spanList = [];
  const w100TypeList = ["textarea", "slot"];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("form")) return;
    if (w100TypeList.includes(field.type)) {
      spanList.push(12);
    } else {
      if (json.detailDiaType === "page") {
        spanList.push(4);
      } else {
        spanList.push(12);
      }
    }
  });
  const topCode = `
  <template>
    <div class="childBox">
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
        json.detailDiaType === "page" || json.detailDiaType === "drawer"
          ? '<div style="padding: 0 10px;"><p-collapse title="基础信息" :isControl="false" :showDownLine="false">'
          : '<div style="padding: 10px 0">'
      }
          <p-form :data="formData" :spanList="${JSON.stringify(spanList)}" v-model="detailInfo"></p-form>
      ${
        json.detailDiaType === "page" || json.detailDiaType === "drawer"
          ? "</p-collapse></div>"
          : "</div>"
      }
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

const createStyle = () => {
  const code = `
<style scoped lang="scss">
  .childBox {
    width: 100%;
  }
</style>
  `;
  return code;
};

export default {
  create,
};
