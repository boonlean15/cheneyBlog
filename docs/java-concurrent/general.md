# note

-  synchronized同步代码块不会释放获取到的互斥锁
-  synchronized关键字结合wait() notify() notifyall()可以实现等待-通知机制，其中wait()会阻塞并释放获取到的互斥锁