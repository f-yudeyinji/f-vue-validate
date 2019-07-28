let default_rules = {
    required: {
        message: '不能为空！'
    },
    positiveInteger: {
        rule: /^[1-9]\d*$/, //正整数
        message: '只能输入正整数！'
    },
    naturalNumber: {
        rule: /^0$|^[1-9]\d*$/, //自然数
        message: '只能输入自然数！'
    },
    towDecimalNumber: {
        rule: /(^[1-9](\d+)?(\.\d{1,2})?$)|0|(^\d\.\d{1,2}?$)/, //最多两位小数的数字
        message: '只能输入数字，最多两位小数!'
    },
    url: {
        rule: /[a-zA-Z]+:\/\/[^\s]*/, //链接
        message: '请输入正确的链接！'
    },
    identityCard: {
        rule: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/, //身份证号码
        message: '请输入正确的身份证号码！'
    },
    telephoneNumber: {
        rule: /^1[34578]\d{9}$/, //手机号码
        message: '请输入正确的手机号码！'
    },
    email:{
        rule:/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, //邮箱
        message:'请输入正确的邮箱！'
    }
};

export default default_rules;
