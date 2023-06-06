# rpc框架
## 总体思路
1. 第一步，先定义一个接口，这个接口就是客户端向服务端发起调用所使用的接口
```java
public interface EchoService {
    String echo(String request);
}
```
2. 在服务端实现这个RPC
```java
class EchoServiceImpl implements EchoService {
    public String echo(String request) {
        return "echo : " + request;
    }
}
```
3. 把这个接口发布到网络上
```java
public class RpcPublisher {
    public static void main(String args[]) {
        ObjectInputStream ois = null;
        ObjectOutputStream oos = null;
        Socket clientSocket = null;
        ServerSocket ss = null;
        try {
            ss = new ServerSocket(8081);
        } catch (IOException e) {
            e.printStackTrace();
        }
        while (true) {
            try {
                clientSocket = ss.accept();
                ois = new ObjectInputStream(clientSocket.getInputStream());
                oos = new ObjectOutputStream(clientSocket.getOutputStream());
                String serviceName = ois.readUTF();
                String methodName = ois.readUTF();
                Class<?>[] parameterTypes = (Class<?>[]) ois.readObject();
                Object[] parameters = (Object[]) ois.readObject();


                Class<?> service = Class.forName(serviceName);
                Method method = service.getMethod(methodName, parameterTypes);
                oos.writeObject(method.invoke(service.newInstance(), parameters));
            } catch (Exception e) {

            } finally {
                if (oos != null) {
                    try {
                        oos.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                if (ois != null) {
                    try {
                        ois.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                if (clientSocket != null) {
                    try {
                        clientSocket.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
```
> 逻辑比较简单，就是在8081端口等待客户端连接。有新的客户端连接进来的时候，就从客户端那里读取要调用的类名，方法名，然后通过反射找到并且调用这个方法，然后再把调用结果发送给客户端。
4. 客户端只知道调用echo接口
```java
public class Caller {
    public static void main(String args[]) {
        EchoService echo = (EchoService)Proxy.newProxyInstance(EchoService.class.getClassLoader(),
                new Class<?>[]{EchoService.class}, new DynamicProxyHandler());

        for (int i = 0; i < 3; i++) {
            System.out.println(echo.echo(String.valueOf(i)));
        }
    }
}
```
5. 使用动态代理来代替客户端与服务端通讯
```java
class DynamicProxyHandler implements InvocationHandler {
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Socket s = null;
        ObjectOutputStream oos = null;
        ObjectInputStream ois = null;

        try {
            s = new Socket();
            s.connect(new InetSocketAddress("localhost", 8081));
            oos = new ObjectOutputStream(s.getOutputStream());
            ois = new ObjectInputStream(s.getInputStream());

            oos.writeUTF("cn.hinus.rpc.EchoServiceImpl");
            oos.writeUTF(method.getName());
            oos.writeObject(method.getParameterTypes());
            oos.writeObject(args);

            return ois.readObject();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (s != null)
                s.close();

            if (ois != null)
                ois.close();

            if (oos != null)
                oos.close();
        }
        return null;
    }
}
```

## 通过netty重构rpc的网络访问方式
- 服务端
1. RpcServer netty的引导和启动，作为服务端 添加了RequestHandler
2. RequestHandler 用于数据的处理，最重要的是一点是：channelRead0的时候，执行了InvocationTask的run方法，就是对应方法的反射
3. InvocationTask，实现自Runable，run方法中执行反射，如果非异步通过channel写回方法执行结果
- 客户端
1. 