'use strict'

/*TEST START*/
var i = 0;
var initial_position = 100;
var input = [55, 58, 39, 18, 90, 160, 150, 38, 184];
for (i=0; i<20; i++)
{
    console.log(SSTF(input, input.length, initial_position, i));
}
/*TEST FINISH*/

function SSTF(input, list_size, initial_position, clickFrequency)
{
    var i, j, k;
    var position = initial_position;
    var total_moving = 0;
    var moving_distance = 0;
    var sort_list = [];
    var sort_list_cp = [];
    var running_log = [];
    sort_list = input.slice(0);
    sort_list.sort(function sortNumber(a,b){return a - b});
    sort_list_cp = sort_list.slice(0);

    var show_list = [];
    for (var item of sort_list)
    {
        show_list.push([item, true])
    }

    running_log.push({
        showListName: '排序后的磁道号序列',
        showList: JSON.parse(JSON.stringify(show_list)),
        sortList: sort_list.slice(0),
        nextPosition: '',
        movingDistance: '',
        averageTime: ''
    });

    for (i=0; i<list_size; i++)
    {
        j = 0;
        for (j=0; j<sort_list_cp.length; j++)
        {
            if (sort_list_cp[j] >= position)
            {
                if (j >= 1)
                {
                    if (Math.abs(sort_list_cp[j] - position) <= Math.abs(sort_list_cp[j-1] - position))
                    {
                        moving_distance = Math.abs(sort_list_cp[j]-position);
                        total_moving += moving_distance;
                        position = sort_list_cp[j];
                        sort_list_cp.splice(j, 1);
                        break;
                    }
                    else
                    {
                        moving_distance = Math.abs(sort_list_cp[j-1]-position);
                        total_moving += moving_distance;
                        position = sort_list_cp[j-1];
                        sort_list_cp.splice(j-1, 1);
                        break;
                    }
                }
                else
                {
                    moving_distance = Math.abs(sort_list_cp[j]-position);
                    total_moving += moving_distance;
                    position = sort_list_cp[j];
                    sort_list_cp.splice(j, 1);
                    break;
                }
            }
            else if ((j+1) == sort_list_cp.length)
            {
                moving_distance = Math.abs(sort_list_cp[j]-position);
                total_moving += moving_distance;
                position = sort_list_cp[j];
                sort_list_cp.splice(j, 1);
                break;
            }
        }
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
            showListName: '排序后的磁道号序列',
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