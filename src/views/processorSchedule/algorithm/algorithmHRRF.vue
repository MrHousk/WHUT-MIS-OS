<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">define</span> _CRT_SECURE_NO_WARNINGS <span class="hljs-comment">//去掉vs安全检查</span></span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;limits.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;string.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;time.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdbool.h&gt;</span>

  <span class="hljs-keyword">struct</span> data<span class="hljs-comment">//结构体，存储每个任务的相关信息</span>
  {
    <span class="hljs-keyword">float</span> startTime;
    <span class="hljs-keyword">float</span> finishTime;
    <span class="hljs-keyword">float</span> turnOverTime;
    <span class="hljs-keyword">float</span> weightedTurnOverTime;
    <span class="hljs-keyword">float</span> responseRatio;
  };

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// 此代码运行环境 Visual Studio 2017</span>
  <span class="hljs-comment">// "#define _CRT_SECURE_NO_WARNINGS" 去掉VS安全检查</span>
  <span class="hljs-comment">// 为了简化输入逻辑，此代码默认进行加密操作</span>
  <span class="hljs-comment">// key为正字母向后移动，key为负向前移动，key值正负交替，即可模拟加密与解密过程</span>
  <span class="hljs-comment">// 请不要输入中文字符</span>
  <span class="hljs-comment">//------------------------------//</span>

  <span class="hljs-comment">// 结构体，存储每一个结构的相关信息</span>
  <span class="hljs-keyword">struct</span>  fcfsdata
  {
    <span class="hljs-keyword">struct</span> data* formatResult;
    <span class="hljs-keyword">float</span> averageTurnOverTime;
    <span class="hljs-keyword">float</span> averageweightedTurnOverTime;
    <span class="hljs-comment">//int operateTashNum;</span>
  };

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">fillTable</span><span class="hljs-params">(<span class="hljs-keyword">int</span> clickFrequency, <span class="hljs-keyword">int</span> task_num, <span class="hljs-keyword">float</span>* commit_time, <span class="hljs-keyword">float</span>* task_time, <span class="hljs-keyword">struct</span>  fcfsdata* fcfsObject, <span class="hljs-keyword">int</span>* operator_order, <span class="hljs-keyword">int</span>* operate_order_temp)</span></span>;
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
    <span class="hljs-keyword">int</span> task_num = <span class="hljs-number">10</span>, task_time_max = <span class="hljs-number">10</span>;
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, j = <span class="hljs-number">0</span>, t = <span class="hljs-number">0</span>, fill = <span class="hljs-number">0</span>, response_num = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">float</span>* task_time = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);<span class="hljs-comment">//随机分配每个作业运行需要的时间</span>
    <span class="hljs-keyword">float</span>* commit_time = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);<span class="hljs-comment">//提交时间</span>
    <span class="hljs-keyword">int</span>* operator_order = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);<span class="hljs-comment">//结果</span>
    <span class="hljs-keyword">int</span>* operate_order_temp = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>)*task_num);
    <span class="hljs-keyword">struct</span> data* Objects = (<span class="hljs-keyword">struct</span> data*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">struct</span> data)*task_num);
    <span class="hljs-keyword">struct</span>  fcfsdata* fcfsObject = (<span class="hljs-keyword">struct</span>  fcfsdata*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">struct</span>  fcfsdata));
    fcfsObject-&gt;formatResult = Objects;
    srand(time(NULL));
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
    {
      task_time[i] = rand() % task_time_max * <span class="hljs-number">2</span> + <span class="hljs-number">2</span>;
      commit_time[i] = rand() % task_time_max * <span class="hljs-number">5</span> + <span class="hljs-number">2</span>;
    }

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num+<span class="hljs-number">1</span>; i++)
    {
      response_num = fillTable(i, task_num, commit_time, task_time, fcfsObject, operator_order,operate_order_temp);
      printf_s(<span class="hljs-string">"作业\t提交时间\t运行时间\t开始时间\t完成时间\t周转时间\t带权周转时间\t响应比\n"</span>);
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; task_num; j++)
      {
        <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%d  \t%.2f  \t\t%.2f  \t\t"</span>, j, commit_time[j], task_time[j]);
        <span class="hljs-keyword">for</span> (fill = <span class="hljs-number">0</span>; fill &lt; i; fill++)
        {
          <span class="hljs-keyword">if</span> (j == operator_order[fill])
          {
            printf_s(<span class="hljs-string">"%.2f \t\t%.2f\t\t %.2f\t\t %.2f\t\t%.2f"</span>, fcfsObject-&gt;formatResult[operator_order[fill]].startTime, fcfsObject-&gt;formatResult[operator_order[fill]].finishTime, fcfsObject-&gt;formatResult[operator_order[fill]].turnOverTime, fcfsObject-&gt;formatResult[operator_order[fill]].weightedTurnOverTime, fcfsObject-&gt;formatResult[operator_order[fill]].responseRatio);
            <span class="hljs-keyword">break</span>;
          }
        }
        <span class="hljs-keyword">if</span> (fill == i&amp;&amp;fill!=<span class="hljs-number">0</span>&amp;&amp;i!=<span class="hljs-number">1</span>)
        {
          <span class="hljs-keyword">for</span> (t = <span class="hljs-number">0</span>; t &lt; response_num; t++)
          {
            <span class="hljs-keyword">if</span> (j == operate_order_temp[t])
            {
              printf_s(<span class="hljs-string">"\t\t\t\t\t\t\t\t%.2f"</span>,fcfsObject-&gt;formatResult[j].responseRatio);
              <span class="hljs-keyword">break</span>;
            }

          }
        }
        printf_s(<span class="hljs-string">"\n"</span>);
      }
    }
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"平均周转时间:%.2f\n"</span>, fcfsObject-&gt;averageTurnOverTime);
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"平均带权周转时间:%.2f\n"</span>, fcfsObject-&gt;averageweightedTurnOverTime);
    system(<span class="hljs-string">"pause"</span>);
  }
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// int clickFrequency: 调用的次数</span>
  <span class="hljs-comment">// int task：每次执行的任务调度编号</span>
  <span class="hljs-comment">// float* commit_time：作业的提交时间</span>
  <span class="hljs-comment">// float* task_time：作业需要的运行时间</span>
  <span class="hljs-comment">// struct  fcfsdata* fcfsObject：结构体，存储每个任务的相关信息</span>
  <span class="hljs-comment">// int* operator_order：作业的运行顺序</span>
  <span class="hljs-comment">// int* operate_order_temp:对作业按照时间顺序排序</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">fillTable</span><span class="hljs-params">(<span class="hljs-keyword">int</span> clickFrequency, <span class="hljs-keyword">int</span> task_num, <span class="hljs-keyword">float</span>* commit_time, <span class="hljs-keyword">float</span>* task_time, <span class="hljs-keyword">struct</span>  fcfsdata* fcfsObject,<span class="hljs-keyword">int</span>* operator_order, <span class="hljs-keyword">int</span>* operate_order_temp)</span>
  </span>{
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, j = <span class="hljs-number">0</span>, k = <span class="hljs-number">0</span>, pos = <span class="hljs-number">0</span>, max_range = <span class="hljs-number">0</span>, flag = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">float</span>  temp = <span class="hljs-number">0</span>,total_operate_time = <span class="hljs-number">0</span>, time_one = <span class="hljs-number">0</span>, time_two = <span class="hljs-number">0</span>, max = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">float</span>* temp_commit_time = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);
    <span class="hljs-keyword">float</span>* response_ratio = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);
    <span class="hljs-keyword">float</span>* response_ratio_to_fill = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);
    <span class="hljs-keyword">int</span>* need_operate = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>)*task_num);

    <span class="hljs-keyword">if</span> (clickFrequency == <span class="hljs-number">0</span>)
    {
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
      {
        fcfsObject-&gt;formatResult[i].finishTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].startTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].turnOverTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].weightedTurnOverTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].responseRatio = -<span class="hljs-number">1</span>;
      }
      <span class="hljs-built_in">free</span>(temp_commit_time);
      <span class="hljs-built_in">free</span>(need_operate);
      <span class="hljs-built_in">free</span>(response_ratio);
      <span class="hljs-built_in">free</span>(response_ratio_to_fill);
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
    }
    <span class="hljs-keyword">else</span>
    {	
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
      {
        temp_commit_time[i] = commit_time[i];
        operate_order_temp[i] = <span class="hljs-number">0</span>;
        operator_order[i] = <span class="hljs-number">0</span>;
        need_operate[i] = <span class="hljs-number">0</span>;
        response_ratio[i] = <span class="hljs-number">0</span>;
        response_ratio_to_fill[i] = <span class="hljs-number">0</span>;
      }
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
      {
        temp = (<span class="hljs-keyword">float</span>)INT_MAX;
        <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; task_num; j++)
        {
          <span class="hljs-keyword">if</span> (temp &gt; temp_commit_time[j])
          {
            temp = temp_commit_time[j];
            pos = j;
          }
        }
        temp_commit_time[pos] = (<span class="hljs-keyword">float</span>)INT_MAX;
        operate_order_temp[i] = pos;
      }
      operator_order[<span class="hljs-number">0</span>] = operate_order_temp[<span class="hljs-number">0</span>];
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">1</span>; i &lt; task_num; i++)
      {
        time_one = total_operate_time + task_time[operator_order[i - <span class="hljs-number">1</span>]];
        time_two = commit_time[operator_order[i - <span class="hljs-number">1</span>]] + task_time[operator_order[i - <span class="hljs-number">1</span>]];
        total_operate_time = time_one &lt; time_two ? time_two : time_one;
        max_range = <span class="hljs-number">0</span>;
        <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; task_num; j++)
        {
          <span class="hljs-keyword">if</span> (commit_time[operate_order_temp[j]] &lt;= total_operate_time)
            max_range++;
          <span class="hljs-keyword">else</span>
          {
            <span class="hljs-keyword">break</span>;
          }
        }
        <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; max_range; j++)
        {
          <span class="hljs-keyword">if</span> (need_operate[j] == -<span class="hljs-number">1</span>)
            <span class="hljs-keyword">continue</span>;
          <span class="hljs-keyword">else</span>
            response_ratio[j] = <span class="hljs-number">1</span> + total_operate_time - commit_time[operate_order_temp[j]] / task_time[operate_order_temp[j]];
        }
        max = (<span class="hljs-keyword">float</span>)INT_MIN;
        <span class="hljs-keyword">for</span> (j = <span class="hljs-number">1</span>; j &lt; max_range; j++)
        {
          <span class="hljs-keyword">if</span> (need_operate[j] == -<span class="hljs-number">1</span>)
            <span class="hljs-keyword">continue</span>;
          <span class="hljs-keyword">if</span> (max &lt; response_ratio[j])
          {
            max = response_ratio[j];
            pos = j;
            flag = <span class="hljs-number">1</span>;
          }
        }
        <span class="hljs-keyword">if</span> (flag == <span class="hljs-number">0</span>)
        {
          operator_order[i] = operate_order_temp[max_range];
          need_operate[max_range] = -<span class="hljs-number">1</span>;
          total_operate_time = commit_time[operator_order[i]];

          response_ratio[max_range] = <span class="hljs-number">1</span>;
          fcfsObject-&gt;formatResult[operator_order[i]].responseRatio = <span class="hljs-number">1</span>;
        }
        <span class="hljs-keyword">else</span>
        {
          operator_order[i] = operate_order_temp[pos];
          need_operate[pos] = -<span class="hljs-number">1</span>;
        }
        flag = <span class="hljs-number">0</span>;
        <span class="hljs-keyword">if</span> (i + <span class="hljs-number">1</span> == clickFrequency)
        {
          <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j&lt;max_range; j++)
          {
            response_ratio_to_fill[j] = response_ratio[j];
          }
          temp = (<span class="hljs-keyword">float</span>)max_range;
        }
      }
      <span class="hljs-keyword">if</span> (clickFrequency == <span class="hljs-number">1</span>)
      {
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].startTime = commit_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].finishTime = commit_time[operator_order[<span class="hljs-number">0</span>]] + task_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].turnOverTime = task_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].weightedTurnOverTime = fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].turnOverTime / task_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].responseRatio = <span class="hljs-number">1</span>;
        <span class="hljs-keyword">return</span>;
      }
      <span class="hljs-keyword">else</span>
      {
        k = clickFrequency &lt;= task_num ? clickFrequency : task_num;
        fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].startTime = fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">2</span>]].finishTime;
        <span class="hljs-keyword">if</span> (fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].startTime &lt; commit_time[operator_order[k - <span class="hljs-number">1</span>]])
        {
          fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].startTime = commit_time[operator_order[k - <span class="hljs-number">1</span>]];
        }
        fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].finishTime = fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].startTime + task_time[operator_order[k - <span class="hljs-number">1</span>]];
        fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].turnOverTime = fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].finishTime - commit_time[operator_order[k - <span class="hljs-number">1</span>]];
        fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].weightedTurnOverTime = fcfsObject-&gt;formatResult[operator_order[k - <span class="hljs-number">1</span>]].turnOverTime / task_time[operator_order[k - <span class="hljs-number">1</span>]];
        <span class="hljs-keyword">for</span> (i = <span class="hljs-number">1</span>; i &lt; (<span class="hljs-keyword">int</span>)temp; i++)
        {
          fcfsObject-&gt;formatResult[operate_order_temp[i]].responseRatio = response_ratio_to_fill[i];
        }
      }

      <span class="hljs-keyword">if</span> (clickFrequency == task_num)
      {
        fcfsObject-&gt;averageTurnOverTime = <span class="hljs-number">0</span>;
        fcfsObject-&gt;averageweightedTurnOverTime = <span class="hljs-number">0</span>;
        <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
        {
          fcfsObject-&gt;averageTurnOverTime += fcfsObject-&gt;formatResult[i].turnOverTime;
          fcfsObject-&gt;averageweightedTurnOverTime += fcfsObject-&gt;formatResult[i].weightedTurnOverTime;
        }
        fcfsObject-&gt;averageTurnOverTime = fcfsObject-&gt;averageTurnOverTime / task_num;
        fcfsObject-&gt;averageweightedTurnOverTime = fcfsObject-&gt;averageweightedTurnOverTime / task_num;
      }
    }

    <span class="hljs-built_in">free</span>(temp_commit_time);
    <span class="hljs-built_in">free</span>(need_operate);
    <span class="hljs-built_in">free</span>(response_ratio);
    <span class="hljs-built_in">free</span>(response_ratio_to_fill);
    <span class="hljs-keyword">return</span> (<span class="hljs-keyword">int</span>)temp;
  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
