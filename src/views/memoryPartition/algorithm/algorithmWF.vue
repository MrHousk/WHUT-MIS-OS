<template>
  <pre class='hljs'><code><span class="hljs-preprocessor">#<span class="hljs-keyword">include</span> &lt;bits/stdc++.h&gt;</span>
  <span class="hljs-keyword">using</span> <span class="hljs-keyword">namespace</span> <span class="hljs-built_in">std</span>;
  <span class="hljs-comment">/*定义内存的大小为100*/</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">define</span> MEMSIZE 100</span>
  <span class="hljs-comment">/*如果小于此值，将不再分割内存*/</span>
  <span class="hljs-preprocessor">#<span class="hljs-keyword">define</span> MINSIZE 2</span>

  <span class="hljs-comment">/*内存分区空间表结构*/</span>
  <span class="hljs-keyword">typedef</span> <span class="hljs-keyword">struct</span> _MemoryInfomation
  {
      <span class="hljs-comment">/*起始地址*/</span>
      <span class="hljs-keyword">int</span> start;
      <span class="hljs-comment">/*大小*/</span>
      <span class="hljs-keyword">int</span> Size;
      <span class="hljs-comment">/*状态 F:空闲(Free) U:占用(Used) E 结束(End)*/</span>
      <span class="hljs-keyword">char</span> status;
  } MEMINFO;

  <span class="hljs-comment">/*内存空间信息表*/</span>
  MEMINFO MemList[MEMSIZE];

  <span class="hljs-comment">/*显示内存状态*/</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">Display</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> i, used = <span class="hljs-number">0</span>; <span class="hljs-comment">//记录可以使用的总空间量</span>
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\n---------------------------------------------------\n"</span>);
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%5s%15s%15s%15s"</span>, <span class="hljs-string">"Number"</span>, <span class="hljs-string">"start"</span>, <span class="hljs-string">"size"</span>, <span class="hljs-string">"status"</span>);
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\n---------------------------------------------------\n"</span>);
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; MEMSIZE &amp;&amp; MemList[i].status != <span class="hljs-string">'e'</span>; i++)
      {
          <span class="hljs-keyword">if</span> (MemList[i].status == <span class="hljs-string">'u'</span>)
          {
              used += MemList[i].Size;
          }
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"%5d%15d%15d%15s\n"</span>, i, MemList[i].start, MemList[i].Size, MemList[i].status == <span class="hljs-string">'u'</span> ? <span class="hljs-string">"USED"</span> : <span class="hljs-string">"FREE"</span>);
      }
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\n----------------------------------------------\n"</span>);
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"Totalsize:%-10d Used:%-10d Free:%-10d\n"</span>, MEMSIZE, used, MEMSIZE - used);
  }

  <span class="hljs-comment">/*初始化所有变量*/</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">InitMemList</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> i;
      MEMINFO temp = {<span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-string">'e'</span>};
      <span class="hljs-comment">//初始化空间信息表</span>
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; MEMSIZE; i++)
      {
          MemList[i] = temp;
      }
      <span class="hljs-comment">//起始地址为0</span>
      MemList[<span class="hljs-number">0</span>].start = <span class="hljs-number">0</span>;
      <span class="hljs-comment">//空间初始为最大</span>
      MemList[<span class="hljs-number">0</span>].Size = MEMSIZE;
      <span class="hljs-comment">//状态为空闲</span>
      MemList[<span class="hljs-number">0</span>].status = <span class="hljs-string">'f'</span>;
  }

  <span class="hljs-comment">/*最坏适应算法

  算法原理分析：
  扫描整个空闲分区或者链表，总是挑选一个最大的空闲分区分割给作业使用

  优点：可以使得剩下的空闲分区不至于太小，产生碎片的几率最小，对中小作业有利，同时该算法的查找效率很高

  缺点：会使得储存器中缺乏大的空闲分区
  */</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">BadFit_new</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> i, j, k, flag, request;
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"BadFit_new:How Many MEMORY requir?\n"</span>);
      <span class="hljs-built_in">scanf</span>(<span class="hljs-string">"%d"</span>, &amp;request);
      j = <span class="hljs-number">0</span>;
      flag = <span class="hljs-number">0</span>;
      k = <span class="hljs-number">0</span>;
      <span class="hljs-comment">//保存满足要求的最大空间</span>
      <span class="hljs-keyword">for</span> (i = <span class="hljs-number">0</span>; i &lt; MEMSIZE - <span class="hljs-number">1</span> &amp;&amp; MemList[i].status != <span class="hljs-string">'e'</span>; i++)
      {
          <span class="hljs-keyword">if</span> (MemList[i].Size &gt;= request &amp;&amp; MemList[i].status == <span class="hljs-string">'f'</span>)
          {
              flag = <span class="hljs-number">1</span>;
              <span class="hljs-keyword">if</span> (MemList[i].Size &gt; k)
              {
                  k = MemList[i].Size;
                  j = i;
              }
          }
      }
      i = j;
      <span class="hljs-keyword">if</span> (flag == <span class="hljs-number">0</span>)
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"Not Enough Memory!\n"</span>);
          j = i;
      }
      <span class="hljs-function"><span class="hljs-keyword">else</span> <span class="hljs-title">if</span> <span class="hljs-params">(MemList[i].Size - request &lt;= MINSIZE)</span>
      </span>{
          MemList[i].status = <span class="hljs-string">'u'</span>;
      }
      <span class="hljs-keyword">else</span>
      {
          <span class="hljs-keyword">for</span> (j = MEMSIZE - <span class="hljs-number">2</span>; j &gt; i; j--)
          {
              MemList[j + <span class="hljs-number">1</span>] = MemList[j];
          }
          MemList[i + <span class="hljs-number">1</span>].start = MemList[i].start + request;
          MemList[i + <span class="hljs-number">1</span>].Size = MemList[i].Size - request;
          MemList[i + <span class="hljs-number">1</span>].status = <span class="hljs-string">'f'</span>;
          MemList[i].Size = request;
          MemList[i].status = <span class="hljs-string">'u'</span>;
      }
      Display();
  }

  <span class="hljs-comment">//释放一块内存</span>
  <span class="hljs-function"><span class="hljs-keyword">void</span> <span class="hljs-title">del_t</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> i, number;
      <span class="hljs-built_in">printf</span>(<span class="hljs-string">"\nplease input the NUMBER you want stop:\n"</span>);
      <span class="hljs-built_in">scanf</span>(<span class="hljs-string">"%d"</span>, &amp;number);
      <span class="hljs-comment">//输入的空间是使用的</span>
      <span class="hljs-keyword">if</span> (MemList[number].status == <span class="hljs-string">'u'</span>)
      {
          MemList[number].status = <span class="hljs-string">'f'</span>;          <span class="hljs-comment">//标志为空闲</span>
          <span class="hljs-keyword">if</span> (MemList[number + <span class="hljs-number">1</span>].status == <span class="hljs-string">'f'</span>) <span class="hljs-comment">//右侧空间为空则合并</span>
          {
              MemList[number].Size += MemList[number].Size;                          <span class="hljs-comment">//大小合并</span>
              <span class="hljs-keyword">for</span> (i = number + <span class="hljs-number">1</span>; i &lt; MEMSIZE - <span class="hljs-number">1</span> &amp;&amp; MemList[i].status != <span class="hljs-string">'e'</span>; i++) <span class="hljs-comment">//i后面的空间信息表元素后移</span>
              {
                  <span class="hljs-keyword">if</span> (i &gt; <span class="hljs-number">0</span>)
                  {
                      MemList[i] = MemList[i + <span class="hljs-number">1</span>];
                  }
              }
          }
          <span class="hljs-comment">//左测空间空闲则合并</span>
          <span class="hljs-keyword">if</span> (number &gt; <span class="hljs-number">0</span> &amp;&amp; MemList[number - <span class="hljs-number">1</span>].status == <span class="hljs-string">'f'</span>)
          {
              MemList[number - <span class="hljs-number">1</span>].Size += MemList[number].Size;
              <span class="hljs-keyword">for</span> (i = number; i &lt; MEMSIZE - <span class="hljs-number">1</span> &amp;&amp; MemList[i].status != <span class="hljs-string">'e'</span>; i++)
              {
                  MemList[i] = MemList[i + <span class="hljs-number">1</span>];
              }
          }
      }
      <span class="hljs-keyword">else</span>
      {
          <span class="hljs-built_in">printf</span>(<span class="hljs-string">"This Number is Not Exist or is Not Used！\n"</span>);
      }
      Display();
  }

  <span class="hljs-function"><span class="hljs-keyword">int</span> <span class="hljs-title">main</span><span class="hljs-params">()</span>
  </span>{
      <span class="hljs-keyword">int</span> x;
      InitMemList(); <span class="hljs-comment">//变量初始化</span>
      BadFit_new(); <span class="hljs-comment">//最坏适应算法</span>
      <span class="hljs-keyword">return</span> <span class="hljs-number">0</span>;
  }</code></pre>
</template>

<script>
export default {

}
</script>

<style>

</style>
