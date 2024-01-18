# Springboot 常用note
## Restful风格get/post传参

- GET请求，指定参数的名称，然后可以取别名.不带@RequestParam则需参数名称一致
```java
// 访问地址: http://localhost:8080/restful/get/requestParamGET?id=111&name=oysept
@RequestMapping(value="/restful/get/requestParamGET", method = RequestMethod.GET)
@ResponseBody
public Result<String> requestParamGET(@RequestParam("id") String aaa, @RequestParam("name") String bbb) {
    String data = "aaa: " + aaa + ", bbb: " + bbb;
    return new Result<String>(CodeEnum.RESULT_CODE_SUCCESS, data);
}
```
- GET请求，把参数作为路径中的一部分传值
```java
// 访问地址: http://localhost:8080/restful/get/666/ouyangjun
@RequestMapping(value="/restful/get/{id}/{name}", method = RequestMethod.GET)
@ResponseBody
public Result<String> pathGET(@PathVariable("id") String aaa, @PathVariable("name") String bbb) {
    String data = "aaa: " + aaa + ", bbb: " + bbb;
    return new Result<String>(CodeEnum.RESULT_CODE_SUCCESS, data);
}
```
- GET方式，form表单传值 application/x-www-form-urlencoded
```java
@ApiOperation(value = "分页", notes = "分页", httpMethod = "GET")
@GetMapping(value = "/list")
public ResponseData<ServicePage<CustomRes>> list(CustomPropReq req){
    return alarservice.listPage(req);
}
```

- JSON方式，POST请求集合参数
```java
// json方式
// 访问地址: http://localhost:8080/restful/post/reqBodysParamsPOST
@RequestMapping(value="/restful/post/reqBodysParamsPOST", method = RequestMethod.POST)
@ResponseBody
public Result<List<String>> reqBodysParamsPOST(@RequestBody List<String> ids) {
    if (ids == null || ids.size()==0) {
        return new Result<List<String>>(CodeEnum.RESULT_CODE_FAIL, new ArrayList<String>());
    }
    return new Result<List<String>>(CodeEnum.RESULT_CODE_SUCCESS, ids);
}
```
- JSON方式，POST请求对象参数 如果需要校验则加上@Validated
```java
// json方式
// 访问地址: http://localhost:8080/restful/post/reqBodysObjectPOST
@RequestMapping(value="/restful/post/reqBodysObjectPOST", method = RequestMethod.POST)
@ResponseBody
public Result<ParamsVO> reqBodysObjectPOST(@RequestBody ParamsVO vo) {
    if (vo == null) {
        return new Result<ParamsVO>(CodeEnum.RESULT_CODE_FAIL, new ParamsVO());
    }
    return new Result<ParamsVO>(CodeEnum.RESULT_CODE_SUCCESS, vo);
}
```

- 重定向和请求转发
```java
package com.oysept.controller;
 
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
 
@Controller
public class LocationController {
    
    // 重定向地址
    @RequestMapping("/restful/returnMessage")
    @ResponseBody
    public String returnMessage () {
        return "测试重定向or请求转发, 返回message!";
    }
 
    // 测试请求转发地址: http://localhost:8080/restful/forward/req
    @RequestMapping("/restful/forward/req")
    public String forwardReq () {
        // 地址之间不能有空格
        return "forward:/restful/returnMessage";
    }
    
    // 测试重定向地址: http://localhost:8080/restful/redirect/req
    @RequestMapping("/restful/redirect/req")
    public String redirectReq () {
        // 地址之间不能有空格
        return "redirect:/restful/returnMessage";
    }
}
```

## 附件下载方式
- 导出excel
```java
/**
 * 导出excel
 * @param clazz
 * @param fileName
 * @param list
 * @param response
 * @throws Exception
 */
public static void exportExcel(Class clazz, String fileName, List<?> list, HttpServletResponse response) throws Exception {
    response.setContentType("application/vnd.ms-excel");
    response.setCharacterEncoding("utf-8");
    OutputStream os = response.getOutputStream();
    response.setHeader("Content-disposition", "attachment;filename=" +
            URLEncoder.encode(fileName, "utf-8") + ".xlsx");
    EasyExcel.write(os, clazz)
            .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy())
            .sheet(fileName)
            .doWrite(list);
}
```
- 导出csv
```java
public static <T> void exportCsvDataWithStrategyAndOrderColumn(OutputStream outputStream, Class<T> clazz, List<T> beans){
    try {
        OutputStreamWriter writer = new OutputStreamWriter(outputStream, "GBK");
        OrderColumnMappingStrategy strategy = new OrderColumnMappingStrategy(clazz);
        StatefulBeanToCsv<T> beanToCsv = new StatefulBeanToCsvBuilder<T>(writer).withMappingStrategy(strategy).build();
        beanToCsv.write(beans);
        writer.flush();
        writer.close();
    } catch (Exception e) {
        LogUtils.logStackTrace(log, e);
    }
}
```
- 导出文件classpath
```java
public static void exportTemplate(String filePath, String fileName, HttpServletResponse response) throws Exception {
    OutputStream outputStream = null;
    InputStream inputStream = null;
    try {
        ClassPathResource resource = new ClassPathResource(filePath);
        outputStream = generatorCsvOutputStream(fileName, response);
        inputStream = resource.getInputStream();
        int len = 0;
        byte[] buffer = new byte[1024];
        while ((len = inputStream.read(buffer)) > 0){
            outputStream.write(buffer,0,len);
        }
        outputStream.flush();
    } finally {
        try{
            if(outputStream != null){
                outputStream.close();
            }
            if(inputStream != null){
                inputStream.close();
            }
        }catch (Exception e){
            LogUtils.logStackTrace(log, e);
        }
    }
}
```

- 导出zip
```java
/**
 * 多个文件流压缩zip
 * @param inputStreamMap key:文件名，value:文件输入流
 * @param out
 * @throws RuntimeException
 */
public static void toZip(Map<String, InputStream> inputStreamMap , OutputStream out) throws RuntimeException {
    ZipOutputStream zos = null;
    try {
        zos = new ZipOutputStream(out);
        for(Map.Entry<String, InputStream> entry : inputStreamMap.entrySet()){
            byte[] buf = new byte[BUFFER_SIZE];
            zos.putNextEntry(new ZipEntry(entry.getKey()));
            int len;
            while ((len = entry.getValue().read(buf)) != -1){
                zos.write(buf, 0, len);
            }
            zos.closeEntry();
            entry.getValue().close();
        }
    } catch (Exception e) {
        throw new RuntimeException("zip error from ZipUtil",e);
    }finally{
        if(zos != null){
            try {
                zos.close();
            } catch (IOException e) {
                LogUtils.logStackTrace(log, e);
            }
        }
    }
}
```

