<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;malloc.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;math.h&gt;</span>

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">FCFS</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> list_size, <span class="hljs-keyword">int</span> initial_position)</span></span>;
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">SortInput</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> *sort_list, <span class="hljs-keyword">int</span> list_size)</span></span>;

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> initial_position = <span class="hljs-number">100</span>;
      <span class="hljs-keyword">int</span> input[<span class="hljs-number">9</span>] = {<span class="hljs-number">55</span>, <span class="hljs-number">58</span>, <span class="hljs-number">39</span>, <span class="hljs-number">18</span>, <span class="hljs-number">90</span>, <span class="hljs-number">160</span>, <span class="hljs-number">150</span>, <span class="hljs-number">38</span>, <span class="hljs-number">184</span>};
      FCFS(input, <span class="hljs-keyword">sizeof</span>(input) / <span class="hljs-keyword">sizeof</span>(input[<span class="hljs-number">0</span>]), initial_position);
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">//int *input; 输入数据，需要访问的磁盘号</span>
  <span class="hljs-comment">//int list_size; 输入数据的长度</span>
  <span class="hljs-comment">//int initial_position; 磁头初始位置</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">FCFS</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> list_size, <span class="hljs-keyword">int</span> initial_position)</span>
  </span>{
      <span class="hljs-keyword">int</span> i;
      <span class="hljs-keyword">int</span> position = initial_position;
      <span class="hljs-keyword">int</span> total_moving = <span class="hljs-number">0</span>;
      <span class="hljs-keyword">int</span> *sort_list = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), list_size);
      SortInput(input, sort_list, list_size);
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"磁盘磁头初始位置为: %3d, 向磁盘号增加方向移动则移动距离为正，反之为负\n"</span>, initial_position);
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;list_size; i++)
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n"</span>, i+<span class="hljs-number">1</span>, input[i], input[i]-position);
          total_moving += <span class="hljs-built_in">abs</span>(input[i]-position);
          position = input[i];
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"平均寻道长度: %3f\n"</span>, (<span class="hljs-keyword">float</span>)total_moving/list_size);
  }

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">SortInput</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> *sort_list, <span class="hljs-keyword">int</span> list_size)</span>
  </span>{
      <span class="hljs-keyword">int</span> i, j;
      <span class="hljs-keyword">int</span> temp1, temp2;
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;list_size; i++)
      {
          sort_list[i] = input[i];
      }
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;list_size; i++) <span class="hljs-comment">//选择法排序</span>
      {
          temp1 = i;
          <span class="hljs-keyword">for</span> (j=i; j&lt;list_size; j++)
          {
              <span class="hljs-keyword">if</span> (sort_list[j] &lt; sort_list[temp1])
              {
                  temp1 = j;
              }
          }
          temp2 = sort_list[i];
          sort_list[i] = sort_list[temp1];
          sort_list[temp1] = temp2;
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"Sort list: "</span>);
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;list_size; i++)
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%d "</span>, sort_list[i]);
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\n"</span>);
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
