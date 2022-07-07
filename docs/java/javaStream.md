# java 输入与输出

## 输入输出流

- 分类 字节流和字符流
### InputStream 和 OutputStream 流过滤器

- 流家族拥有很多的分类的流
- 大部分的流都是对InputStream或者OutputStream的功能都拓展
- 使用方法：通过构造器构造的方式嵌套多个流，形成一个输入输出流过滤器
```java 
DataInputStream dis = new DataInputStream(new PushbackInputStream(new BufferInputStream(new FileInputStream("employee.txt"))));
``` 
  > 最外层的DataInputStream是我们想使用的拥有读取数据的流，嵌套的Pushback流指构造的这个流拥有回推的功能，依次类推。形成一个流过滤器

## 文本的输入与输出

**在保存数据时，可以选择以二进制格式或者文本的格式**

### 文本输出

- printWrite  
```java
  PrintWrite printWrite = new PrintWrite("employee.txt", "UTF-8");
```
- out.print("hello");会将hello字符输出到输出器out，然后这些字符会被转化成字节并最终写入到employee.txt文件中
- print方法不抛出异常。我们可以通过checkError方法来查看输出流是否出现了某些错误。
  > boolean checkError()
  > > 如果产生格式化或者输出错误，则返回true。一旦这个流碰到错误，它就会受到污染，并且对checkError的调用都将返回true
- printStream和printWrite的区别，现在printStream内部采用与printWrite相同的方式将unicode字符转换成默认主机编码方式。但printStream还有write(int)、write(byte[])方法输出原生字节
  
### 文本输入
- 最简单的处理文本输入的方式就是使用Scanner类，可以从任何输入流中构造Scanner类
```java
String str = new String(Files.readAllBytes(path),charset);
List<String> lines = Files.readAllLines(path,charset);
```
- 如果文件太大，可以惰性的处理为一个Stream<String>对象

```java
try(Stream<String> lines = Files.lines(path,charset)){}
```
- 早期java处理文本输入的唯一方式是通过BufferReader、现在BufferReader有了个lines方法，但是它不可以读入数字。
```java
InputStream ins = ...;
try(BufferReader bufferReader = new BufferReader(new InputStreamReader(inputStream,StandardCharserts.UTF_8))){
}
```

### 文本格式存储对象

- 比如通过把对象一个一个的属性写出到文本，用一定的方式分割属性。然后同样的，读入的时候，分割，设置给对象。
  
### 字符编码方式

输入输出流都作用于字节序列。那么操作字符时，就需要把字符编码成字节。例如：PrintWrite print = new PrintWrite("files.txt",StandardCharsets.UTF_8);
指明了编码方式，把字符编码成字节，然后输出到文本中。

- java针对字符使用的是UniCode标准。每个字符或编码点，都具有一个21位的整数。有多种不同的编码方式，即将这21位数字包装成字节的方式有多种。
- UTF_8
  > 将每个Unicode编码点编码成1-4个字节的序列。不存在高位和低位优先。好处是包含了英语中用到的所有字符，ASCII字符集中的每个字符只会占一个字节。
- UTF_16 java字符串中使用的编码方式
  > 将每个unicode编码点编码成1-2个字节的序列。存在高位优先和低位优先的方式。**为了表示哪种优先，会通过在文件开头通过字节顺序标记**
- 有些程序也会在UTF-8的编码方式中在开头标记，但是并不需要，UTF-8不存在字节顺序问题。但java中并没有这么做，以will not fix，不做修复处理。所以针对UTF-8存在前置标记的，最好的做法是将输入中发现的先导\uFEFF都剥离掉。

- 不指定任何编码方式的时候，有些方法会使用默认编码方式。有些会使用UTF-8，所以最好的方式就是指明编码。
  
## 读写二进制数据

### DataInput 和 DataOutput
在java中，所有的值都是按照高位在前的模式写出，不管使用何种处理器，使得java数据文件可以独立于平台。

