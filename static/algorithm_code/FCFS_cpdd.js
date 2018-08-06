'use strict'

/*TEST START*/
var i = 0;
var initial_position = 100;
var input = [55, 58, 39, 18, 90, 160, 150, 38, 184];
for (i=0; i<20; i++)
{
    console.log(FCFS(input, input.length, initial_position, i));
}
/*TEST FINISH*/

function FCFS(input, list_size, initial_position, clickFrequency)
{
    var i, k;
    var position = initial_position;
    var total_moving = 0;
    var moving_distance = 0;
    var sort_list = [];
    var running_log = [];
    sort_list = input.slice(0);
    sort_list.sort(function sortNumber(a,b){return a - b});
    
    var show_list = [];
    for (var item of input)
    {
        show_list.push([item, true])
    }

    running_log.push({
        showListName: '输入的磁道号序列',
        showList: JSON.parse(JSON.stringify(show_list)),
        sortList: sort_list.slice(0),
        nextPosition: '',
        movingDistance: '',
        averageTime: ''
    });

    for (i=0; i<list_size; i++)
    {
        moving_distance = Math.abs(input[i]-position);
        total_moving += moving_distance;
        position = input[i];
        // 修改show_list中的值
        for (k=0; k<show_list.length; k++)
        {
            if (show_list[k][0] == position)
            {
                show_list[k][1] = false;
                break;
            }
        }

        running_log.push({
            showListName: '输入的磁道号序列',
            showList: JSON.parse(JSON.stringify(show_list)),
            sortList: sort_list.slice(0),
            nextPosition: position,
            movingDistance: moving_distance,
            averageTime: ''
        });
    }
    running_log[list_size].averageTime = parseFloat((total_moving/list_size).toFixed(2));
    
    //根据clickFrequency返回运行结果
    if (clickFrequency <= running_log.length-1)
    {
        return running_log[clickFrequency]
    }
    else
    {
        return false; //如果clickFrequency超出范围，则返回false
    }
}
