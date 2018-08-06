'use strict'

var length = 5; //内存页面最大长度
var resource = []; //分配空间
var i = 0;

for (i = 0; i < length + 3; i++) {
    resource.push(-1); //初始化为-1，表示空
}
resource[2] = 3; //下一次替换的位置初始化为3:

//------------------测试----------------------
var list = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
var j = 0;
for (i = 0; i < 20; i++) {
    for (var x of FIFO_PageReplacement(resource, length, list[i])) {
        // console.log(x); // 依次输出当前运行情况对应的C代码的行号
    }
    console.log(resource);
}

function* FIFO_PageReplacement(resource, length, page_num) //length为内存能容纳的最大长度，page_num为请求的页面
    {
        yield 36;
        var i = 0;
        for (i = 3; i < length + 3; i++) //判断请求的页面在已分配的页面中是否已经存在，若存在，则直接返回
        {
            yield 51;
            if (resource[i] == page_num) {
                yield 53;
                resource[0] = 0; //如果请求的页面在内存中，则不需要添加新的页面
                yield 54;
                resource[1] = i; //请求的页面在编号为i的位置
                yield 55;
                return;
            }

        }
        //执行到这里表示请求的页面没有在已分配的页面中,把请求的页面放到替换的位置
        yield 60;
        resource[1] = (resource[2] - 3) % length + 3;
        yield 61;
        resource[resource[1]] = page_num;
        yield 62;
        resource[2] += 1;
        yield 63;
        resource[0] = 1; //1表示需要添加新的进程
    }