<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;malloc.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>

  <span class="hljs-keyword">struct</span> work
  {
      <span class="hljs-keyword">int</span> commit_time; <span class="hljs-comment">//作业提交时间</span>
      <span class="hljs-keyword">int</span> run_time; <span class="hljs-comment">//作业运行所需时间</span>
      <span class="hljs-keyword">int</span> remain_time; <span class="hljs-comment">//作业当前剩余时间（完成作业仍需要的时间）</span>
      <span class="hljs-keyword">int</span> start_time; <span class="hljs-comment">//作业运行开始时间（第一次开始）</span>
      <span class="hljs-keyword">int</span> finish_time; <span class="hljs-comment">//作业完成时间（该作业完成）</span>
      <span class="hljs-keyword">float</span> turnaround_time; <span class="hljs-comment">//周转时间</span>
      <span class="hljs-keyword">float</span> weighted_turnover_time; <span class="hljs-comment">//带权周转时间</span>
  }; <span class="hljs-comment">//每个结构体是一项作业（一条进程）</span>

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">RR</span><span class="hljs-params">(<span class="hljs-keyword">struct</span> work *wk, <span class="hljs-keyword">int</span> work_num, <span class="hljs-keyword">int</span> time_block, <span class="hljs-keyword">float</span> *average_turnaround_time, <span class="hljs-keyword">float</span> *average_weighted_turnover_time)</span></span>;

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> i;
      <span class="hljs-keyword">int</span> work_num = <span class="hljs-number">4</span>; <span class="hljs-comment">//作业数量设置为4个（可变）</span>
      <span class="hljs-keyword">int</span> time_block = <span class="hljs-number">1</span>; <span class="hljs-comment">//时间片大小，默认为1（可变）</span>
      <span class="hljs-keyword">struct</span> work *wk = (<span class="hljs-keyword">struct</span> work *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">struct</span> work), work_num);
      <span class="hljs-keyword">float</span> average_turnaround_time; <span class="hljs-comment">//平均周转时间</span>
      <span class="hljs-keyword">float</span> average_weighted_turnover_time; <span class="hljs-comment">//平均带权周转时间</span>
      <span class="hljs-comment">/*****测试开始*****/</span>
      srand((<span class="hljs-keyword">unsigned</span>)time(NULL)); <span class="hljs-comment">//初始化随机种子</span>
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"-----INIT-----\n"</span>);
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;work_num; i++)
      {
          wk[i].commit_time = rand() % <span class="hljs-number">10</span>;
          wk[i].run_time = (rand() % <span class="hljs-number">7</span>) + <span class="hljs-number">1</span>;
          wk[i].remain_time = wk[i].run_time;
          wk[i].start_time = -<span class="hljs-number">1</span>;
          wk[i].finish_time = -<span class="hljs-number">1</span>;
          wk[i].turnaround_time = -<span class="hljs-number">1</span>;
          wk[i].weighted_turnover_time = -<span class="hljs-number">1</span>;
      }
      wk[<span class="hljs-number">0</span>].commit_time = <span class="hljs-number">0</span>; <span class="hljs-comment">//设置第一个任务的提交时间为第0秒</span>
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;work_num; i++)
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"work_id: %d, "</span>, i+<span class="hljs-number">1</span>);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"commit_time: %d, "</span>, wk[i].commit_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"run_time: %d, "</span>, wk[i].run_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"remain_time: %d, "</span>, wk[i].remain_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"start_time: %d, "</span>, wk[i].start_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"finish_time: %d\n"</span>, wk[i].finish_time);
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"-----START-----\n"</span>);
      RR(wk, work_num, time_block, &amp;average_turnaround_time, &amp;average_weighted_turnover_time); <span class="hljs-comment">//开始运行RR算法</span>
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"-----FINISH-----\n"</span>);
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;work_num; i++)
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"work_id: %d, "</span>, i+<span class="hljs-number">1</span>);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"commit_time: %d, "</span>, wk[i].commit_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"run_time: %d, "</span>, wk[i].run_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"remain_time: %d, "</span>, wk[i].remain_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"start_time: %d, "</span>, wk[i].start_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"finish_time: %d, "</span>, wk[i].finish_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"turnaround_time: %.1f, "</span>, wk[i].turnaround_time);
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"weighted_turnover_time: %.1f\n"</span>, wk[i].weighted_turnover_time);
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"-----average_turnaround_time: %f\n"</span>, average_turnaround_time);
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"-----average_weighted_turnover_time: %f\n"</span>, average_weighted_turnover_time);
      <span class="hljs-comment">/*****测试完成*****/</span>
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">//struct work *wk; 进程描述（结构体）</span>
  <span class="hljs-comment">//int work_num; 进程数量</span>
  <span class="hljs-comment">//int time_block; 时间片大小</span>
  <span class="hljs-comment">// float *average_turnaround_time; 平均带权周转时间（指针）</span>
  <span class="hljs-comment">// float *average_weighted_turnover_time; 平均带权周转时间（指针）</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">RR</span><span class="hljs-params">(<span class="hljs-keyword">struct</span> work *wk, <span class="hljs-keyword">int</span> work_num, <span class="hljs-keyword">int</span> time_block, <span class="hljs-keyword">float</span> *average_turnaround_time, <span class="hljs-keyword">float</span> *average_weighted_turnover_time)</span>
  </span>{
      <span class="hljs-keyword">int</span> i, j;
      <span class="hljs-keyword">int</span> flag_1 = <span class="hljs-number">0</span>; <span class="hljs-comment">//flag_1为0意为作业未全部完成，而当所有wk的finish_time全不为-1时，则将flag置为1，RR算法结束</span>
      <span class="hljs-keyword">int</span> flag_2 = <span class="hljs-number">0</span>; <span class="hljs-comment">//flag_2为0意味着未找到当前时间符合运行条件的作业，则时间需向前推进1秒（再次寻找）</span>
      <span class="hljs-keyword">float</span> temp_2, temp_3; <span class="hljs-comment">//用于给周转时间和带权周转时间求和</span>
      i = <span class="hljs-number">0</span>;
      <span class="hljs-keyword">while</span> (flag_1 == <span class="hljs-number">0</span>)
      {
          flag_2 = <span class="hljs-number">0</span>;
          <span class="hljs-keyword">for</span> (j=<span class="hljs-number">0</span>; j&lt;work_num; j++)
          {
              <span class="hljs-keyword">if</span> ((wk[j].remain_time) &amp;&amp; (i &gt;= wk[j].commit_time)) <span class="hljs-comment">//如果wk[j].remain_time不为0，则说明j作业仍未完成。同时要保证当前系统时间i&gt;=作业提交时间</span>
              {
                  flag_2 = <span class="hljs-number">1</span>; <span class="hljs-comment">//找到符合要求的作业，则将flag_2置为1</span>
                  <span class="hljs-keyword">if</span> (wk[j].remain_time &lt;= time_block)
                  {
                      <span class="hljs-comment">// 由于剩余时间小于等于时间片长度，则本次运行时间为该作业剩余时间</span>
                      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"present_time: %d, running_id: %d, running_time:%d\n"</span>, i, j+<span class="hljs-number">1</span>, wk[j].remain_time);
                      <span class="hljs-keyword">if</span> (wk[j].start_time == -<span class="hljs-number">1</span>)
                          wk[j].start_time = i; <span class="hljs-comment">//如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间</span>
                      i += wk[j].remain_time; <span class="hljs-comment">// 当前时间需加上本次运行的时间</span>
                      wk[j].remain_time -= wk[j].remain_time; <span class="hljs-comment">//剩余时间需减去本次运行的时间                    </span>
                      wk[j].finish_time = i; <span class="hljs-comment">//作业运行完成，设置该作业的结束时间</span>
                  }
                  <span class="hljs-keyword">else</span>
                  {
                      <span class="hljs-comment">// 由于剩余时间大于时间片长度，则本次运行时间为时间片长度</span>
                      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"present_time: %d, running_id: %d, running_time:%d\n"</span>, i, j+<span class="hljs-number">1</span>, time_block);
                      <span class="hljs-keyword">if</span> (wk[j].start_time == -<span class="hljs-number">1</span>)
                          wk[j].start_time = i; <span class="hljs-comment">//如果该作业还没有开始，则将当前时间设为该作业的（首次）开始时间</span>
                      i += time_block; <span class="hljs-comment">// 当前时间需加上本次运行的时间</span>
                      wk[j].remain_time -= time_block; <span class="hljs-comment">//剩余时间需减去本次运行的时间</span>
                  }
              }
          }

          <span class="hljs-keyword">if</span> (flag_2 == <span class="hljs-number">0</span>)
          {
              <span class="hljs-comment">//flag_2为0意味着未找到当前时间符合运行条件的作业，则时间需向前推进1秒（可能是当前时间点已无作业可进行，而有的作业尚未提交，故向前推进1秒并再次寻找）</span>
              i++;
          }

          flag_1 = <span class="hljs-number">1</span>; <span class="hljs-comment">//先假设全部作业均运行完成</span>
          <span class="hljs-keyword">for</span> (j=<span class="hljs-number">0</span>; j&lt;work_num; j++) <span class="hljs-comment">//循环全部作业，确认是否全部运行完成（找出是否有作业仍未完成）</span>
          {
              <span class="hljs-keyword">if</span> (wk[j].finish_time == -<span class="hljs-number">1</span>)
              {
                  flag_1 = <span class="hljs-number">0</span>;
                  <span class="hljs-keyword">break</span>;
              }
          }
          <span class="hljs-keyword">if</span> (flag_1 == <span class="hljs-number">1</span>)
          {
              temp_2 = <span class="hljs-number">0</span>;
              temp_3 = <span class="hljs-number">0</span>;
              <span class="hljs-keyword">for</span> (j=<span class="hljs-number">0</span>; j&lt;work_num; j++) <span class="hljs-comment">//计算平均周转时间和平均带权周转时间</span>
              {
                  wk[j].turnaround_time = wk[j].finish_time - wk[j].commit_time;
                  wk[j].weighted_turnover_time = wk[j].turnaround_time / wk[j].run_time;
                  temp_2 += wk[j].turnaround_time;
                  temp_3 += wk[j].weighted_turnover_time;
              }
              *average_turnaround_time = (temp_2/work_num);
              *average_weighted_turnover_time = (temp_3/work_num);
          }
      }
  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
