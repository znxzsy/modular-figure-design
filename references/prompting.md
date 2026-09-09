# 严谨论文素材的分模块生成

## 共享视觉约定

先确定线条、配色、字体、样例处理与几何语言，再用这组约束生成各模块。默认采用真实科学样例＋简化平面几何；不用卡通人物、玩具机器人、装饰齿轮、物理办公室和插画海报风。

不能仅写“高级CVPR”。要明确可见内容、留白、字体和模块动作。也不要在同一套图里无理由混用写实房间、卡通头像、透明3D网络和表格。

## 单模块提示词

```text
Asset: one rigorous CVPR paper method-figure insert, not a poster.
Purpose: [此模块唯一的主要动作].
Content: [输入的视觉形式] → [操作或状态] → [输出的视觉形式].
Style: thin consistent ink/gray lines, restrained flat fills, real scientific
       image snippets when needed, crisp typography, no decorative illustration.
Composition: [长宽比、主体比例、留白和证据位置].
Exact labels, if needed: [最少的必要文字].
Leave for final typesetting: panel titles, cross-module arrows, complex formulas.
Invariants: [不能改变的事实与对应关系].
Exclude: cartoon children, cute people, toy robots, decorative gears,
         office scenery, fabricated metrics and unrelated algorithm details.
Evidence status: illustrative / preserve provided originals in final layout.
```

不要同时要求“无文字”和十几个必写标签。必须逐像素保留的真实样例在最终排版中嵌入原件，不能依赖生成工具复刻。

## 局部编辑提示词

```text
Edit only [指定模块/元素].
Keep unchanged: [已认可的内容、画风、相对位置].
Change: [一个明确问题与目标].
Remove: [重复/错误内容].
Do not add: [容易出现的无关概念、额外文字、装饰].
```

同一模块的细小调整优先局部编辑；不因需要改尺寸就重新生成整张图。多个独立模块分别生成，跨模块箭头在合版时统一画。

## 模块检查

- 能看出计划中的动作，还是只有漂亮物件？
- 输入/输出、符号和配对关系是否正确？
- 真实样例与示意是否混淆？
- 是否擅自加入人物、指标、方法或输出？
- 与其他模块的线条、视角和配色是否一致？
- 缩小后保留下来的是否仍是主要信息？

生成文字和连线不可信时，局部编辑移除，再精确排版。不要用完全不同的主体替代已认可素材。

保存提示词、用途和来源。工具返回大data URL时不要作为文本打印base64；展示图像或只报告路径。用户项目的真实数据和内部指标留在项目，不打包进通用技能。
