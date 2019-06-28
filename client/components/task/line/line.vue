<template>
  <div>
    <el-select
      v-model="value1"
      placeholder="请选择公司"
      class="mb-5"
      @change="getFactory"
    >
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="value2"
      placeholder="请选择工厂"
      class="mb-5"
      @change="getWorkshop"
    >
      <el-option
        v-for="item in factories"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="value3"
      placeholder="请选择车间"
      class="mb-5"
      @change="getLine"
    >
      <el-option
        v-for="v in workshops"
        :key="v._id"
        :label="v.name"
        :value="v._id"
      >
      </el-option>
    </el-select>
    <el-select v-model="value4" placeholder="请选择产线" class="mb-5">
      <el-option v-for="l in lines" :key="l._id" :label="l.name" :value="l._id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Object],
      require: false,
      default: ''
    },
    goodsSpecId: {}
  },
  data() {
    return {
      options: [],
      factories: [],
      workshops: [],
      lines: [],
      value1: '',
      value2: '',
      value3: '',
      value4: ''
    }
  },
  watch: {
    value4() {
      this.$emit('input', this.value4)
    }
  },
  async created() {
    const result = await this.$axios.$get('/api/v1/company', {
      params: { pageSize: 9999 }
    })
    this.options = result.data
    if (this.value) {
      this.value1 = this.value.workshop.factory.company._id
      this.value2 = this.value.workshop.factory._id
      this.value3 = this.value.workshop._id
      this.value4 = this.value._id
      if (this.value1) {
        const result = await this.$axios.$get('/api/v1/factory', {
          params: { pageSize: 9999, company: this.value1 }
        })
        this.factories = result.data
        if (this.value2) {
          this.getWorkshop()
        }
        if (this.value3) {
          this.getLine()
        }
      }
    }
  },
  methods: {
    async getFactory() {
      this.value2 = ''
      this.value3 = ''
      this.value4 = ''
      const result = await this.$axios.$get('/api/v1/factory', {
        params: { pageSize: 9999, company: this.value1 }
      })
      this.factories = result.data
    },
    async getWorkshop() {
      const result = await this.$axios.$get('/api/v1/workshop', {
        params: { pageSize: 9999, factory: this.value2 }
      })
      this.workshops = result.data
    },
    async getLine() {
      const result = await this.$axios.$get('/api/v1/line', {
        params: { pageSize: 9999, workshop: this.value3 }
      })
      this.lines = result.data
    }
  }
}
</script>
