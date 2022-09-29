<template>
  <div class="wrapper">
    <el-select
      class="filter-select"
      :value="personList.length ? value : null"
      remote
      :remote-method="getPersonList"
      filterable
      :loading="loading"
      @change="handleSelectChange"
      v-bind="$attrs"
      v-on="$listeners"
      :multiple="multiple"
      @blur="handleSelectBlur"
      @focus="popoverShow = false"
    >
      <el-option
        v-for="person in personList"
        :key="person.userId"
        :value="person.userId"
        :label="person.nickName"
      ></el-option>
    </el-select>
    <el-popover
      v-model="popoverShow"
      trigger="click"
      placement="bottom"
      popper-class="person-select-popover"
    >
      <el-cascader-panel
        :value="multiple ? value : null"
        :props="props"
        @change="handleCascaderChange"
        @expand-change="syncCascaderCheckState"
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
  props: {
    value: {
      type: [String, Array, Number],
    },
    multiple: Boolean,
  },
  watch: {
    multiple: {
      handler(val) {
        this.props.multiple = val;
      },
      immediate: true,
    },
  },
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
                res.map(({ nickName: label, userId: id }) => ({
                  id,
                  label,
                  leaf: true,
                }))
              );
              this.syncCascaderCheckState();
            });
          }
        },
      },
    };
  },
  methods: {
    syncCascaderCheckState() {
      if (this.multiple) {
        this.$refs.cascader.syncMultiCheckState();
      }
    },
    handleSelectChange(value) {
      this.$emit("change", value);

      if (value && !this.multiple) {
        this.personList = [
          this.personList.find(({ userId }) => userId === value),
        ];
      }
    },
    handleSelectBlur() {
      if (this.multiple) {
        this.personList = this.personList.filter(({ userId }) =>
          this.value.includes(userId)
        );
      }
    },
    handleCascaderChange(value) {
      const { cascader } = this.$refs;
      if (this.multiple) {
        cascader.getCheckedNodes(true).forEach(({ data: { id, label } }) => {
          if (this.personList.findIndex(({ userId }) => userId === id) === -1) {
            this.personList.push({ nickName: label, userId: id });
          }
        });
        this.$emit("change", [...new Set(value)]);
      } else {
        this.popoverShow = false;
        if (value) {
          this.$emit("change", value);
          const [
            {
              data: { id, label },
            },
          ] = cascader.getCheckedNodes();
          this.personList = [{ nickName: label, userId: id }];
        }
        cascader.clearCheckedNodes();
        cascader.activePath = [];
        cascader.menus = cascader.menus.slice(0, 1);
      }
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
    initPersonList() {
      if (this.value) {
        this.loading = true;
        getPersonList()
          .then((res) => {
            this.personList = this.multiple
              ? res.filter(({ userId }) => this.value.includes(userId))
              : [res.find(({ userId }) => userId === this.value)];
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
  created() {
    this.initPersonList();
  },
};
</script>

<style scoped>
.wrapper {
  display: inline-block;
  position: relative;
}
.filter-select ::v-deep .el-input__suffix {
  transform: translateX(-20px);
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
.person-select-popover .el-cascader-node[aria-haspopup] .el-checkbox {
  display: none;
}
</style>
