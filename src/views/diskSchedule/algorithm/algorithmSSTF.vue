<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;malloc.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;math.h&gt;</span>

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">SSTF</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> list_size, <span class="hljs-keyword">int</span> initial_position)</span></span>;
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">SortInput</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> *sort_list, <span class="hljs-keyword">int</span> list_size)</span></span>;
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">copyIntPointer</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *a, <span class="hljs-keyword">int</span> *b, <span class="hljs-keyword">int</span> size)</span></span>;

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> initial_position = <span class="hljs-number">100</span>;
      <span class="hljs-keyword">int</span> input[<span class="hljs-number">9</span>] = {<span class="hljs-number">55</span>, <span class="hljs-number">58</span>, <span class="hljs-number">39</span>, <span class="hljs-number">18</span>, <span class="hljs-number">90</span>, <span class="hljs-number">160</span>, <span class="hljs-number">150</span>, <span class="hljs-number">38</span>, <span class="hljs-number">184</span>};
      SSTF(input, <span class="hljs-keyword">sizeof</span>(input) / <span class="hljs-keyword">sizeof</span>(input[<span class="hljs-number">0</span>]), initial_position);
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">//int *input; 输入待访问的队列</span>
  <span class="hljs-comment">//int list_size; 输入队列的长度</span>
  <span class="hljs-comment">//int initial_position; 磁头初始位置</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">SSTF</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *input, <span class="hljs-keyword">int</span> list_size, <span class="hljs-keyword">int</span> initial_position)</span>
  </span>{
      <span class="hljs-keyword">int</span> i, j, k;
      <span class="hljs-keyword">int</span> position = initial_position;
      <span class="hljs-keyword">int</span> total_moving = <span class="hljs-number">0</span>;
      <span class="hljs-keyword">int</span> *sort_list = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), list_size); <span class="hljs-comment">//对输入序列排序的结果</span>
      <span class="hljs-keyword">int</span> *sort_list_cp = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), list_size); <span class="hljs-comment">//对输入序列排序的结果</span>
      SortInput(input, sort_list, list_size);
      copyIntPointer(sort_list, sort_list_cp, list_size);
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"磁盘磁头初始位置为: %3d, 向磁盘号增加方向移动则移动距离为正，反之为负\n"</span>, initial_position);
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;list_size; i++)
      {
          j = <span class="hljs-number">0</span>;
          <span class="hljs-keyword">for</span> (j=<span class="hljs-number">0</span>; sort_list_cp[j]!=-<span class="hljs-number">1</span>; j++)
          {
              <span class="hljs-keyword">if</span> (sort_list_cp[j] &gt;= position)
              {
                  <span class="hljs-keyword">if</span> (j &gt;= <span class="hljs-number">1</span>)
                  {
                      <span class="hljs-keyword">if</span> (<span class="hljs-built_in">abs</span>(sort_list_cp[j] - position) &lt;= <span class="hljs-built_in">abs</span>(sort_list_cp[j-<span class="hljs-number">1</span>] - position))
                      {
                          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n"</span>, i+<span class="hljs-number">1</span>, sort_list_cp[j], sort_list_cp[j]-position);
                          total_moving += <span class="hljs-built_in">abs</span>(sort_list_cp[j]-position);
                          position = sort_list_cp[j];
                          <span class="hljs-keyword">for</span> (k=j+<span class="hljs-number">1</span>; k&lt;list_size; k++)
                          {
                              sort_list_cp[k-<span class="hljs-number">1</span>] = sort_list_cp[k];
                          }
                          sort_list_cp[list_size-<span class="hljs-number">1</span>] = -<span class="hljs-number">1</span>;
                          <span class="hljs-keyword">break</span>;
                      }
                      <span class="hljs-keyword">else</span>
                      {
                          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n"</span>, i+<span class="hljs-number">1</span>, sort_list_cp[j-<span class="hljs-number">1</span>], sort_list_cp[j-<span class="hljs-number">1</span>]-position);
                          total_moving += <span class="hljs-built_in">abs</span>(sort_list_cp[j-<span class="hljs-number">1</span>]-position);
                          position = sort_list_cp[j-<span class="hljs-number">1</span>];
                          <span class="hljs-keyword">for</span> (k=j; k&lt;list_size; k++)
                          {
                              sort_list_cp[k-<span class="hljs-number">1</span>] = sort_list_cp[k];
                          }
                          sort_list_cp[list_size-<span class="hljs-number">1</span>] = -<span class="hljs-number">1</span>;
                          <span class="hljs-keyword">break</span>;
                      }
                  }
                  <span class="hljs-keyword">else</span>
                  {
                      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n"</span>, i+<span class="hljs-number">1</span>, sort_list_cp[j], sort_list_cp[j]-position);
                      total_moving += <span class="hljs-built_in">abs</span>(sort_list_cp[j]-position);
                      position = sort_list_cp[j];
                      <span class="hljs-keyword">for</span> (k=j+<span class="hljs-number">1</span>; k&lt;list_size; k++)
                      {
                          sort_list_cp[k-<span class="hljs-number">1</span>] = sort_list_cp[k];
                      }
                      sort_list_cp[list_size-<span class="hljs-number">1</span>] = -<span class="hljs-number">1</span>;
                      <span class="hljs-keyword">break</span>;
                  }
              }
              <span class="hljs-function"><span class="hljs-keyword">else</span> <span class="hljs-title">if</span> <span class="hljs-params">((sort_list_cp[j+1] == -1)</span> || <span class="hljs-params">(j+1)</span> </span>== list_size)
              {
                  <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%2d# 被访问的下一个磁道号: %3d, 移动距离: %3d\n"</span>, i+<span class="hljs-number">1</span>, sort_list_cp[j], sort_list_cp[j]-position);
                  total_moving += <span class="hljs-built_in">abs</span>(sort_list_cp[j]-position);
                  <span class="hljs-keyword">for</span> (k=j+<span class="hljs-number">1</span>; k&lt;list_size; k++)
                  {
                      sort_list_cp[k-<span class="hljs-number">1</span>] = sort_list_cp[k];
                  }
                  sort_list_cp[list_size-<span class="hljs-number">1</span>] = -<span class="hljs-number">1</span>;
                  <span class="hljs-keyword">break</span>;
              }
          }
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"平均寻道长度: %3f\n"</span>, (<span class="hljs-keyword">float</span>)total_moving/list_size);
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">//int *input; 输入待访问的队列</span>
  <span class="hljs-comment">//int *sort_list; 输入的排序后的结果</span>
  <span class="hljs-comment">//int list_size; 队列长度</span>
  <span class="hljs-comment">//------------------------------//</span>
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

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">copyIntPointer</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *a, <span class="hljs-keyword">int</span> *b, <span class="hljs-keyword">int</span> size)</span>
  </span>{
    <span class="hljs-keyword">int</span> i;
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i&lt;size; i++)
    {
      b[i] = a[i];
    }
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
