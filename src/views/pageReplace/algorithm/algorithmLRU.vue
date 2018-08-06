<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;limits.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;string.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;time.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdbool.h&gt;</span>

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">LRU_PageReplacement</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *resource, <span class="hljs-keyword">int</span> *times,<span class="hljs-keyword">int</span> length, <span class="hljs-keyword">int</span> page_num)</span></span>;
  <span class="hljs-comment">//保持和FIFO的接口风格一致，增添了times参数，来记录上次使用的次数，因此resource里面的标识符由原来的三位变成两位</span>

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
    <span class="hljs-keyword">int</span> length = <span class="hljs-number">4</span>;<span class="hljs-comment">//内存页面最大长度</span>
    <span class="hljs-keyword">int</span> *resource = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), length + <span class="hljs-number">2</span>);<span class="hljs-comment">//分配空间,0号位为标识符，1号位为此次替换的位置，2号位为下一次替换的位置</span>
    <span class="hljs-keyword">int</span> *times = (<span class="hljs-keyword">int</span>*)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), length);<span class="hljs-comment">//分配空间，相应的位置表示已经停留在内存中的次数,此处一定要初始化为0</span>
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>;

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; length + <span class="hljs-number">2</span>; i++)
    {
      resource[i] = -<span class="hljs-number">1</span>;<span class="hljs-comment">//初始化为-1，表示空</span>
    }
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; length; i++)
    {
      times[i] = <span class="hljs-number">0</span>;
    }


    <span class="hljs-comment">//------------------测试----------------------</span>
    <span class="hljs-keyword">int</span> <span class="hljs-built_in">list</span>[<span class="hljs-number">25</span>] = { <span class="hljs-number">7</span>,<span class="hljs-number">0</span>,<span class="hljs-number">1</span>,<span class="hljs-number">2</span>,<span class="hljs-number">0</span>,<span class="hljs-number">3</span>,<span class="hljs-number">0</span>,<span class="hljs-number">4</span>,<span class="hljs-number">2</span>,<span class="hljs-number">3</span>,<span class="hljs-number">0</span>,<span class="hljs-number">3</span>,<span class="hljs-number">2</span>,<span class="hljs-number">1</span>,<span class="hljs-number">2</span>,<span class="hljs-number">0</span>,<span class="hljs-number">1</span>,<span class="hljs-number">7</span>,<span class="hljs-number">0</span>,<span class="hljs-number">1</span> };
    <span class="hljs-keyword">int</span> j = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; <span class="hljs-number">20</span>; i++)
    {
      LRU_PageReplacement(resource,times, length, <span class="hljs-built_in">list</span>[i]);

      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; length + <span class="hljs-number">2</span>; j++)
        printf_s(<span class="hljs-string">"%d "</span>, resource[j]);
      printf_s(<span class="hljs-string">"	"</span>);
      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; length; j++)
      {
        printf_s(<span class="hljs-string">"%d "</span>, times[j]);
      }
      printf_s(<span class="hljs-string">"\n"</span>);
    }

    system(<span class="hljs-string">"pause"</span>);
  }
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">// int *resource: 请求的资源</span>
  <span class="hljs-comment">// int* times：分配空间，相应的位置表示已经停留在内存中的次数,此处一定要初始化为0</span>
  <span class="hljs-comment">// int length：内存页面最大长度</span>
  <span class="hljs-comment">// int page_num：page_num为请求的页面</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">LRU_PageReplacement</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *resource, <span class="hljs-keyword">int</span>* times,<span class="hljs-keyword">int</span> length, <span class="hljs-keyword">int</span> page_num)</span><span class="hljs-comment">//length为内存能容纳的最大长度，page_num为请求的页面</span>
  </span>{
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>, j = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">int</span> max = <span class="hljs-number">0</span>, max_pos = <span class="hljs-number">0</span>;

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">2</span>; i &lt; length + <span class="hljs-number">2</span>; i++)
    {
      <span class="hljs-keyword">if</span> (page_num == resource[i])<span class="hljs-comment">//表示请求的页面在已经分配的内存中</span>
      {
        resource[<span class="hljs-number">0</span>] = <span class="hljs-number">0</span>;<span class="hljs-comment">//0表示不需要请求新的页面</span>
        resource[<span class="hljs-number">1</span>] = i;<span class="hljs-comment">//请求的页面在第i号位置</span>
        times[i - <span class="hljs-number">2</span>] = <span class="hljs-number">1</span>;<span class="hljs-comment">//记录请求的页面的在内存中的次数重置为1</span>
        <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; length; j++)<span class="hljs-comment">//循环遍历内存中页面的停留次数</span>
        {
          <span class="hljs-keyword">if</span> (times[j] == <span class="hljs-number">0</span>)<span class="hljs-comment">//如果该位置的停留次数为0，表示该位置还从来没有被分配过页面，跳过</span>
            <span class="hljs-keyword">continue</span>;
          <span class="hljs-keyword">if</span> (j == i - <span class="hljs-number">2</span>)
            <span class="hljs-keyword">continue</span>;<span class="hljs-comment">//分配内存对应的记录次数的位置，重置为1，表示下一次请求时，该页面已经在内存中停留了一次</span>
          <span class="hljs-keyword">else</span>
            times[j] += <span class="hljs-number">1</span>;<span class="hljs-comment">//其余位置依次增加1个停留时间</span>
        }

        <span class="hljs-keyword">return</span>;
      }
    }

    <span class="hljs-comment">//请求的页面不在已分配的内存中</span>
    max = times[<span class="hljs-number">0</span>];
    <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; length; j++)<span class="hljs-comment">//找到停留最久的页面在内存中的位置</span>
    {
      <span class="hljs-keyword">if</span> (times[j] == <span class="hljs-number">0</span>)<span class="hljs-comment">//如果该位置还没有被分配过，则直接分配</span>
      {
        max_pos = j;
        <span class="hljs-keyword">break</span>;
      }
      <span class="hljs-keyword">if</span> (times[j] &gt; max)
      {
        max = times[j];
        max_pos = j;
      }
    }

    resource[max_pos + <span class="hljs-number">2</span>] = page_num;
    resource[<span class="hljs-number">0</span>] = <span class="hljs-number">1</span>;
    resource[<span class="hljs-number">1</span>] = max_pos + <span class="hljs-number">2</span>;
    times[max_pos] = <span class="hljs-number">1</span>;

    <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; length; j++)<span class="hljs-comment">//循环遍历内存中页面的停留次数</span>
    {
      <span class="hljs-keyword">if</span> (times[j] == <span class="hljs-number">0</span>)<span class="hljs-comment">//如果该位置的停留次数为0，表示该位置还从来没有被分配过页面，跳过</span>
        <span class="hljs-keyword">continue</span>;
      <span class="hljs-keyword">if</span> (j == max_pos)
        <span class="hljs-keyword">continue</span>;<span class="hljs-comment">//分配内存对应的记录次数的位置，重置为1，表示下一次请求时，该页面已经在内存中停留了一次</span>
      <span class="hljs-keyword">else</span>
        times[j] += <span class="hljs-number">1</span>;<span class="hljs-comment">//其余位置依次增加1个停留时间</span>
    }

    <span class="hljs-keyword">return</span>;
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