- DataOutput writeUTF使用了修订版的8位Unicode转换格式写出字符串。与标准的UTF-8编码方式不同，Unicode码元序列首先用UTF-16表示，其结果之后使用UTF-8规则进行编码。是为了兼容Unicode还没有超过16位时构建的虚拟机。
- 如果需要编码生成字节码的程序，用于java虚拟机的字符串，那么使用writeUTF
- DataInput和DataOutput定义了以二进制格式读写数组、字符、boolean值和字符串的方法
- DataInputStream实现了DataInput接口，可以使用此方式从文件中读取数据
  > DataInputStream dataIn = new DataInputStream(new FileInputStream("employee.txt"));

### 随机访问文件

RandomAccessFile 可以在文件中的任意位置写入或者读取数据。
- RandomAccessFile 同时实现了DataInput和DataOutput接口
- 拥有DataInput和DataOutput的方法：readInt/writeInt,readChar/writeChar
- API
  > RandomAccessFile(String file, String mode) mode - 'r'、'rw' 代表读取或者读写，rws：每次更新时对数据和元数据的写磁盘操作都进行同步的读写 rwd：每次更新时只对数据的写磁盘操作进行同步的读写
  > RandomAccessFile(File file, String mode) file:要打开的文件 mode：代表模式
  > long getFilePointer() 返回文件指针的当前位置
  > void seek(long pos) 将指针设置到距离文件开头pos个字节处
  > long lenght() 返回文件按照字节来度量的长度

### Zip文档

zip文档通常以压缩格式存储了一个或多个文件，每个zip文档都有一个头，包含每个文件名字和压缩方式等信息。
- java中可以通过ZipInputStream读入zip文档
- zipEntry 描述这些项的对象
- getNextEntry 返回一个zipEntry
- zipInputStream 通过getInputStream(zipEntry) 获取用于读取zipEntry的输入流
- 调用closeEntry来读入下一项

