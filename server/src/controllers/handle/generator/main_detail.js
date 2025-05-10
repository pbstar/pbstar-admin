const create = async (json) => {
  let code = "";
  code += await createScript(json);
  code += await createHtml(json);
  code += await createStyle(json);
  return code;
};

const createScript = async (json) => {
  let code = `
  <script setup>
    import { ref, onBeforeMount } from "vue";
    import collapse from "@/components/base/collapse.vue";
    import formItem from "@/components/base/formItem.vue";

    const props = defineProps({
      type: {
        type: String,
        default: "",
      },
      info: {
        type: Object,
        default: () => ({}),
      },
    });
    const detailInfo = ref({});
    const detailType = ref("");
  
    onBeforeMount(() => {
      if (props.type) {
        detailType.value = props.type;
      }
      if (props.info) {
        detailInfo.value = props.info;
      }
    });
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

const createHtml = async (json) => {
  const formData = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("form")) return;
    let obj = {
      name: field.name,
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
      json.detailDiaType === "diapage" || json.detailDiaType === "diadrawer"
        ? `<div class="detail">
              <collapse title="基础信息" :isControl="false" :showDownLine="false">`
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
              isText: detailType == 'preview',
              type: '${field.type}',
              label: '${field.label}',
              ${field.enumType ? `enumType: '${field.enumType}',` : ""}
            }"
            v-model="detailInfo.${field.key}"
          />`
            )
            .join("")}
        </div>
        ${
          json.detailDiaType === "diapage" || json.detailDiaType === "diadrawer"
            ? `</collapse>
                </div>`
            : ""
        }
  </template>
  `;
  return code;
};

const createStyle = async (json) => {
  const code = `
  <style scoped lang="scss">
  ${
    json.detailDiaType === "diapage" || json.detailDiaType === "diadrawer"
      ? `.detail {
           padding: 0 10px;
         }`
      : ""
  }
    .items {
      ${json.detailDiaType === "diabox" ? `padding: 10px 0;` : ""}
      display: flex;
      ${
        json.detailDiaType === "diapage"
          ? `flex-wrap: wrap;`
          : `flex-direction: column;`
      }
      
      .dtItem {
        ${
          json.detailDiaType === "diapage"
            ? `width: 30%; margin-right: 3%;`
            : `width: 100%;`
        }
        margin-bottom: 10px;
      }
    }
  </style>
  `;
  return code;
};

export default {
  create,
};
