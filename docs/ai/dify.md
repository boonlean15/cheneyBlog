# Dify
Dify 是一款开源的大语言模型(LLM) 应用开发平台、它融合了后端即服务（Backend as Service）和 LLMOps 的理念，使开发者可以快速搭建生产级的生成式 AI 应用


## Dify创建应用的方式
- 基于应用模板创建 
  > 从已有的应用复制创建，相当于CV
- 创建空白应用
- 通过 DSL 文件（本地/在线）创建应用
  > DSL：Dify DSL 是由 Dify.AI 所定义的 AI 应用工程文件标准，文件格式为 YML
  >> 相当于应用模版，然后根据模版创建


## Dify应用的类型
- 聊天助手
  > 对话型应用采用一问一答模式与用户持续对话、使用场景：在客户服务、在线教育、医疗保健、金融服务等领域
- 文本生成应用
- Agent
- Chatflow
- Workflow  


## 聊天助手编排
对话型应用的编排支持：对话前提示词，变量，上下文，开场白和下一步问题建议。
> **针对聊天助手应用，对话前提示词是很重要的一个内容，提示词用于对 Al 的回复做出一系列指令和约束。可插入表单变量，例如 {{input}}。这段提示词不会被最终用户所看到。**

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/dify/1.jpg" alt="jpg"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/dify/2.jpg" alt="jpg"> 


## 工作流 chatflow workflow
工作流通过将复杂的任务分解成较小的步骤（节点）降低系统复杂度，减少了对提示词技术和模型推理能力的依赖，提高了 LLM 应用面向复杂任务的性能，提升了系统的可解释性、稳定性和容错性。
### 工作流的两种类型：Chatflow、Workflow
- Chatflow
  > 面向对话类情景，包括客户服务、语义搜索、以及其他需要在构建响应时进行多步逻辑的对话式应用程序。
  >> 为解决自然语言输入中用户意图识别的复杂性，Chatflow 提供了问题理解类节点**相对于 Workflow 增加了 Chatbot 特性的支持，如：对话历史（Memory）、标注回复、Answer 节点等。**
- Workflow
  > 面向自动化和批处理情景，适合高质量翻译、数据分析、内容生成、电子邮件自动化等应用程序。
  >> 为解决自动化和批处理情景中复杂业务逻辑，工作流提供了丰富的逻辑节点，**如代码节点、IF/ELSE 节点、模板转换、迭代节点等，除此之外也将提供定时和事件触发的能力，方便构建自动化流程。**
- Chatflow、Workflow应用类型差异
  - End 节点属于 Workflow 的结束节点，仅可在流程结束时选择
  - Answer 节点属于 Chatflow ，用于流式输出文本内容，并支持在流程中间步骤输出。
  - Chatflow 内置聊天记忆（Memory），用于存储和传递多轮对话的历史消息，可在 LLM 、问题分类等节点内开启，Workflow 无 Memory 相关配置，无法开启。
  - Chatflow 的开始节点内置变量包括：sys.query，sys.files，sys.conversation_id，sys.user_id。Workflow 的开始节点内置变量包括：sys.files，sys.user_id

- Chatflow、Workflow 交互路径
- - Chatflow
> 常见的交互路径：给出指令 → 生成内容 → 就内容进行多次讨论 → 重新生成结果 → 结束
>> 应用的特点在于支持对生成的结果进行多轮对话交互，调整生成的结果。
- - Workflow
> 常见的交互路径：给出指令 → 生成内容 → 结束
>> 该类型应用无法对生成的结果进行多轮对话交互


## 变量
变量作为一种动态数据容器，能够存储和传递不固定的内容，在不同的节点内被相互引用，实现信息在节点间的灵活通信