- 通用的读取方法
```java
ZipInputStream zip = new ZipInputStream(new FileInputStream(zipName));
ZipEntry zipEntry;
while((zipEntry = zip.getNextEntry) != null){
  InputStream in = zip.getInputStream(zipEntry);
  read the contents of in
  zip.closeEntry();
}
zip.close;
```
- 通用的写出方法
```java
/**
 * Zip压缩工具类：支持压缩文件列表(包括压缩包)和文件夹
 *
 * @author chuenhung
 * @createTime 2022/06/08
 */
public class ZipUtil {

    private static final int BUFFER_SIZE = 2 * 1024;

    /**
     * @param srcFiles 需要压缩的文件列表
     * @param out 输出流
     * @throws RuntimeException 压缩失败会抛出运行时异常
     */
    public static void toZip(List<File> srcFiles ,OutputStream out) throws RuntimeException, FileNotFoundException {
        ZipOutputStream zos = null;
        try {
            zos = new ZipOutputStream(out);
            for (File srcFile : srcFiles) {
                byte[] buf = new byte[BUFFER_SIZE];
                zos.putNextEntry(new ZipEntry(srcFile.getName()));
                int len;
                FileInputStream in = new FileInputStream(srcFile);
                while ((len = in.read(buf)) != -1){
                    zos.write(buf, 0, len);
                }
                zos.closeEntry();
                in.close();
            }
        } catch (Exception e) {
            throw new RuntimeException("zip error from ZipUtil",e);
        }finally{
            if(zos != null){
                try {
                    zos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * @param srcFiles 需要压缩的文件列表
     * @param outDir 输出文件目录
     * @throws RuntimeException 压缩失败会抛出运行时异常
     */
    public static void toZip(List<File> srcFiles ,String outDir) throws RuntimeException, FileNotFoundException {
        OutputStream out = new FileOutputStream(new File(outDir));
        ZipOutputStream zos = null;
        try {
            zos = new ZipOutputStream(out);
            for (File srcFile : srcFiles) {
                byte[] buf = new byte[BUFFER_SIZE];
                zos.putNextEntry(new ZipEntry(srcFile.getName()));
                int len;
                FileInputStream in = new FileInputStream(srcFile);
                while ((len = in.read(buf)) != -1){
                    zos.write(buf, 0, len);
                }
                zos.closeEntry();
                in.close();
            }
        } catch (Exception e) {
            throw new RuntimeException("zip error from ZipUtil",e);
        }finally{
            if(zos != null){
                try {
                    zos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * @param outDirList 压缩文件夹路径
     * @param KeepDirStructure 是否保留原来的目录结构,
     * 			true:保留目录结构;
     *			false:所有文件跑到压缩包根目录下(注意：不保留目录结构可能会出现同名文件,会压缩失败)
     * @throws RuntimeException 压缩失败会抛出运行时异常
     */
    public static void toZip(List<String> outDirList, OutputStream out,
                             boolean KeepDirStructure) throws RuntimeException, Exception {

        ZipOutputStream zos = null;
        try {
            zos = new ZipOutputStream(out);
            List<File> sourceFileList = new ArrayList<>();
            for (String dir : outDirList) {
                File sourceFile = new File(dir);
                sourceFileList.add(sourceFile);
            }
            compress(sourceFileList, zos, KeepDirStructure);
        } catch (Exception e) {
            throw new RuntimeException("zip error from ZipUtil", e);
        } finally {
            if (zos != null) {
                try {
                    zos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    /**
     * 递归压缩方法
     * @param sourceFile 源文件
     * @param zos zip输出流
     * @param name 压缩后的名称
     * @param KeepDirStructure 是否保留原来的目录结构,
     * 			true:保留目录结构;
     *			false:所有文件跑到压缩包根目录下(注意：不保留目录结构可能会出现同名文件,会压缩失败)
     * @throws Exception
     */
    private static void compress(File sourceFile, ZipOutputStream zos,
                                 String name, boolean KeepDirStructure) throws Exception {
        byte[] buf = new byte[BUFFER_SIZE];
        if (sourceFile.isFile()) {
            zos.putNextEntry(new ZipEntry(name));
            int len;
            FileInputStream in = new FileInputStream(sourceFile);
            while ((len = in.read(buf)) != -1) {
                zos.write(buf, 0, len);
            }
            // Complete the entry
            zos.closeEntry();
            in.close();
        } else {
            File[] listFiles = sourceFile.listFiles();
            if (listFiles == null || listFiles.length == 0) {
                if (KeepDirStructure) {
                    zos.putNextEntry(new ZipEntry(name + "/"));
                    zos.closeEntry();
                }

            } else {
                for (File file : listFiles) {
                    if (KeepDirStructure) {
                        compress(file, zos, name + "/" + file.getName(),
                                KeepDirStructure);
                    } else {
                        compress(file, zos, file.getName(), KeepDirStructure);
                    }

                }
            }
        }
    }

    private static void compress(List<File> sourceFileList,
                                 ZipOutputStream zos, boolean KeepDirStructure) throws Exception {
        byte[] buf = new byte[BUFFER_SIZE];
        for (File sourceFile : sourceFileList) {
            String name = sourceFile.getName();
            if (sourceFile.isFile()) {
                zos.putNextEntry(new ZipEntry(name));
                int len;
                FileInputStream in = new FileInputStream(sourceFile);
                while ((len = in.read(buf)) != -1) {
                    zos.write(buf, 0, len);
                }
                zos.closeEntry();
                in.close();
            } else {
                File[] listFiles = sourceFile.listFiles();
                if (listFiles == null || listFiles.length == 0) {
                    if (KeepDirStructure) {
                        zos.putNextEntry(new ZipEntry(name + "/"));
                        zos.closeEntry();
                    }

                } else {
                    for (File file : listFiles) {
                        if (KeepDirStructure) {
                            compress(file, zos, name + "/" + file.getName(),
                                    KeepDirStructure);
                        } else {
                            compress(file, zos, file.getName(),
                                    KeepDirStructure);
                        }
                    }
                }
            }
        }
    }
}

```
API
- ZipInputStream
  - ZipInputStream(InputStream in) 创建一个从给定的in中读取数据的Zip输入流
  - ZipEntry getNextEntry() 为下一项返回一个ZipEntry，没下一项时返回null
  - void closeEntry() 关闭zip当前打开的项，之后可以通过getNextEntry获取下一项
