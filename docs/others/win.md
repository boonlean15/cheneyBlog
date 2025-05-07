# windows相关

## window查看电脑网络密码
> 在Windows系统中，查看连接到无线网络的密码可以通过命令行工具或使用图形界面完成。以下是通过命令行查看Wi-Fi密码的方法：
> 在输出中，查找“关键内容”或“Key Content”字段，其中包含了网络的密码。
> 请注意，这种方法仅适用于Windows 8及更高版本。如果您使用的是Windows 7或更早版本，可能需要使用其他方法，如导出网络配置文件并查看相应的文本文件。
- netsh wlan show profiles 输入以下命令来查看保存的无线网络配置
- netsh wlan show profile name="network_name" key=clear 查看特定网络的密码。用网络名称替换network_name