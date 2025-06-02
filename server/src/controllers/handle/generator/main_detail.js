const create = (json) => {
  let code = "";
  code += createScript(json);
  code += createHtml(json);
  code += createStyle();
  return code;
};

const createScript = (json) => {
  const formData = [];
  json.fields.forEach((field) => {
    if (!field.showIn.includes("form")) return;
    let obj = {
      label: field.label,
      type: field.type,
      key: field.key,
      isText: `detailType.value == "view"`,
    };
    if (field.enumKey) {
      obj = { ...obj, enumKey: field.enumKey };
    }
    formData.push(obj);
  });
  let code = `
  <script setup>
    import { ref, onBeforeMount } from "vue";
    import { ElMessage } from "element-plus";
    import request from "@Passets/utils/request";
    ${json.detailDiaType === "page" || json.detailDiaType === "drawer" ? 'import PCollapse from "@Pcomponents/base/p-collapse/index.vue";' : ""}
    import PForm from "@Pcomponents/base/p-form/index.vue";

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
    const formData = ref(${JSON.stringify(formData)});
  
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
          base: "${json.apiKey}",
          url: "/${json.apiBase}/${json.key}/getDetail",
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

  const code = `
  <template>
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
  </template>
  `;
  return code;
};

const createStyle = () => {
  const code = `
  <style scoped lang="scss">
  </style>
  `;
  return code;
};

export default {
  create,
};