- ZipOutputStream
  - void setLevel(int level) 设置后续的各个DEFLATED项的默认压缩级别 压缩级别从0 - 9
  - void setMethod(int method) 设置用于这个ZipOutputStream的默认压缩方法 DEFLATED 或 STORED
- ZipEntry
  - long getCrc() 获取zipEntry的CRC32校验和的值
  - long getSize() 获取entry压缩尺寸，如果未知，返回-1
  - boolean isDirectory() 返回这一项是否是目录
  - void setMethod(int method) DEFLATED 或 STROED
  - void setSize(long size) STORED时必须，这一项未压缩时尺寸
  - void setCrc(long crc) STORED时必须
- ZipFile
  - ZipFile(String name/File file) 创建一个zipFile，用于从给定项中读入数据
  - Enumeration entries() 返回一个Enumeration对象，枚举描述了这个zipFile的各个项ZipEntry对象
  - ZipEntry getEntry(String name) 返回给定名字所对应的项，没有时返回null
  - InputStream getInputStream(zipEntry) 返回给定项的输入流
  - String getName() 返回这个zip文件的路径

  
## 对象输入/输出流与序列化

### 保存和加载序列化对象
**序列化** - 每个对象都是用一个序列号保存的，因此称为对象序列化

- ObjectOutputStream和ObjectInputStream javaAPI里面帮我们设计好的用来读入对象和写出对象的序列化输入输出流
- 对象序列化的过程：每个对象对应一个序列号，如果第一次遇到，则保存其对象数据到流中，同样的读入对象则是一个相反的过程
- ObjectOutputStream(outputStream) 构造一个对象输出流
- void writeObject(object) 存储指定对象的类和类的签名，对象的非静态和非瞬时的域的值

### 理解对象序列化的文件格式
- 每个文件都以**魔幻数字**开始
- 对象流输出中包含所有对象的类型和数据域
- 每个对象都被赋予一个序列号
- 相同对象出现，将存储为对这个对象的序列号的引用

### 修改默认的序列化机制
**某些数据域是不可以序列化的，如本地方法的存储文件句柄**
- 通过transient标记不可以序列化的数据域，这些数据域属于不可序列化类，也用transient标记
- 可序列化类通过下面方式，数据域就不会在自动实现序列化.然后在私有的readObject和writeObject方法中定义自己想要的行为（**readOject/writeObject只能被序列化机制调用**）
  > 定义一下方法：private void readObject(ObjectInputStream in) throw IOException,ClassNotFondException;
                private void writeObject(ObjectOutputStream out) throw IOException;
- public void readExternalizable(ObjectInputStream in) throw IOException,ClassNotFoundException;
- public void writeExternalizable(ObjectOutputStream out) throw IOException;
- 上面两个方法对包括超类数据在内的整个对象的存储和恢复负全责
**readObject/writeObject负责序列化对象自生的数据域，readExternalizable/writeExternalizable对超类数据的存储恢复负责**           
- 读入可外部化数据时，对象输入流将用无参构造器构造一个对象，然后调用readExternalizable方法

### 序列化单例和类型安全的枚举
- 使用java语言的enum结构，就不用担心序列化
- 遗留代码，如果枚举的属性和构造方法都是private
```java
public class Orientation{
    public static final Orientation HORIZONTAL = new Orientation(1);
    public static final Orientation VERTICAL = new Orientation(2);
    private int value;
    private Orientation(int v){
        value = v;
    }
}
```
- 针对上面的遗留枚举情况，如果直接序列化，默认序列化机制不适用，需要实现readResolve方法
```java
protected Object readResolve() throws ObjectStreamException{
    if(value == 1) return Orientation.HORZONTAL;
    if(value == 2) return Orientation.VERTICAL;
    throw new ObjectStreamException();
}
```

