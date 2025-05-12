const create = (json) => {
  let code = "";
  code += createScript(json);
  code += createHtml(json);
  code += createStyle(json);
  return code;
};

const createScript = (json) => {
  let code = `
  <script setup>
    import { ref, onBeforeMount } from "vue";
    import { ElMessage, ElMessageBox } from "element-plus";
    import request from "@Passets/utils/request";
    ${json.detailDiaType === "page" || json.detailDiaType === "drawer" ? 'import PCollapse from "@Pcomponents/base/p-collapse/index.vue";' : ""}
    import PItem from "@Pcomponents/base/p-item/index.vue";

    const props = defineProps({
      type: {
        type: String,
        default: "",
      },
      id: {
        type: [String, Number],
        default: "",
      },
    });
    const detailInfo = ref({});
    const detailType = ref("");
    const detailId = ref("");
  
    onBeforeMount(() => {
      detailType.value = props.type;
      detailId.value = props.id;
      if (detailType.value == "view" || detailType.value == "edit") {
        getDetailInfo();
      }
    });

    const getDetailInfo = () => {
      request
        .get({
          base: "${json.apiBase}",
          url: "${json.api.getOne}",
          data: {
            id: detailId.value,
          },
        })
        .then((res) => {
          if (res && res.code == 200) {
            detailInfo.value = res.data;
          } else {
          ElMessage.error(res.msg || "操作异常");
        }
      });
    };
    const getFormValue = () => {
      return detailInfo.value;
    };

    defineExpose({
      getFormValue,
    });
  </script>
  `;
  return code;
};

const createHtml = (json) => {
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

  const code = `
  <template>
    ${
      json.detailDiaType === "page" || json.detailDiaType === "drawer"
        ? `<div class="detail">
              <p-collapse title="基础信息" :isControl="false" :showDownLine="false">`
        : ""
    }
        <div class="items">
          ${formData
            .map(
              (field) => `
          <p-item
            class="dtItem"
            :config="{
              isText: detailType == 'view',
              type: '${field.type}',
              label: '${field.label}',
              ${field.enumType ? `enumType: '${field.enumType}',` : ""}
            }"
            v-model="detailInfo.${field.key}"
          />`,
            )
            .join("")}
        </div>
        ${
          json.detailDiaType === "page" || json.detailDiaType === "drawer"
            ? `</p-collapse>
                </div>`
            : ""
        }
  </template>
  `;
  return code;
};

const createStyle = (json) => {
  const code = `
  <style scoped lang="scss">
  .detail {
    padding: 0 10px;
    .items {
      ${json.detailDiaType === "box" ? `padding: 10px 0;` : ""}
      display: flex;
      ${
        json.detailDiaType === "page"
          ? `flex-wrap: wrap;`
          : `flex-direction: column;`
      }
      
      .dtItem {
        ${
          json.detailDiaType === "page"
            ? `width: 30%; margin-right: 3%;`
            : `width: 100%;`
        }
        margin-bottom: 10px;
      }
    }
  }
  </style>
  `;
  return code;
};

export default {
  create,
};
