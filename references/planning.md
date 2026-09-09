# 叙事、模块与连接契约

## 先语义后布局

前馈方法适合横向或层叠流水线；共同输入下的比较适合并排对齐；递归方法需要回到真正消费更新状态的节点。不要为了画圆而创造循环。

模块表达动作，边表达传递内容。例如`Retrieve evidence`是模块动作，`Retrieved passages`是边的载荷。模型参数更新、控制指令和数据样本不是同一种东西。

视觉模块数不必等于算法步骤数。连续服务一个目的的步骤可合在一起，不要给每个函数或公式单独建模块。

## plan.md模板

```markdown
# [方法名] 图稿计划
核心命题：[一句话]
用途与最终阅读尺寸：[论文双栏、答辩等]
事实边界：[已有结果/拟议协议/示意]

模块：
- A：[输入] → [主要动作] → [输出]；采用[原始样例/精确几何/生成素材]。
- B：...

主关系：[顺序、分支和载荷]
次关系：[必要的控制/证据/反馈]
版式：[面积、主次、位置、走线通道]
素材与排版分工：[哪些生成，哪些精确绘制]
已认可并保留：[适用于迭代]
本轮修改：[当前范围]
制作顺序：[素材→模块检视→合版→精确连线→验收]
验收：[语义、阅读尺寸、端口、文字、输出格式]
```

## figure-spec.json示例

按任务扩展字段；以下检索生成例子不是固定模板。

```json
{
  "claim": "Retrieved evidence conditions answer generation.",
  "canvas": {"width": 2400, "height": 1200},
  "status": "method schematic",
  "modules": [
    {"id": "retrieve", "action": "Retrieve evidence", "input": "query", "output": "passages", "visual": "document excerpts"},
    {"id": "generate", "action": "Condition generation", "input": "query + passages", "output": "answer", "visual": "aligned context and output"}
  ],
  "edges": [
    {"id": "evidence-flow", "from": "#passages-out", "to": "#context-in", "payload": "retrieved passages", "kind": "primary"}
  ],
  "assets": [
    {"id": "excerpts", "source": "user-supplied", "status": "real specimen"},
    {"id": "context-visual", "source": "to-generate", "status": "illustrative"}
  ]
}
```

## 审图决策

|问题|处理|
|信息全但主线弱|按核心命题删去无关细节，突出主要关系|
|每块像一张小海报|每块只保留一个动作|
|上下两层重复|直观层展示现象，形式层解释原因，输出不重复|
|公式和方框撑满画布|补有信息的证据或几何表达，必要时缩小画布|
|箭头很多且交叉|先重新排列节点，再考虑折线路由|
|循环连回了错误对象|检查下一轮到底消费哪个状态/数据|
|改一处导致全图漂移|保留认可基线，只修改该层及其依赖|

主贡献的面积由内容决定，不锁定百分比。长反馈线走外围，局部关系优先短线。标签应避开转弯、分流和箭头头部，不能靠白底标签掩盖路由错误。
