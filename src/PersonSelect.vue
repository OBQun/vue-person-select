<template>
  <div class="wrapper">
    <el-select
      remote
      :loading="loading"
      class="filter-select"
      :remote-method="getPersonList"
      :value="personList.length ? value : null"
      @change="$emit('change', $event)"
      v-bind="$attrs"
      filterable
      v-on="$listeners"
    >
      <el-option
        v-for="person in personList"
        :key="person.userId"
        :value="person.userId"
        :label="person.label"
      ></el-option>
    </el-select>
    <el-popover
      v-model="popoverShow"
      trigger="click"
      placement="bottom"
      popper-class="person-select-popover"
    >
      <el-cascader-panel
        :props="props"
        @change="handleCascaderChange"
        ref="cascader"
      ></el-cascader-panel>
      <template #reference>
        <i class="el-icon-user-solid suffix"></i>
      </template>
    </el-popover>
  </div>
</template>

<script>
  import { getPersonList, getDepartment } from "./request";
  export default {
    model: {
      event: "change",
      prop: "value",
    },
    props: ["value"],
    data() {
      return {
        popoverShow: false,
        loading: false,
        personList: [],
        props: {
          lazy: true,
          value: "id",
          emitPath: false,
          lazyLoad: ({ root, data }, resolve) => {
            if (root) {
              getDepartment().then(resolve);
            } else if (data.children) {
              resolve(null);
            } else {
              getPersonList({ departmentId: data.id }).then((res) => {
                resolve(
                  res.map(({ label, userId: id }) => ({
                    id,
                    label,
                    leaf: true,
                  }))
                );
              });
            }
          },
        },
      };
    },
    methods: {
      handleCascaderChange(value) {
        this.popoverShow = false;
        const { cascader } = this.$refs;

        if (value) {
          this.$emit("change", value);
          this.personList = cascader.menus[cascader.menus.length - 1].map(
            ({ data }) => ({ userId: data.id, label: data.label })
          );
        }
        cascader.clearCheckedNodes();
        cascader.activePath = [];

        cascader.menus = cascader.menus.slice(0, 1);
      },
      getPersonList(query) {
        this.loading = true;
        getPersonList({ keyword: query })
          .then((res) => {
            this.personList = res;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
    created() {
      this.getPersonList("");
    },
  };
</script>

<style scoped>
  .wrapper {
    display: inline-block;
    position: relative;
  }
  .filter-select ::v-deep .el-input__suffix {
    display: none;
  }
  .suffix {
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    right: 10px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
</style>

<style>
  .person-select-popover {
    padding: 0;
  }
</style>
