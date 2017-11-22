

//  目前的不足很多,挑其中的几点说一下 :
//  1. 共用全局变量，双向数据流的问题
//  2. ....


var  _mvvmFn =function() {

    //  目前还不支持 数组等对象的 引入,目前只考虑 v-model指令元素
    var elems = document.querySelectorAll("[v-model=value]"), bValue=data.value;   // 通信桥梁,   后期进一步演变成  订阅者;

    if(elems.length === 0) return


// 在这里定义一系列的方法，目前只是最简单的  v-model里的简单值的变化
    var command = {
        model: function (str) {
            var tag_name = this.tagName.toLowerCase();
            (tag_name === "input" || tag_name === "textarea" || tag_name === "select") ? (this.value = str) : (this.innerHTML = str)
        },
    };

// 扫描整个 v-modle 队列 ，再扫描该元素的属性队列，查找包含关键字的属性
// 如果该元素包含关键字属性，对其应用 预先定义好的方法
    function scan() {
        for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elems[i];
            for (var j = 0, len1 = elem.attributes.length; j < len1; j++) {
                var attr = elem.attributes[j];
                attr.nodeName.indexOf('v-') >= 0 && command[attr.nodeName.slice(2)].call(elem, data[attr.nodeValue])
            }
        }
    }


    scan();   // 执行扫描
    defineGetAndSet(data, 'value');   // 监听公共变量data的变化


   function defineGetAndSet(obj, propName) {            // 监听变化的函数
       console.log(22)
       console.log(obj,propName)
        Object.defineProperty(obj, propName, {
            get: function () {
                return bValue;
            },
            set: function (newValue) {
                bValue = newValue;
                scan();
            },
            enumerable: true,
            configurable: true
        });
    }


    var len = elems.length, i = 0    // 监听 关键词队列内的 输入事件
    for (i; i < len; i++) {
        var ele_tag_name = elems[i].tagName.toLowerCase();
        (ele_tag_name === "input" || ele_tag_name === "textarea" || ele_tag_name === "select")
        && elems[i].addEventListener('keyup', function (e) {
            data.value = e.target.value;     //更新 data
        }, false);
    }

}




// 模板解析引擎
function _fn (template, data) {
    var re = /{{(.+?)}}/g;
    while((match = re.exec(template))!==null) {
        if(match[1]){
            template = template.replace(match[0], data[match[1]])
        }else{
            template = template.replace(match[0], '')
        }
    }
    return template
}

//模板注入引擎


