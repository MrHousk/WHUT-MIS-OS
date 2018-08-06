export let algorithmReview = [{
        "index": "processorSchedule",
        "defaultAlgorithm": "FCFS",
        "text": "处理机调度算法",
        "translation": "Processor Scheduling Algorithm",
        "review": ["在多道程序设计系统中，内存中有多道程序运行，他们相互争夺处理机这一重要的资源。处理机调度就是从就绪队列中，按照一定的算法选择一个进程并将处理机分配给它运行，以实现进程并发地执行。", "一般情况下，当占用处理机的进程因为某种请求得不到满足而不得不放弃CPU进入等待状态时，或者当时间片到，系统不得不将CPU分配给就绪队列中另一进程的时候，都要引起处理机调度。除此之外，进程正常结束、中断处理等也可能引起处理机的调度。因此，处理机调度是操作系统核心的重要组成部分，它的主要功能如下：", "（1）记住进程的状态，如进程名称、指令计数器、程序状态寄存器以及所有通用寄存器等现场信息，将这些信息记录在相应的进程控制块中。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（2）根据一定的算法，决定哪个进程能获得处理机，以及占用多长时间。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（3）收回处理机，即正在执行的进程因为时间片用完或因为某种原因不能再执行的时候，保存该进程的现场，并收回处理机。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;处理机调度的功能中，很重要的一项就是根据一定算法，从就绪队列中选出一个进程占用CPU运行。处理机调度的算法应该考虑调度公平性，及时性，快捷性以及可行性。"]
    },
    {
        "index": "banker",
        "defaultAlgorithm": "singleBanker",
        "text": "银行家算法",
        "translation": "Banker's Algorithm",
        "review": ["银行家算法也叫Dijkstra算法，是最具有代表性的避免死锁的算法之一。避免死锁即在资源动态分配的过程当中随时进行安全检查，防止系统进入不安全状态。银行家算法原本是为银行系统设计的，以确保银行在发放现金贷款时，不会发生不能满足所有客户需求的情况。在操作系统当中，基于同样的原理，银行家算法也可以用来避免死锁。", "在银行家算法当中，每个新进入的进程需要提前申明其所需每种资源的最大数目，且其数目不应超过系统所拥有的资源总量。当一个进程请求一组资源时，系统会先确定当前剩余资源是否满足要求，并检查若将这些资源分配之后，系统是否会处于不安全状态。如果条件均可被满足，才将资源分配给对应进程。", "在一个进程请求了一组新资源之后，系统会进行下述两步计算确定该请求是否可被满足。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（1）资源检查：系统首先会检查该进程当前资源数量加新请求数量之和是否超过其声明数量，若超过，则拒绝请求。若未超过，则会检查新请求的资源量是否小于系统当前剩余资源量，若不小于，则拒绝请求。当前两者都检查无误之后，系统会进行下一步的安全性检查。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（2）安全性检查：安全性检查即寻找本次资源分配后能够安全执行完全部进程的安全序列。系统会模拟以下操作：首先将新请求的资源预分配给对应进程，并寻找当前状态下可以顺利完成的进程，并释放该进程的全部资源，寻找下一条可顺利完成的进程，以此类推，直至全部进程均可完成，则认为寻找到安全序列，并将请求的资源真实分配给对应进程；而当某个时刻无法寻找到任意进程可以完成，则认为该状态不安全，拒绝该分配请求。"]
    },
    {
        "index": "memoryPartition",
        "defaultAlgorithm": "BF",
        "text": "内存分区分配算法",
        "translation": "Memory Partition Allocation",
        "review": ["用户程序要在系统中运行，必须先将它装入内存，为了能将用户程序装入内存，必须为其分配一定的内存空间。内存分配主要分为分页分区式和分段式管理方式。连续分配方式是最早出现的一种分页分区管理方式，连续分配可分为四类：单一连续分配、固定分区分配、动态分区分配、动态可重定位分区分配。", "单一连续分配是指将内存分为系统区和用户区两部分，系统区提供给OS使用，通常是低地址部分；用户区提供给用户程序使用，该程序独占内存。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定分区分配是指将用户空间划分为若干个大小固定的区域，每个分区中只装入一道作业，这形成了最早的，也是最简单的一种可运行多道程序的分区式存储管理方式。", "动态分区分配是指根据进程的实际需要，动态的分配内存空间（后面所示算法只针对动态分区分配）。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;动态可重定位分区分配是为了解决计算机运行了一段时间后，内存空间被分割成许多小分区这个问题的一种分区方法。为了将大作业装入内存，可以将内存中的小分区紧凑成一个大分区，而“紧凑”之后，原来在内存中的程序地址发生了变换，因此必须对移动了的程序和数据进行重定位。"]
    },
    {
        "index": "pageReplace",
        "defaultAlgorithm": "OPT",
        "text": "页面置换算法",
        "translation": "Page Replacement Algorithm",
        "review": ["内存是计算机中重要的部件之一，它是与CPU进行沟通的桥梁。计算机中所有程序的运行都是在内存中进行的，其用于暂时存放CPU中的运算数据，以及与硬盘等外部存储器交换的数据。", "由于计算机无法无限的扩充自身的内存，所以在地址映射过程中，若在页面中发现所要访问的页面不在内存中，则产生缺页中断。当发生缺页中断时，如果操作系统内存中没有空闲页面，则操作系统必须在内存选择一个页面将其移出内存，以便为即将调入的页面让出空间。而用来选择淘汰哪一页的规则叫做页面置换算法。", "以下三个算法是页面置换算法中最常用到的，也是在本课件系统中着重演示的算法：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 最佳置换算法（Optimal）<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 先进先出页面置换算法（FIFO）<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 最近最久未使用页面置换算法（LRU）除此之外，还包括：Clock置换算法，最近未使用页面置换算法，工作集算法，老化算法，第二次机会算法等等，有兴趣的同学可以自己访问互联网做进一步的了解。"]
    },
    {
        "index": "diskSchedule",
        "defaultAlgorithm": "FCFS",
        "text": "磁盘调度算法",
        "translation": "Disk Scheduling Algorithm",
        "review": ["磁盘是电脑主要的存储媒介之一，也是现代计算机最常用的外部存储器。其一般是由一个或者多个铝制或者玻璃制的碟片组成。碟片外覆盖有铁磁性材料，通过移动磁头至对应磁道，来实现对全盘数据的读取和写入操作。", "磁盘存储器是计算机系统中的最重要的存储设备，在其中存放了大量的文件。对文件的读、写操作都将涉及到对磁盘的访问。磁盘I/O速度的高低和磁盘系统的可靠性，将直接影响到系统的性能。优秀的磁盘调度算法对于改善提高磁盘系统的性能很有帮助。", "根据访问者指定的柱面位置来决定执行次序的调度，称为“移臂调度”。移臂调度的目的是尽可能地减少操作中的总寻找时间，即把磁臂(磁头)移动到指定磁道上所经历的时间之和。常用的移臂调度算法有先来先服务算法、最短寻找时间优先算法、电梯调度算法和单向扫描算法。"]
    },
    {
        "index": "encryptDecode",
        "defaultAlgorithm": "caesar",
        "text": "加密解密算法",
        "translation": "Encryption And Decryption",
        "review": ["加密（Encryption）是将明文信息转变为难以读取的密文内容，只有经由解密（Decryption）过程，密文转变为明文才能被正常读取。加密可以用于保证安全性。加密的方法称为加密算法，加密算法可以分为两类：对称加密和非对称加密。对称加密就是将信息使用一个密钥进行加密，解密时使用同样的密钥，同样的算法进行解密；非对称加密，又称公开密钥加密，是加密和解密使用不同密钥的算法，广泛用于信息传输中。", "常见的较为简洁的加密解密方法有：凯撒密码，字母倒排序，单表置换密码，维吉尼亚密码，以及转化加密算法等。这些算法使用方便，运算简洁，在一定程度上可以有效保证信息的保密和安全。", "说明：在所示的加密解密中，为了统一方便，部分加密会转换字母的大小写形式，并且加密会去掉非显示字符和空格、制表符，只处理字母。"]
    }
]