### 序列化版本管理
- 一个类具有名为serialVersionUID的静态数据成员时，他就不再需有人工计算其指纹，而只需使用这个值
- 如果不同版本直接的序列化，针对一些多出来的数据域，对象输入输出流讲尽力转换成这个类当前的版本。
- 如增加了数据，那么读入是设置为null。输出时，忽略

### 为克隆使用序列化
- 序列化为克隆对象提供了一个简便的方法。只有类是可序列化的即可：将对象序列化到输出流中，然后将其读回。这样产生的新对象是对现有对象的一个深拷贝（deep clone）
- 想要得到clone方法，可以通过拓展serialCloneable类
```java
public class SerialCloneTest
{  
   public static void main(String[] args) throws CloneNotSupportedException
   {  
      Employee harry = new Employee("Harry Hacker", 35000, 1989, 10, 1);
      // clone harry
      Employee harry2 = (Employee) harry.clone();

      // mutate harry
      harry.raiseSalary(10);

      // now harry and the clone are different
      System.out.println(harry);
      System.out.println(harry2);
   }
}

/**
 * A class whose clone method uses serialization.
 */
class SerialCloneable implements Cloneable, Serializable
{  
   public Object clone() throws CloneNotSupportedException
   {
      try {
         // save the object to a byte array
         ByteArrayOutputStream bout = new ByteArrayOutputStream();
         try (ObjectOutputStream out = new ObjectOutputStream(bout))
         {
            out.writeObject(this);
         }

         // read a clone of the object from the byte array
         try (InputStream bin = new ByteArrayInputStream(bout.toByteArray()))
         {
            ObjectInputStream in = new ObjectInputStream(bin);
            return in.readObject();
         }
      }
      catch (IOException | ClassNotFoundException e)
      {  
         CloneNotSupportedException e2 = new CloneNotSupportedException();
         e2.initCause(e);
         throw e2;
      }
   }
}

/**
 * The familiar Employee class, redefined to extend the
 * SerialCloneable class. 
 */
class Employee extends SerialCloneable
{  
   private String name;
   private double salary;
   private LocalDate hireDay;

   public Employee(String n, double s, int year, int month, int day)
   {  
      name = n;
      salary = s;
      hireDay = LocalDate.of(year, month, day);
   }

   public String getName()
   {
      return name;
   }

   public double getSalary()
   {
      return salary;
   }

   public LocalDate getHireDay()
   {
      return hireDay;
   }

   /**
      Raises the salary of this employee.
      @byPercent the percentage of the raise
   */
   public void raiseSalary(double byPercent)
   {  
      double raise = salary * byPercent / 100;
      salary += raise;
   }

   public String toString()
   {  
      return getClass().getName()
         + "[name=" + name
         + ",salary=" + salary
         + ",hireDay=" + hireDay
         + "]";
   }
}
```

## 操作文件

文件管理的内涵远远要比读写要广，输入输出流关心的是文件内容的读写。而文件管理关心的是在磁盘上如何存储
- Paths
  - static Path get(String first, String...more) 连接给定的字符串创建一个路径
- Path
  - Path resolve(Path other)
  - Path resolve(String other) 如果other是绝对路径，则返回other，否则返回this和other的连接得到的路径
  - Path resolveSibling(Path other)
  - Path resolveSibling(String other) other是绝对路径就返回other，否则返回this的父目录和other连接的路径
  - Path relativize(Path other) this进行解析，返回other的相对路径
  - Path normalize() 移除. .. 的冗余路径
  - Path toAbsolutePath() 返回与该路径等价的绝对路径
  - Path getParent() 返回父目录，没有则返回null
  - Path getFileName() 返回该目录最后一个部件，没有则返回null
  - Path getRoot() 返回根目录，没有则返回null
  - toFile() 从该路径创建一个File对象
- File
  - Path toPath() 从该文件创建一个Path对象


