<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdio.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;malloc.h&gt;</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">include</span>&lt;stdlib.h&gt;</span>

  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">FIFO_PageReplacement</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *resource, <span class="hljs-keyword">int</span> length, <span class="hljs-keyword">int</span> page_num)</span></span>;

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
    <span class="hljs-keyword">int</span> length = <span class="hljs-number">3</span>;<span class="hljs-comment">//内存页面最大长度</span>
    <span class="hljs-keyword">int</span> *resource = (<span class="hljs-keyword">int</span> *)<span class="hljs-built_in">calloc</span>(<span class="hljs-keyword">sizeof</span>(<span class="hljs-keyword">int</span>), length + <span class="hljs-number">3</span>);<span class="hljs-comment">//分配空间,0号位为标识符，1号位为此次替换的位置，2号位为下一次替换的位置</span>
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>;

    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; length + <span class="hljs-number">3</span>; i++)
    {
      resource[i] = -<span class="hljs-number">1</span>;<span class="hljs-comment">//初始化为-1，表示空</span>
    }
    resource[<span class="hljs-number">2</span>] = <span class="hljs-number">3</span>;<span class="hljs-comment">//下一次替换的位置初始化为3:</span>

    <span class="hljs-comment">//------------------测试----------------------</span>
    <span class="hljs-keyword">int</span> <span class="hljs-built_in">list</span>[<span class="hljs-number">25</span>] = { <span class="hljs-number">7</span>,<span class="hljs-number">0</span>,<span class="hljs-number">1</span>,<span class="hljs-number">2</span>,<span class="hljs-number">0</span>,<span class="hljs-number">3</span>,<span class="hljs-number">0</span>,<span class="hljs-number">4</span>,<span class="hljs-number">2</span>,<span class="hljs-number">3</span>,<span class="hljs-number">0</span>,<span class="hljs-number">3</span>,<span class="hljs-number">2</span>,<span class="hljs-number">1</span>,<span class="hljs-number">2</span>,<span class="hljs-number">0</span>,<span class="hljs-number">1</span>,<span class="hljs-number">7</span>,<span class="hljs-number">0</span>,<span class="hljs-number">1</span> };
    <span class="hljs-keyword">int</span> j = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; <span class="hljs-number">20</span>; i++)
    {
      FIFO_PageReplacement(resource, length, <span class="hljs-built_in">list</span>[i]);

      <span class="hljs-keyword">for</span> (j = <span class="hljs-number">0</span>; j &lt; length + <span class="hljs-number">3</span>; j++)
        printf_s(<span class="hljs-string">"%d "</span>, resource[j]);
      printf_s(<span class="hljs-string">"\n"</span>);
    }

    system(<span class="hljs-string">"pause"</span>);
  }

  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-comment">//int *resource; 当前内存中的页面号序列，初始为空</span>
  <span class="hljs-comment">//int length; 内存能容纳的最大长度</span>
  <span class="hljs-comment">//int page_num; 请求的页面序号</span>
  <span class="hljs-comment">//------------------------------//</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">FIFO_PageReplacement</span><span class="hljs-params">(<span class="hljs-keyword">int</span> *resource,<span class="hljs-keyword">int</span> length,<span class="hljs-keyword">int</span> page_num)</span>
  </span>{
    <span class="hljs-keyword">int</span> i = <span class="hljs-number">0</span>;
    <span class="hljs-keyword">for</span> (i = <span class="hljs-number">3</span>; i &lt; length + <span class="hljs-number">3</span>; i++)<span class="hljs-comment">//判断请求的页面在已分配的页面中是否已经存在，若存在，则直接返回</span>
    {
      <span class="hljs-keyword">if</span> (resource[i] == page_num)
      {
        resource[<span class="hljs-number">0</span>] = <span class="hljs-number">0</span>;<span class="hljs-comment">//如果请求的页面在内存中，则不需要添加新的页面</span>
        resource[<span class="hljs-number">1</span>] = i;<span class="hljs-comment">//请求的页面在编号为i的位置</span>
        <span class="hljs-keyword">return</span>;
      }
    }

    <span class="hljs-comment">//执行到这里表示请求的页面没有在已分配的页面中，则从前往后依次替换一个页面，把请求的页面放到替换的位置</span>
    resource[<span class="hljs-number">1</span>] = (resource[<span class="hljs-number">2</span>] - <span class="hljs-number">3</span>) % length + <span class="hljs-number">3</span>;
    resource[resource[<span class="hljs-number">1</span>]] = page_num;
    resource[<span class="hljs-number">2</span>] += <span class="hljs-number">1</span>;
    resource[<span class="hljs-number">0</span>] = <span class="hljs-number">1</span>; <span class="hljs-comment">//1表示需要添加新的进程</span>

    <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }
  </code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
