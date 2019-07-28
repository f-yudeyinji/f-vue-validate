<template>
  <form>
    <input ref="name"
           v-validate=""
           v-model="form.name"
           name="name"
           data-required="true"
           data-trigger="input|blur|keyup"
           data-error-position="after"
           placeholder="请输入名称"
           class="js-validate"
           type="text">
    <input v-validate="validate.age"
           name="age"
           class="js-validate"
           type="text"
           placeholder="请输入年龄">
    <button type="button" @click="submitForm">提交</button>
  </form>
</template>

<script>
export default {
  name: 'example',
  data(){
    return{
      form: {
        name: '',
        age:''
      },
      validate: {
        age:{
          rule: [
            {
              name:'required',  //使用组件内置的校验规则
              message:'必填项'   //覆盖组件自定义的错误提示
            },
            {
              reg: /^0$|^[1-9]\d*$/,  //自定义校验规则
              message: '只能输入自然数'
            }
          ]
        },
        name: {
          rule: [
            {
              name:'required',
              message:'必填项'
            },
            {
              name: 'positiveInteger'  //使用组件内置的校验规则，同时使用组件内置的错误提示
            },
            {
              reg: /^0$|^[1-9]\d*$/,
              message: '只能输入自然数'
            }
          ]
        }
      }
    }
  },
  methods: {
    //校验整个表单
    submitForm(){
      console.log(this.validateForm('test_validate'));
    }
  }
}
</script>


