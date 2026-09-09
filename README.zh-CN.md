# Modular Figure Design · 模块化论文图

**先讲清方法，再制作模块，最后精确合版与连线。**

一个面向科研方法图的 Codex Skill：把核心命题、素材制作、精确排版和验收拆开处理。默认采用克制的论文视觉语言，适用于不同研究领域。

[English](README.md) · [完整技能](SKILL.md) · [示例目录](examples/)

![制作流程](examples/workflow/figure.png)

## 值得保留的四件事

- **先定语义。** 每个模块表达一个动作，每条边说明传递什么。
- **按模块制作。** 真实样例保留原件；需要生成的视觉素材独立制作、局部修正。
- **精确元素单独排版。** 标题、公式、图例和跨模块箭头保持可编辑。
- **看最终渲染。** 检查阅读尺寸、端点、穿字和错误反馈对象。

这是指导智能体工作的技能，不是自动布局引擎。图像生成按需使用；附带脚本负责导出和机械检查，不能判断科研结论是否正确。

## 安装

已有同名目录时，请换一个位置检出并手动合并，避免覆盖个人改动。

```bash
git clone https://github.com/znxzsy/modular-figure-design.git \
  "${CODEX_HOME:-$HOME/.codex}/skills/modular-figure-design"
```

在新的 Codex 任务中使用 `$modular-figure-design`。使用技能本身不需要 Node 环境；HTML/SVG 导出脚本才需要 Node.js、Playwright 和 Chromium。

## 直接试一句

```text
用 $modular-figure-design 画我的方法：
查询先检索相关段落，原查询和检索段落共同输入生成模型，输出带引用的回答。
先保存图稿计划和连线规格，再继续完成图。
所有样例标为示意；文字和箭头保持可编辑。
交付 PNG、PDF、源稿与独立模块。
```

换成自己的方法时，提供输入输出、关键机制、主要贡献、已有素材和最终阅读尺寸即可。只需要计划就明确说“先只做计划”；修改已有图时说明需要保留的部分。

## 三个可复用例子

| 示例 | 要表达的关系 | 文件 |
| --- | --- | --- |
| 技能工作流 | 语义契约 → 模块制作 → 合版验收 | [源稿与提示词](examples/workflow/) |
| 检索增强生成 | 原查询旁路与检索证据共同进入生成节点 | [源稿与提示词](examples/retrieval/) |
| 教师—学生蒸馏 | 共同输入、分布比较、只更新学生 | [源稿与提示词](examples/distillation/) |

![检索增强生成](examples/retrieval/figure.png)

![知识蒸馏](examples/distillation/figure.png)

这些例子是原创 SVG 几何示意，没有调用图像生成模型，也不代表真实实验结果。蒸馏例子只展示核心关系，省略任务损失、温度等具体设定。它们展示不同连线结构；需要复杂视觉素材时，仍应按技能流程分模块生成。

每个示例包含计划、JSON 规格、图注、提示词、HTML/SVG、PNG/PDF、模块截图及机械检查报告。

## 复现导出

在仓库根目录运行：

```bash
npm ci
npx playwright install chromium
node scripts/render_review.cjs \
  --input examples/retrieval/figure.html \
  --out /tmp/modular-figure-review --width 1500 --height 480
```

工作流尺寸为 `1270 × 470`，蒸馏图为 `1250 × 630`。自定义依赖路径、标注契约和检查范围见 [合版说明](references/composition.md)。修改后以 HTML 作为渲染输入，同时同步独立 SVG。

检查通过不等于图已经合格：脚本只审核显式标注的 SVG 连线等机械条件，科研含义、位图内容和视觉质量仍需人工核验。混入位图的 PDF 也不能称为全矢量图。

欢迎贡献不同方法结构的完整示例，或提供可以复现的排版问题。请附输入、预期关系与预览，并标明素材来源。