### 变量类型
#### 系统变量
系统级变量均以 sys 开头、**在 Chatflow / Workflow 应用内预设的系统级参数，可以被其它节点全局读取**
##### Chatflow
- sys.query             String          用户在对话框中初始输入的内容
- sys.files             Array[File]     用户在对话框内上传的图片        图片上传功能需在应用编排页右上角的"功能"处开启
- sys.dialogue_count    Number      用户在与Chatflow类型应用交互时的对话轮数。每轮对话后自动计数增加1，可以和if-else节点搭配处丰富的分支逻辑。例如到第X轮对话时，回顾历史对话并给出分析
- sys.conversation_id   String      对话框交互会话的唯一标识符，将所有相关的消息分组到同一个对话中，确保LLM针对同一个主题和上下文持续对话
- sys.user_id           String      分配给每个应用用户的唯一标识符，用以区分不同的对话用户  注意：Service API 不共享 WebApp 创建的对话。这意味着具有相同 ID 的用户在 API 和 WebApp 界面之间会有独立的对话历史。
- sys.app_id            String      应用 ID，系统会向每个 Workflow 应用分配一个唯一的标识符，用以区分不同的应用，并通过此参数记录当前应用的基本信息 面向具备开发能力的用户，通过此参数区分并定位不同的 Workflow 应用
- sys.workflow_id       String      Workflow ID，用于记录当前 Workflow 应用内所包含的所有节点信息   面向具备开发能力的用户，可以通过此参数追踪并记录 Workflow 内的包含节点信息
- sys.workflow_run_id   String      Workflow 应用运行 ID，用于记录 Workflow 应用中的运行情况    面向具备开发能力的用户，可以通过此参数追踪应用的历次运行情况
##### Workflow
- sys.files             Array[File]     文件参数，存储用户初始使用应用时上传的图片      图片上传功能需在应用编排页右上角的 “功能” 处开启
- sys.user_id           String          	用户 ID，每个用户在使用工作流应用时，系统会自动向用户分配唯一标识符，用以区分不同的对话用户
- sys.workflow_id       String      Workflow ID，用于记录当前 Workflow 应用内所包含的所有节点信息   面向具备开发能力的用户，可以通过此参数追踪并记录 Workflow 内的包含节点信息
- sys.workflow_run_id   String      Workflow 应用运行 ID，用于记录 Workflow 应用中的运行情况    面向具备开发能力的用户，可以通过此参数追踪应用的历次运行情况

#### 环境变量
**环境变量用于保护工作流内所涉及的敏感信息**，例如运行工作流时所涉及的 API 密钥、数据库密码等。它们被存储在工作流程中，而不是代码中，以便在不同环境中共享
- 支持以下三种数据类型
- - String 字符串
- - Number 数字
- - Secret 密钥
- 环境变量拥有以下特性：
- - 环境变量可在大部分节点内全局引用；
- - 环境变量命名不可重复；
- - 环境变量为只读变量，不可写入；

#### 会话变量
会话变量面向多轮对话场景，而 Workflow 类型应用的交互是线性而独立的，不存在多次对话交互的情况，因此**会话变量仅适用于 Chatflow 类型应用。**

**会话变量允许应用开发者在同一个 Chatflow 会话内，指定需要被临时存储的特定信息，并确保在当前工作流内的多轮对话内都能够引用该信息，**如上下文、上传至对话框的文件（即将上线）、 用户在对话过程中所输入的偏好信息等。好比为 LLM 提供一个可以被随时查看的”备忘录”，避免因 LLM 记忆出错而导致的信息偏差。

例如你可以将用户在首轮对话时输入的语言偏好存储至会话变量中，LLM 在回答时将参考会话变量中的信息，并在后续的对话中使用指定的语言回复用户。

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/dify/3.jpg" alt="jpg"> 

<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/dify/4.jpg" alt="jpg"> 

- 会话变量支持以下六种数据类型：
- - String
- - Number
- - Object 对象
- - Array[string] 字符串数组
- - Array[number] 数值数组
- - Array[object] 对象数组
- 会话变量具有以下特性：
- - 会话变量可在大部分节点内全局引用；
- - 会话变量的写入需要使用变量赋值节点；
- - 会话变量为可读写变量；







