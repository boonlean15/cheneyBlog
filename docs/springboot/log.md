# springboot log 日志
单独使用application.yml配置日志的内容，无法做到精细化管理日志，需要配合logback.xml 或 logback-spring.xml文件配置日志管理才可实现日志精细化管理

## logback.xml application.yml logback-spring.xml 加载顺序
logback.xml早于application.yml加载，logback-spring.xml晚于application.yml加载

## log 日志分割大小问题
当maxFileSize设置的太小了，logback"来不及切割"，会是的maxFileSize配置不生效，一般测试的话1KB比较难验证，1MB或10MB比如容易测试

## 相关标签作用说明
- property: 配置定义，其他标签可通过${}引用
```xml
<property name="logging.path" value="logs" />
<file>${logging.path}/${logging.file}-debug.log</file>
```
- appender: 定义打印组件
```xml
<!--输出到控制台-->
<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <Pattern>${CONSOLE_LOG_PATTERN}</Pattern>
        <charset>UTF-8</charset>
    </encoder>
</appender>
```
- logger: 配置特定包的日志级别
```xml
<!-- 配置特定包的日志级别 -->
<logger name="org.springframework" level="warn"/>
<logger name="net.maku" level="DEBUG"/>
```
- root: 定义根日志记录器
```xml
<!-- 定义根日志记录器 -->
<root level="INFO">
    <appender-ref ref="CONSOLE" />
    <appender-ref ref="DEBUG_FILE" />
    <appender-ref ref="INFO_FILE" />
    <appender-ref ref="WARN_FILE" />
    <appender-ref ref="ERROR_FILE" />
</root>
```
- filter: 控制日志输出到不同文件
  - level 拦截的日志级别
  - onMatch 匹配level后的处理方式
  - onMismatch 未匹配level后的处理方式
  - onMatch和onMismatch取值说明  
    - ACCEPT 日志会被立即处理，不再经过剩余过滤器，所有filter的onMatch使用
    - NEUTRAL 有序列表里的下个过滤器过接着处理日志，非最后一个filter的onMismatch使用
    - DENY 日志将立即被抛弃不再经过其他过滤器，最后一个filter的onMismatch使用
```xml
<filter class="ch.qos.logback.classic.filter.LevelFilter">
	<level>WARN</level>
	<onMatch>ACCEPT</onMatch>
	<onMismatch>NEUTRAL</onMismatch>
</filter>
```

## 不同的日志级别日志输出到不同的日志文件中
- 完整示例
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <contextName>logback-spring</contextName>

    <!-- 指定日志输出路径 -->
    <property name="logging.path" value="logs" />
    <property name="logging.file" value="maku" />

    <!-- 彩色日志依赖的渲染类 -->
    <conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter" />
    <conversionRule conversionWord="wex" converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter" />
    <conversionRule conversionWord="wEx" converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter" />
    <!-- 彩色日志格式 -->
    <property name="CONSOLE_LOG_PATTERN" value="${CONSOLE_LOG_PATTERN:-%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr(${PID:- }){magenta} %clr(---){faint} %clr([%15.15t]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>

    <!--输出到控制台-->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <Pattern>${CONSOLE_LOG_PATTERN}</Pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!--输出到文档-->
    <appender name="DEBUG_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文档的路径及文档名 -->
        <file>${logging.path}/${logging.file}-debug.log</file>
        <!--日志文档输出格式-->
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${logging.path}/%d{yyyy-MM-dd}/${logging.file}-debug.log.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>1MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>100MB</totalSizeCap>
        </rollingPolicy>
        <!-- 此日志文档只记录debug级别的 -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>debug</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${logging.path}/${logging.file}-info.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${logging.path}/%d{yyyy-MM-dd}/${logging.file}-info.log.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>1MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>100MB</totalSizeCap>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>info</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <appender name="WARN_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${logging.path}/${logging.file}-warn.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${logging.path}/%d{yyyy-MM-dd}/${logging.file}-warn.log.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>1MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>100MB</totalSizeCap>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>warn</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${logging.path}/${logging.file}-error.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${logging.path}/%d{yyyy-MM-dd}/${logging.file}-error.log.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>1MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>100MB</totalSizeCap>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="DEBUG_FILE" />
        <appender-ref ref="INFO_FILE" />
        <appender-ref ref="WARN_FILE" />
        <appender-ref ref="ERROR_FILE" />
    </root>

    <!-- 配置特定包的日志级别 -->
    <logger name="org.springframework" level="warn"/>
    <logger name="net.maku" level="DEBUG"/>

</configuration>
```

## 某个模块的日志单独输出到一个日志文件
- 示例
```xml
	<!-- 单独输出到一个日志文件 -->
	<appender name="SINGLE_FILE"
		class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${logging.path}/${logging.file}-single-info.log</file>
		<rollingPolicy
			class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
			<!--日志文件输出的文件名 -->
			<FileNamePattern>${logging.path}/%d{yyyy-MM-dd}/${logging.file}-single-info.log.%d{yyyy-MM-dd}.%i.gz
			</FileNamePattern>
			<!--日志文件保留天数 -->
			<MaxHistory>30</MaxHistory>
			<maxFileSize>10MB</maxFileSize>
            <totalSizeCap>100MB</totalSizeCap>
		</rollingPolicy>
		<encoder
			class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
			<pattern>${CONSOLE_LOG_PATTERN}</pattern>
            <charset>UTF-8</charset>
		</encoder>
	</appender>
    <!--该路径的日志文件单独按SINGLE_FILE的设置输出到另外的文件中-->
	<logger name="c.o.m.n" level="INFO" additivity="false">
        <appender-ref ref="SINGLE_FILE"/>
    </logger>
```