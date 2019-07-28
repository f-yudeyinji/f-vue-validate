import Default_rules from './default_rules.js'; //组件内部定义的默认的校验规则

const VALIDATE_ERRORS = {}; //存放错误信息

//在当前元素后面插入元素
function insertAfter(el, new_el) {
    let parent_el = el.parentNode;

    if (parent_el.lastChild == el) {
        parent_el.appendChild(new_el);
    } else {
        parent_el.insertBefore(new_el, el.nextSibling);
    }
}

//展示错误信息
function showError(el, error) {
    let next_el = el.nextSibling;

    next_el.lastChild.innerText = error;
    next_el.classList.remove('hide');
    next_el.classList.add('show');
}

//获取错误信息插入的前面一个元素
function getInsertBeforeDom(el) {
    let error_position = el.dataset.errorPosition ? el.dataset.errorPosition : 'after',
        insert_before_dom = null;

    switch (error_position) {
        case 'after': //当前元素后面
            insert_before_dom = el;
            break;
        case 'parent_after': //当前元素的父级元素的后面
            insert_before_dom = el.parentNode;
            break;
        case 'parent_parent_after': //当前元素的父级的父级的后面
            insert_before_dom = el.parentNode.parentNode;
            break;
    }

    return insert_before_dom;
}

//将错误信息存入VALIDATE_ERRORS中
function storageErrorInfo(is_has_error,insert_before_dom,name,index){
    if (!is_has_error) {
        let class_list = insert_before_dom.nextSibling.classList;

        if (Array.from(class_list).includes('show')) {
            class_list.remove('show');
            class_list.add('hide');
        }

        VALIDATE_ERRORS[`is_${name}_${index}_has_error`] = false;
    } else {
        VALIDATE_ERRORS[`is_${name}_${index}_has_error`] = true;
    }
}

//校验单个元素
function validateSingle(el, rules, index) {
    let validate_rules = rules.rule ? rules.rule : [],
        val = el.value,
        val_trim = val.trim(),
        is_has_error = false,
        name = el.getAttribute('name'),
        insert_before_dom = getInsertBeforeDom(el);

    //视图中设置了必填校验
    if (el.dataset.required == 'true') {
        if (!val_trim) {
            showError(insert_before_dom, '不能为空!');
            is_has_error = true;
            storageErrorInfo(is_has_error,insert_before_dom,name,index);

            return false;
        }
    }

    for (let i = 0, len = validate_rules.length; i < len; i++) {
        //默认校验规则
        if (validate_rules[i].hasOwnProperty('name')) {
            if (validate_rules[i].name == 'required') {
                if (!val_trim) {
                    if (validate_rules[i].message) {
                        showError(insert_before_dom, validate_rules[i].message);
                    } else {
                        showError(insert_before_dom, '不能为空!');
                    }

                    is_has_error = true;
                    break;
                }
            } else {
                if (val_trim && !Default_rules[validate_rules[i].name].rule.test(val)) {
                    if (validate_rules[i].message) {
                        showError(insert_before_dom, validate_rules[i].message);
                    } else {
                        showError(insert_before_dom, Default_rules[validate_rules[i].name].message);
                    }
                    is_has_error = true;
                    break;
                }
            }
        } else {
            //自定义的校验规则
            if (val_trim && !validate_rules[i].reg.test(val)) {
                showError(insert_before_dom, validate_rules[i].message);
                is_has_error = true;
                break;
            }
        }
    }

    storageErrorInfo(is_has_error,insert_before_dom,name,index);
}

const Validate = {
    install(Vue, options) {
        Vue.directive('validate', {
            inserted: (el, binding, vnode) => {
                let trigger = ['change'], //指定默认的触发校验的方式
                    user_defined_trigger = el.dataset.trigger; //用户自定义的触发校验的方式

                if (user_defined_trigger) {
                    trigger = user_defined_trigger.split('|');
                }

                //设置错误信息的展示
                let new_el = document.createElement('p');

                new_el.setAttribute('class', 'form-error-info hide');
                new_el.innerHTML = `<i class="warning-icon"></i><span class="js-error-message"></span>`;

                let insert_before_dom = getInsertBeforeDom(el);

                insertAfter(insert_before_dom, new_el);

                let rules = binding.value ? binding.value : [],
                    el_list = document.getElementsByName(el.getAttribute('name')),
                    index = Array.from(el_list).indexOf(el);

                //监听触发校验的事件
                trigger.forEach(item => {
                    el.addEventListener(item, () => {
                        validateSingle(el, rules, index);
                    });
                });
            }
        });

        Vue.mixin({
            methods: {
                //根据name校验单个表单元素
                validateItem(name, rules = {}, index) {
                    //如果传了index，则只校验当前下标的元素
                    if (index !== undefined) {
                        let element = document.getElementsByName(name)[index];

                        validateSingle(element, rules, index);
                        //校验通过返回true,不通过返回false
                        return !VALIDATE_ERRORS[`is_${name}_${index}_has_error`];
                    } else {
                        //未传下标，则校验当前name匹配到的所有的元素
                        let elements = document.getElementsByName(name),
                            is_has_error = false;

                        elements.forEach((item, index) => {
                            validateSingle(item, rules, index);
                            is_has_error = is_has_error || VALIDATE_ERRORS[`is_${name}_${index}_has_error`];
                        });

                        return !is_has_error;
                    }
                },
                //校验指定的多个name对应的元素
                validateGroup(validate_arr) {
                    let is_has_error = false;

                    validate_arr.forEach(item => {
                        let elements = document.getElementsByName(item.name);

                        elements.forEach((element, index) => {
                            validateSingle(element, item.rules, index);
                            is_has_error = is_has_error || VALIDATE_ERRORS[`is_${item.name}_${index}_has_error`];
                        });
                    });
                    return !is_has_error;
                },

                //校验指定ID的表单，如果未指定则校验所以class包含'js-validate'的元素
                validateForm(form_id) {
                    let current_form = document.getElementById(form_id),
                        elements = [];

                    if (current_form) {
                        elements = current_form.getElementsByClassName('js-validate');
                    } else {
                        elements = document.getElementsByClassName('js-validate');
                    }

                    let event_object = document.createEvent('HTMLEvents');

                    event_object.initEvent('change', false, true);

                    for (let element of elements) {
                        element.focus();
                        element.dispatchEvent(event_object);
                    }

                    let is_has_error = false;

                    for (let key in VALIDATE_ERRORS) {
                        is_has_error = is_has_error || VALIDATE_ERRORS[key];
                    }

                    return !is_has_error;
                }
            }
        });
    }
};

export default Validate;
