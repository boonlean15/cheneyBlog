# 神经网络
点到线到点，而神经网络可以理解成点线的网络图，可以把点跟线理解为一些数字，而训练就是类似训练点到线应该是什么数字，以概率来输出
## PyTorch搭建二元语言模型
- def init 初始化方法
- def forward 前向传播
- def generate 生成序列 

## def forward前向传播
- logits得分
  > 把token输入给模型后，模型经过计算，预测可能是哪个词的概率分布，vocab_size是多少，logits的预测就是多少，比如输入“我爱”，输出“你”的概率就会大一些
- loss 损失：预期与实际的差异
  > logits与target的差异越小，loss越小。训练模型的目的，让模型预测的越来越准，loss越来越小

### 计算logits
```python
    def forward(self,idx,targets=None):
        logits = self.token_embedding_table(idx)
```
- idx是输入的token即分词，维度是(B,T) B:批次 T:一组词的分词数，组长度，例如：8个词
- 经过嵌套层，把idx变成logits，logits的维度是(B,T,C)
- C等于我们的词典大小，即vocab_size
- 随着神经网络的不断变化复杂，计算logits会不断加料，但C、vocab_size不变

### 计算loss
```python
    if targets is None: # 如果没有给定目标，直接返回logits
        loss = None
    else:
        # logits的形状，B:batch size,T:time steps,C:channel(vocab size)
        B,T,C = logits.shape
        # 调整logits形状，将B和T合并为一维
        logits = logits.view(B*T,C)
        # 调整targets的形状，使其与logits匹配
        targets = targets.view(B*T)
        # 使用交叉熵损失函数计算loss
        loss = F.cross_entropy(logits,targets)
    return logits,loss 
```

## def generate 生成
- 根据forward()返回的logits来预测下一个token
  - 首先去除最后一个token对应的logits
  - 使用Softmax和Multinomial会根据logits预测出下一个token
    - Softmax将logits转换为概率分布
    - Multinomial用于根据这个分布采样下一个token
  - 注意，目前的二元模型，最后一个词的logits仅与自己有关，目前只使用了一个嵌入层，和其他词汇无关
  - 后面transofmer，我们会让最后一个token的logits和其他词，以及自己的位置有关系

**即使神经网络不断变换，generate架构不变**
```python   
    # 生成序列方法，根据当前上下文idx生成max_new_tokens个新token
    def generate(self,idx,max_new_tokens):
        #循环生成max_new_tokens个新token
        for _in range(max_new_tokens):
            #根据当前的idx预测下一个token的logits
            logits,loss = self(idx)
            #取出最后一个时间步的logits
            logits = logits[:,-1,:]
            #对logits应用softmax获取概率分布，从而预测下一个token
            probs = F.softmax(logits,dim=-1)
            idx_next = torch.multinomial(props,num_samples=1)
            #将新生成的token索引添加到当前的idx序列中
            idx = torch.cat((idx,idx_next),dim=1)
        return idx
```
<img width="800" src="https://boonlean15.github.io/cheneyBlog/images/aiImg/2.png" alt="png">