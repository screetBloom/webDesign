// var user = new User( 'value' );
/*
*    1.  uid = 'value'
*    2.  var binder = new  DataBinder('value')
*
* */

// user.set( "name", "Wolfgang" );

function User(uid) {
    var binder = new DataBinder(uid),
        user = {
            attributes: {},
            set: function (attr_name, val) {
                this.attributes[attr_name] = val;
                binder.publish(uid + ":change", attr_name, val, this);
            },
            get: function (attr_name) {
                return this.attributes[attr_name];
            },
            _binder: binder
        };
    binder.on(uid + ":change", function (evt, attr_name, new_val, initiator) {
        if (initiator !== user) {
            user.set(attr_name, new_val);
        }
    });
    return user;
}


function DataBinder(object_id) {
    var pubSub = {
            callbacks: {},
            on: function (msg, callback) {        // 这里的this是 pubSub
                this.callbacks[msg] = this.callbacks[msg] || [];
                this.callbacks[msg].push(callback);
            },
            publish: function (msg) {            // 这里的this是 pubSub
                this.callbacks[msg] = this.callbacks[msg] || []
                // console.log(11111)
                // console.log(this.callbacks[ msg ].length)
                for (var i = 0, len = this.callbacks[msg].length; i < len; i++) {
                    // console.log(arguments)
                    this.callbacks[msg][i].apply(this, arguments);
                }
            }
        },
        data_attr = "v-" + object_id,  // 绑定前缀  这里是  v-model
        message = object_id + ":change",  // 相互之间传递的消息,这里是  model:change
        changeHandler = function (evt) {
            var target = evt.target || evt.srcElement,   // 获取触发事件对象，兼容IE
                prop_name = target.getAttribute(data_attr);  // 获取关键词的value(这里是'data') , v-model = 'data'
            if (prop_name && prop_name !== "") {
                pubSub.publish(message, prop_name, target.value);  // pubSub.publish('model:change','data', target.value );
                // 为pubSub添加名为 'value:change' 的回调
            }
        };
    if (document.addEventListener) {
        // 给  document对象(input、textarea、select)绑定  change  事件，触发  changeHandler  事件
        document.addEventListener("change", changeHandler, false);
    } else {
        // 监听事件兼容    IE
        document.attachEvent("onchange", changeHandler);
    }

    // 获得所有的 具有 关键字的 元素 ，判断类型
    // 如果元素是  input、textarea、select 其中之一, 设置 value为 set的参数
    // 否则，设置其  innerhtml  为 set的参数
    pubSub.on(message, function (evt, prop_name, new_val) {
        console.log(document.querySelectorAll('[v-model=data]'))
        var elements = document.querySelectorAll("[" + data_attr + "=" + prop_name + "]"),  //[bind-value=name]
            tag_name;
        for (var i = 0, len = elements.length; i < len; i++) {
            tag_name = elements[i].tagName.toLowerCase();
            if (tag_name === "input" || tag_name === "textarea" || tag_name === "select") {
                elements[i].value = new_val;
            } else {
                elements[i].innerHTML = new_val;
            }
        }
    });
    return pubSub;
}




