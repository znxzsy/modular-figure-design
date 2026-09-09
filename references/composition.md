# 合版、端口与导出检查

## 合版职责

生成素材负责视觉证据或局部科学示意。标题、编号、公式、图例和跨模块箭头使用统一的可编辑排版层。HTML/SVG只是可用路径之一；既有Figma、LaTeX/TikZ或其他矢量源稿适合时继续使用。

先将模块放进版面，再由实际几何坐标定位连接端口。主线应从输入输出对象出发，不能只接到一个大框的附近。主线经过的空白通道先于装饰和辅助标签分配。

素材保留原件，裁剪仅用于取景，不改变其事实。用SVG/HTML放置原图不意味着应对图像进行像素级重绘。图像编辑按当前图像工具的要求执行。

## HTML/SVG可选标注契约

导出页只放一张图，`#figure`从页面原点开始；独立模块用`data-module`标记。模块可以是HTML或SVG元素。端口是有实际几何位置的小圆或透明锚点，名称反映载荷。

```html
<main id="figure">
  <svg width="800" height="500">
    <g data-module="retrieval">
      <!-- 在这里放检索模块内容，端口属于该模块 -->
      <circle id="passages-out" data-port cx="400" cy="300" r="3" />
    </g>
    <g data-module="generation">
      <!-- 在这里放生成模块内容，端口属于该模块 -->
      <circle id="context-in" data-port cx="600" cy="300" r="3" />
    </g>
    <path data-edge="evidence-flow"
          data-from="#passages-out" data-to="#context-in"
          d="M400 300H600" marker-end="url(#arrow)" />
  </svg>
</main>
```

端口应位于所属`data-module`元素内部，供检查器识别源/目标模块；连接路径可以在统一覆盖层。连接层只是视觉位置，不决定图的语义。`figure-spec.json`中的载荷、方向和节点角色需由作者核对。复杂路由自行设计；本脚本不会自动发明路线。

路径上的有意注记可用`data-route-label`标记，文字碰撞检查会跳过；不要用它掩盖应被发现的穿字错误。非定向关系可设`data-directed="false"`。普通生成素材不应伪装成可审计的SVG连线。

## 导出与机械检查

需要Node.js与Playwright。优先使用当前环境已有依赖；在Codex桌面可通过工作区依赖工具寻找路径。脚本不内置任何用户目录、浏览器安装路径、网络凭证或项目数据。

```bash
node scripts/render_review.cjs \
  --input /absolute/output/figure.html \
  --out /absolute/output/review \
  --width 2400 --height 1200 \
  --playwright-module /absolute/node_modules/playwright \
  --browser /absolute/browser-executable
```

`--playwright-module`和`--browser`可省略，分别使用Node可解析的Playwright和其默认Chromium。`--tolerance`默认为8个CSS像素。脚本导出`figure.png`、`figure.pdf`、`modules/*.png`和`review.json`。

检查内容：位图加载、图框原点、模块及文字越界、端口存在与起终点距离、定向路径箭头、主线穿字和穿过无关模块。没有标注的路径不会被宣称已验证。失败也保留输出供修复，退出码为2；运行错误为1。

只有在布局已经确定时运行导出。脚本不会转换成全矢量插图，也不能检查位图里的假文字、错误箭头、科学语义或审美。

## 人工视觉核验

1. 缩小到实际使用尺寸后，先辨认主线与贡献，再读细节。读不清就减内容或重新分配面积，而非只加分辨率。
2. 从每个输入沿线追踪到输出。分支应有明确条件，合流应有共同产物，反馈应落到正确消费者。
3. 查看高密度区域：公式、下标、栅格样例、标签、条件门、返回线拐点。
4. 生成素材和精确文字的风格一致，真实样例标签可信；不重复上下两层的机制解释。
5. 修改布局或字体后重算端口，再检查受影响路线。
