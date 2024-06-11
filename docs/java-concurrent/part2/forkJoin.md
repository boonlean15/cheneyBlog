# fork/Join 分治任务
简单并行、AND聚合，批量并行、三种任务模型，基本上能覆盖日常工作的并发场景。但还有一个分治模型没有覆盖到，分治模型的使用非常广泛(归并排序、二分排序、快速排序、大数据MapReduce)
## 分治模型
> 把一个复杂问题分解成多个相似的子问题，然后再把子问题分解成更小的子问题，直到子问题简单到可以直接求解。
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/forkJoin/1.png" alt="png"> 
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/forkJoin/2.png" alt="png"> 
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/forkJoin/3.png" alt="png"> 

## Fork/Join 框架组成
java的ForkJoin计算框架主要有两部分
- ForkJoinPool 类似ThreadPoolExecutor
- ForkJoinTask 类似Runnable
## ForkJoinTask
- 主要方法有：
  - fork() 方法，异步执行一个子任务
  - join() 方法，阻塞当前线程来等待子任务的执行结果
- 子类
  - RecursiveAction  无返回值
    - compute()方法
  - RecursiveTask   有返回值
    - compute()方法
### Fork/Join实现斐波那契数列
```java
public static void main(String[] args){
    //创建分治任务线程池
    ForkJoinPool fjp = new ForkJoinPool(4);
    //创建分治任务
    Fibonacci fib = new Fibonacci(6);
    //1 1 2 3 5 8 13 21 34
    //1 1 2 3 5 8
    //启动分治任务
    Integer result = fjp.invoke(fib);
    //输出结果
    System.out.println(result);
}
static class Fibonacci extends RecursiveTask<Integer>{
    final int n;
    Fibonacci(int n){
        this.n = n;
    }
    protected Integer compute(){
        if (n <= 1)
            return n;
        Fibonacci f1 = new Fibonacci(n - 1);
        //创建子任务
        f1.fork();
        Fibonacci f2 = new Fibonacci(n - 2);
        //等待子任务结果，并合并结果
        return f2.compute() + f1.join();
    }
}
```
## ForkJoinPool 线程池
### ForkJoinPool本质也是一个生产者-消费者实现
- ForkJoinPool有多个任务队列，ThreadPoolExecutor内部是一个
- ForkJoinPool根据一定的路由规则把任务提交到一个任务队列中
- 任务执行过程中会创建出子任务，子任务会提交到工作线程对应的任务队列中，工作线程消费阻塞队列中的任务
- ForkJoinPool允许任务窃取(工作线程的任务队列空了，会去其他的工作线程中获取任务执行,是的工作线程不空闲)
- ForkJoinPool采用双端队列，工作线程正常获取任务和窃取任务分别从不同端获取，避免很多不必要的数据竞争
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/javaconcurrent/part2/forkJoin/4.png" alt="png"> 

### MapReduce 统计一个文件里面每个单词的数量
```java
public class MapReduceDemo {
    static void main(String[] args){
        String[] fc = {"hello world",
                "hello me",
                "hello fork",
                "hello join",
                "fork join in world"};
        //创建ForkJoin线程池    
        ForkJoinPool fjp = new ForkJoinPool(3);
        //创建任务    
        MR mr = new MR(fc, 0, fc.length);
        //启动任务    
        Map<String, Long> result = fjp.invoke(mr);
        //输出结果    
        result.forEach((k, v)-> System.out.println(k+":"+v));
    }
    //MR模拟类
    static class MR extends RecursiveTask<Map<String, Long>> {
        private String[] fc;
        private int start, end;
        //构造函数
        MR(String[] fc, int fr, int to){
            this.fc = fc;
            this.start = fr;
            this.end = to;
        }
        @Override protected
        Map<String, Long> compute(){
            if (end - start == 1) {
                return calc(fc[start]);
            } else {
                int mid = (start+end)/2;
                MR mr1 = new MR(fc, start, mid);
                mr1.fork();
                MR mr2 = new MR(fc, mid, end);
                //计算子任务，并返回合并的结果    
                return merge(mr2.compute(), mr1.join());
            }
        }
        //合并结果
        private Map<String, Long> merge(Map<String, Long> r1, Map<String, Long> r2) {
            Map<String, Long> result = new HashMap<>();
            result.putAll(r1);
            //合并结果
            r2.forEach((k, v) -> {
                Long c = result.get(k);
                if (c != null)
                    result.put(k, c+v);
                else
                    result.put(k, v);
            });
            return result;
        }
        //统计单词数量
        private Map<String, Long> calc(String line) {
            Map<String, Long> result = new HashMap<>();
            //分割单词    
            String [] words = line.split("\\s+");
            //统计单词数量    
            for (String w : words) {
                Long v = result.get(w);
                if (v != null)
                    result.put(w, v+1);
                else
                    result.put(w, 1L);
            }
            return result;
        }
    }
}
```