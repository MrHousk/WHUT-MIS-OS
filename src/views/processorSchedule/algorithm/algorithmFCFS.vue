<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">define</span> _CRT_SECURE_NO_WARNINGS <span class="hljs-comment">//去掉vs安全检查</span></span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;limits.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;string.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;time.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdbool.h&gt;</span>

  <span class="hljs-keyword">struct</span> data<span class="hljs-comment">//每一个对象所包含的元素</span>
  {
    <span class="hljs-keyword">float</span> startTime;
    <span class="hljs-keyword">float</span> finishTime;
    <span class="hljs-keyword">float</span> turnOverTime;
    <span class="hljs-keyword">float</span> weightedTurnOverTime;
  };

  <span class="hljs-keyword">struct</span>  fcfsdata
  {
    <span class="hljs-keyword">struct</span> data* formatResult;
    <span class="hljs-keyword">float</span> averageTurnOverTime;
    <span class="hljs-keyword">float</span> averageweightedTurnOverTime;
    <span class="hljs-comment">//int operateTashNum;</span>
  };
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">fillTable</span><span class="hljs-params">(<span class="hljs-keyword">int</span> clickFrequency, <span class="hljs-keyword">int</span> task_num, <span class="hljs-keyword">float</span>* commit_time, <span class="hljs-keyword">float</span>* task_time, <span class="hljs-keyword">struct</span>  fcfsdata* fcfsObject, <span class="hljs-keyword">int</span>* operator_order)</span></span>;
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
    <span class="hljs-keyword">int</span> task_num = <span class="hljs-number">10</span>, task_time_max = <span class="hljs-number">10</span>;
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, j = <span class="hljs-number">0</span>, fill = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">float</span>* task_time = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);<span class="hljs-comment">//随机分配每个作业运行需要的时间</span>
    <span class="hljs-keyword">float</span>* commit_time = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);<span class="hljs-comment">//提交时间</span>
    <span class="hljs-keyword">int</span>* operator_order = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);<span class="hljs-comment">//结果</span>
    <span class="hljs-keyword">struct</span> data* Objects = (<span class="hljs-keyword">struct</span> data*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">struct</span> data)*task_num);
    <span class="hljs-keyword">struct</span>  fcfsdata* fcfsObject = (<span class="hljs-keyword">struct</span>  fcfsdata*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">struct</span>  fcfsdata));
    fcfsObject-&gt;formatResult = Objects;
    srand(time(NULL));
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
    {
      task_time[i] = rand() % task_time_max * <span class="hljs-number">2</span> + <span class="hljs-number">2</span>;
      commit_time[i] = rand() % task_time_max + <span class="hljs-number">2</span>;
    }

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num+<span class="hljs-number">1</span>; i++)
    {
      fillTable(i, task_num, commit_time, task_time, fcfsObject, operator_order);
      printf_s(<span class="hljs-string">"作业\t提交时间\t运行时间\t开始时间\t完成时间\t周转时间\t带权周转时间\n"</span>);
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; task_num; j++)
      {
        <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%d  \t%.2f  \t\t%.2f  \t\t"</span>, j, commit_time[j], task_time[j]);
        fill = <span class="hljs-number">0</span>;
        <span class="hljs-keyword">for</span> (fill = <span class="hljs-number">0</span>; fill &lt; i; fill++)
        {
          <span class="hljs-keyword">if</span> (j == operator_order[fill])
          {
            printf_s(<span class="hljs-string">"%.2f \t\t%.2f\t\t %.2f\t\t %.2f\t\n"</span>, fcfsObject-&gt;formatResult[operator_order[fill]].startTime, fcfsObject-&gt;formatResult[operator_order[fill]].finishTime, fcfsObject-&gt;formatResult[operator_order[fill]].turnOverTime, fcfsObject-&gt;formatResult[operator_order[fill]].weightedTurnOverTime);
            <span class="hljs-keyword">break</span>;
          }
        }
        <span class="hljs-keyword">if</span> (fill == i)
          printf_s(<span class="hljs-string">"\n"</span>);

      }
    }
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"平均周转时间:%.2f\n"</span>, fcfsObject-&gt;averageTurnOverTime);
    <span class="hljs-built_in">printf</span>(<span class="hljs-string">"平均带权周转时间:%.2f\n"</span>, fcfsObject-&gt;averageweightedTurnOverTime);
    system(<span class="hljs-string">"pause"</span>);
  }
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">fillTable</span><span class="hljs-params">(<span class="hljs-keyword">int</span> clickFrequency, <span class="hljs-keyword">int</span> task_num, <span class="hljs-keyword">float</span>* commit_time, <span class="hljs-keyword">float</span>* task_time, <span class="hljs-keyword">struct</span>  fcfsdata* fcfsObject,<span class="hljs-keyword">int</span>* operator_order)</span>
  </span>{
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, j = <span class="hljs-number">0</span>, k = <span class="hljs-number">0</span>, pos = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">float</span> temp;
    <span class="hljs-keyword">float</span>* temp_commit_time = (<span class="hljs-keyword">float</span>*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">float</span>)*task_num);

    <span class="hljs-keyword">struct</span> data* format_result = (<span class="hljs-keyword">struct</span> data*)<span class="hljs-built_in">malloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">struct</span> data)*task_num);

    <span class="hljs-keyword">if</span> (clickFrequency == <span class="hljs-number">0</span>)
    {
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
      {
        fcfsObject-&gt;formatResult[i].finishTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].startTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].turnOverTime = -<span class="hljs-number">1</span>;
        fcfsObject-&gt;formatResult[i].weightedTurnOverTime = -<span class="hljs-number">1</span>;
      }
      <span class="hljs-keyword">return</span>;
    }
    <span class="hljs-keyword">else</span>
    {
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
      {
        format_result[i].finishTime = <span class="hljs-number">0</span>;
        format_result[i].startTime = <span class="hljs-number">0</span>;
        format_result[i].turnOverTime = <span class="hljs-number">0</span>;
        format_result[i].weightedTurnOverTime = <span class="hljs-number">0</span>;
      }
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; task_num; i++)
      {
        temp_commit_time[i] = commit_time[i];
        operator_order[i] = <span class="hljs-number">0</span>;
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
        operator_order[i] = pos;

      }
      <span class="hljs-keyword">if</span> (clickFrequency == <span class="hljs-number">1</span>)
      {
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].startTime = commit_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].finishTime = commit_time[operator_order[<span class="hljs-number">0</span>]] + task_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].turnOverTime = task_time[operator_order[<span class="hljs-number">0</span>]];
        fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].weightedTurnOverTime = fcfsObject-&gt;formatResult[operator_order[<span class="hljs-number">0</span>]].turnOverTime / task_time[operator_order[<span class="hljs-number">0</span>]];
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
      <span class="hljs-built_in">free</span>(temp_commit_time);
      <span class="hljs-built_in">free</span>(format_result);
    }

    <span class="hljs-keyword">return</span>;
  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
