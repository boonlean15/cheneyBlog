# AQS分析
## CAS 
全称是Compare and swap 比较和替换，通过硬件实现并发安全的常用技术。
底层通过利用CPU的CAS指令对缓存或总线进行加锁来实现多处理器的原子操作。
- compareAndSetState 这个操作最终会调用 Unsafe 中的 API 进行 CAS 操作。
- 底层根据操作系统和处理器不同，选择对应调用代码。
  - 多处理器 带lock前缀的cmpxchg指令对缓存或总线加锁实现多处理器之间的原子操作
  - 单处理器 cmpxchg指令完成原子操作
- 3 个操作数 原理
  - 内存值 V，旧的预期值 E，要修改的新值 U
  - 仅当E和V 相同时，才将 V 修改为 U

### AbstractQueuedSynchronizer
#### AbstractQueuedSynchronizer state volatile属性
```java
    /**
     * The synchronization state.
     */
    private volatile int state;

    /**
     * Returns the current value of synchronization state.
     * This operation has memory semantics of a {@code volatile} read.
     * @return current state value
     */
    protected final int getState() {
        return state;
    }

    /**
     * Sets the value of synchronization state.
     * This operation has memory semantics of a {@code volatile} write.
     * @param newState the new state value
     */
    protected final void setState(int newState) {
        state = newState;
    }
        /**
     * Atomically sets synchronization state to the given updated
     * value if the current state value equals the expected value.
     * This operation has memory semantics of a {@code volatile} read
     * and write.
     *
     * @param expect the expected value
     * @param update the new value
     * @return {@code true} if successful. False return indicates that the actual
     *         value was not equal to the expected value.
     */
    protected final boolean compareAndSetState(int expect, int update) {
        // See below for intrinsics setup to support this
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
    }
```
- state属性是Lock实现unlock happens-before lock的一个重要属性(java内存模型的顺序性、volatile规则、传递性规则实现)
- compareAndSetState 这个操作最终会调用 Unsafe 中的 API 进行 CAS 操作。实现原子性修改state属性

## 如何保证lock和unlock的happens-before
-  volatile state属性，让线程1的unlock实现了happens-before 线程2的lock
-  ReentrantLock是可重入锁，如果是同一个线程lock多次，state的计数会++
-  lock的时候尝试获取锁，如果获取不到则阻塞进入waiting状态(内部通过LockSupport.park()实现)
-  unlock的时候，首先计数器state--，如果此时state==0，那么会释放锁(通过LockSupport.unpark()实现)，通过single通知等待获取锁队列中的线程

## Lock工具类(ReentrantLock)继承关系
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lockSource/1.png" alt="png"> 

## AbstractQueuedSynchronizer acquire release 具体实现
- acquire(int arg)
  - 内部调用了tryAcquire(arg)，tryAcquire实际调用实现类的方法，即FaireSync、NonFairSync、Sync；同时调用了acquireQueued()
```java
    /**
     * Acquires in exclusive mode, ignoring interrupts.  Implemented
     * by invoking at least once {@link #tryAcquire},
     * returning on success.  Otherwise the thread is queued, possibly
     * repeatedly blocking and unblocking, invoking {@link
     * #tryAcquire} until success.  This method can be used
     * to implement method {@link Lock#lock}.
     *
     * @param arg the acquire argument.  This value is conveyed to
     *        {@link #tryAcquire} but is otherwise uninterpreted and
     *        can represent anything you like.
     */
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```
- acquireQueued(final Node node, int arg) 
  - 方法调用了parkAndCheckInterrupt()，调用LockSupport.park()方法进入到waiting状态
```java
    /**
     * Acquires in exclusive uninterruptible mode for thread already in
     * queue. Used by condition wait methods as well as acquire.
     *
     * @param node the node
     * @param arg the acquire argument
     * @return {@code true} if interrupted while waiting
     */
    final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
                final Node p = node.predecessor();
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
    /**
     * Convenience method to park and then check if interrupted
     *
     * @return {@code true} if interrupted
     */
    private final boolean parkAndCheckInterrupt() {
        LockSupport.park(this);
        return Thread.interrupted();
    }
```
- release(int arg) 
  - 调用了unparkSuccessor()方法，unparkSuccessor内部调用了LockSupport.unpark()方法，从waiting转换到runnable状态
```java
    /**
     * Releases in exclusive mode.  Implemented by unblocking one or
     * more threads if {@link #tryRelease} returns true.
     * This method can be used to implement method {@link Lock#unlock}.
     *
     * @param arg the release argument.  This value is conveyed to
     *        {@link #tryRelease} but is otherwise uninterpreted and
     *        can represent anything you like.
     * @return the value returned from {@link #tryRelease}
     */
    public final boolean release(int arg) {
        if (tryRelease(arg)) {
            Node h = head;
            if (h != null && h.waitStatus != 0)
                unparkSuccessor(h);
            return true;
        }
        return false;
    }
    /**
     * Wakes up node's successor, if one exists.
     *
     * @param node the node
     */
    private void unparkSuccessor(Node node) {
        /*
         * If status is negative (i.e., possibly needing signal) try
         * to clear in anticipation of signalling.  It is OK if this
         * fails or if status is changed by waiting thread.
         */
        int ws = node.waitStatus;
        if (ws < 0)
            compareAndSetWaitStatus(node, ws, 0);

        /*
         * Thread to unpark is held in successor, which is normally
         * just the next node.  But if cancelled or apparently null,
         * traverse backwards from tail to find the actual
         * non-cancelled successor.
         */
        Node s = node.next;
        if (s == null || s.waitStatus > 0) {
            s = null;
            for (Node t = tail; t != null && t != node; t = t.prev)
                if (t.waitStatus <= 0)
                    s = t;
        }
        if (s != null)
            LockSupport.unpark(s.thread);
    }
```

### 获取锁流程
#### 概览
- AQS 的模板方法 acquire 通过调用子类自定义实现的 tryAcquire 获取锁
- 如果获取锁失败，通过 addWaiter 方法将线程构造成 Node 节点插入到同步队列队尾
- 在 acquirQueued 方法中以自旋的方法尝试获取锁，如果失败则判断是否需要将当前线程阻塞，如果需要阻塞则最终执行 LockSupport(Unsafe) 中的 native API 来实现线程阻塞
#### 代码分析
- addWaiter 获取锁失败的线程会被添加到一个等待队列的末端
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lockSource/2.png" alt="png"> 

- acquireQueued 不会立即挂起该节点中的线程，因此在插入节点的过程中，之前持有锁的线程可能已经执行完毕并释放锁，所以这里使用自旋再次去尝试获取锁。如果自旋操作还是没有获取到锁！那么就将该线程挂起
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lockSource/3.png" alt="png">

- 在 shouldParkAfterFailedAcquire 方法中会判读当前线程是否应该被挂起
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lockSource/4.png" alt="png">

### 释放锁流程
#### 概览
- tryRelease 方法尝试释放锁
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lockSource/5.png" alt="png">
- 调用 AQS 中的 unparkSuccessor 方法来实现释放锁的操作
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/lockSource/6.png" alt="png">

## 公平锁和非公平锁
- tryAcquire()对比nonfairTryAcquire()方法，多了一步!hasQueuedPredecessors()判断
- CPU随机分配某个线程拥有执行权，而公平锁会在tryAcquire时判断，如果node队列前面有节点，则会进入阻塞队列
- 非公平锁则是直接compareAndSetState，如果直接设置成功，那么当前线程则拥有锁。
- **公平和非公平是通过AbstractQueuedSynchronizer的实现类的tryAcquire方法实现的**






