<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;malloc.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">OPT</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *in_use, <span class="hljs-keyword">int</span> inuse_length, <span class="hljs-keyword">int</span> *page_list, <span class="hljs-keyword">int</span> list_length)</span></span>; <span class="hljs-comment">//OPT置换算法（框架）</span>
  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">findIndex</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *in_use, <span class="hljs-keyword">int</span> inuse_length, <span class="hljs-keyword">int</span> *page_list, <span class="hljs-keyword">int</span> list_length, <span class="hljs-keyword">int</span> start)</span></span>; <span class="hljs-comment">//OPT算法核心部分，即当内存区满时，找到被置换的页面</span>

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> i, j;
      <span class="hljs-keyword">int</span> *in_use = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), inuse_length); <span class="hljs-comment">//内存空间</span>
      <span class="hljs-keyword">int</span> inuse_length = <span class="hljs-number">3</span>; <span class="hljs-comment">//内存页面最大长度</span>
      <span class="hljs-keyword">int</span> page_list[] = {<span class="hljs-number">7</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">0</span>, <span class="hljs-number">3</span>, <span class="hljs-number">0</span>, <span class="hljs-number">4</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">0</span>, <span class="hljs-number">3</span>, <span class="hljs-number">2</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">7</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>}; <span class="hljs-comment">//来到的页面号列表（测试用）</span>
      <span class="hljs-keyword">int</span> list_length = <span class="hljs-keyword">sizeof</span>(page_list)/<span class="hljs-keyword">sizeof</span>(page_list[<span class="hljs-number">0</span>]); <span class="hljs-comment">//页面号列表长度</span>

      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; inuse_length; i++)
    {
      in_use[i] = -<span class="hljs-number">1</span>;<span class="hljs-comment">//初始化为-1，表示空</span>
    }

      OPT(in_use, inuse_length, &amp;page_list, list_length); <span class="hljs-comment">//执行OPT置换算法</span>

      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// int resource: 分配内存空间,存储资源的分配情况</span>
  <span class="hljs-comment">// int times：下一次访问时，记录每个页面从载入到当前经过的单位时间个数</span>
  <span class="hljs-comment">// int length：内存页面最大长度</span>
  <span class="hljs-comment">// int page_num：page_num为请求的页面</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">OPT</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *in_use, <span class="hljs-keyword">int</span> inuse_length, <span class="hljs-keyword">int</span> *page_list, <span class="hljs-keyword">int</span> list_length)</span>
  </span>{
      <span class="hljs-keyword">int</span> i, j;
      <span class="hljs-keyword">int</span> flag; <span class="hljs-comment">//标识位，假如内存未满或内存中有当前新来到的页面，则flag置为1，不执行findIndex函数</span>
      <span class="hljs-keyword">int</span> replace_index; <span class="hljs-comment">//被交换出内存的页面在内存中的位置</span>
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;list_length; i++)
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"新页面: %d\n"</span>, page_list[i]);
          flag = <span class="hljs-number">0</span>;
          <span class="hljs-keyword">for</span> (j=<span class="hljs-number">0</span>; j&lt;inuse_length; j++)
          {
              <span class="hljs-keyword">if</span> (in_use[j] == page_list[i])
              {
                  <span class="hljs-built_in">printf</span>(<span class="hljs-string">"页面片段%d在内存中，不需要置换\n"</span>, page_list[i]);
                  flag = <span class="hljs-number">1</span>;
                  <span class="hljs-keyword">break</span>;
              }
              <span class="hljs-function"><span class="hljs-keyword">else</span> <span class="hljs-title">if</span> <span class="hljs-params">(in_use[j] == -1)</span>
              </span>{
                  in_use[j] = page_list[i];
                  <span class="hljs-built_in">printf</span>(<span class="hljs-string">"当前内存有空位，新页面%d被插入到%d号位\n"</span>, page_list[i], i+<span class="hljs-number">1</span>);
                  flag = <span class="hljs-number">1</span>;
                  <span class="hljs-keyword">break</span>;
              }
          }
          <span class="hljs-keyword">if</span> (flag == <span class="hljs-number">0</span>) <span class="hljs-comment">//缺页中断时寻找被替换的页面</span>
          {
              replace_index = findIndex(in_use, inuse_length, page_list, list_length, i+<span class="hljs-number">1</span>);
              <span class="hljs-built_in">printf</span>(<span class="hljs-string">"内存区满，根据OPT算法，新页面%d与%d号位的%d号页面交换\n"</span>, page_list[i], replace_index+<span class="hljs-number">1</span>, in_use[replace_index]);
              in_use[replace_index] = page_list[i];
          }
          <span class="hljs-comment">//打印每一轮插入页面后的结果</span>
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"当前页面情况: "</span>);
          <span class="hljs-keyword">for</span> (j=<span class="hljs-number">0</span>; j&lt;inuse_length; j++)
          {
              <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%d "</span>, in_use[j]);
          }
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\n"</span>);
      }

  }

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">findIndex</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *in_use, <span class="hljs-keyword">int</span> inuse_length, <span class="hljs-keyword">int</span> *page_list, <span class="hljs-keyword">int</span> list_length, <span class="hljs-keyword">int</span> start)</span>
  </span>{
      <span class="hljs-keyword">int</span> *compare = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), inuse_length);
      <span class="hljs-keyword">int</span> times = <span class="hljs-number">0</span>;<span class="hljs-comment">//记录内存中页面号与list中页面号相等的次数</span>
      <span class="hljs-keyword">int</span> i, j;

      <span class="hljs-keyword">if</span> (start &gt;= list_length)
      {
          <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>; <span class="hljs-comment">//假如来到的是最后一个页面，就任选一个内存位置替换</span>
      }

      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;inuse_length; i++) <span class="hljs-comment">//复制in_use到compare</span>
      {
          compare[i] = in_use[i];
      }

      <span class="hljs-comment">//从page_list[start]位置开始比对，如果比对相等次数等于2或者全部比对完成，则认为找到需要被替换的页面位置（最晚被使用的）</span>
      <span class="hljs-keyword">for</span> (i=start; (i&lt;list_length) &amp;&amp; (times &lt; inuse_length-<span class="hljs-number">1</span>); i++)
      {
          <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j&lt;inuse_length; j++)
          {
              <span class="hljs-keyword">if</span> (compare[j] == page_list[i])
              {
                  compare[j] = -<span class="hljs-number">1</span>; <span class="hljs-comment">//标记为-1代表这个数字出现过在list中，换句话说，最后没有被标称-1的就是最晚出现在list中的页面号</span>
                  times++;
                  <span class="hljs-keyword">break</span>;
              }
          }
      }
      <span class="hljs-keyword">for</span> (i=<span class="hljs-number">0</span>; i&lt;inuse_length; i++)
      {
          <span class="hljs-keyword">if</span> (compare[i] != -<span class="hljs-number">1</span>)
          {
              <span class="hljs-keyword">return</span> i; <span class="hljs-comment">//当找到不为-1的compare[i]时，i即为需要被置换的页面的内存中的位置(replace_index)</span>
          }
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
