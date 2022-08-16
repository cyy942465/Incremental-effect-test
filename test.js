// 数据准备
let data = {
  // 点集
  nodes: [],
  // 边集
  edges: []
};

// 配置颜色
const colors = [
  '#BDEFDB',
  '#FBE5A2',
  '#B9EDF8',
]; 

const strokes = [
  '#5AD8A6',
  '#F6BD16',
  '#39BAE8'
]


// 数据规模大小
let nodeSize = 1; 
let edgeSize = 0;
// 点击次数
let count = 1;

// 数据随机初始化
for (let i = 0; i < nodeSize; i++) {
  const id = `node-${i}`;
  data.nodes.push({
    id,
    label: i,
  });
}

for(let i = 0; i < edgeSize; i++) {
  data.edges.push({
    source: `node-${Math.round(Math.random() * (nodeSize - 1))}`,
    target: `node-${Math.round(Math.random() * (nodeSize - 1))}`
  });
}

console.log(data);

// 获取容器
const container = document.querySelector("#container");
const w = 1000;
const h = 500;

// 创建关系图
const graph = new G6.Graph({
  container: 'container',
  width: w,
  height: h,
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeSize: 15,
    center: [w / 2, h / 2],
    linkDistance: 20,
    nodeSpacing: 10
  },
  modes: {
    default: ['drag-node','zoom-canvas','drag-canvas'],
  },
  defaultNode: {
    size: 15,
  }
});

// 读取数据
graph.data(data);
// 渲染图
graph.render();

// 增量效果
// 增加的点
function addNodes(source,degree) {
  // 增加一度的点
  if(degree === 1) {
    data.nodes.push({
      id: `node-${nodeSize}`,
      label: `${nodeSize}`,
      style: {
        fill: `${colors[count - 1]}`,
        stroke: `${strokes[count - 1]}`
      }
    });
    // 增加相应的边
    addEdges(source,`node-${nodeSize}`);
    // 增加总结点数
    nodeSize ++;
  }
  // 增加2度的点
  else if(degree === 2) {
    //获取要添加结点的id并为源节点添加该节点
    let addId = `node-${nodeSize}`;
    addNodes(source,1);
    // 添加子节点
    for(let i = 0; i < 2; i++) {
      addNodes(addId,1);
    }
  }
  // 增加3度的点
  else if(degree === 3) {
    //获取要添加结点的id并为源节点添加该节点
    let addId = `node-${nodeSize}`;
    addNodes(source,1);
    // 添加子节点
    for(let i = 0; i < 3; i++) {
      addNodes(addId,1);
    }
  }
}

// 增加相应边
function addEdges(source,target) {
  data.edges.push({
    source: source,
    target: target
  });
}

// 更新点数据
function updateNodes(e) {
  const clickedNode = e.item;
  const sourceId = clickedNode.get('id');
  console.log(sourceId);
  // 更新点的个数
  let number = 0;
  if(count === 1) {
    number = Math.round(Math.random() * 10); // 随机获得小于10的数字,最少一个
    if(number === 0) {
      number = 1;
    }
  } else if(count === 2) {
    number = 10 + Math.round(Math.random() * 20); // 随机获得10-30的数字
  } else {
    count = 3;
    number = 30 + Math.round(Math.random() * 20); // 随机获得30-50的数字
  }

  // 添加节点
  for(let i = 0 ; i < number; i++) {
    let degree = Math.round( 1 + Math.random() * 2);// 随机获得1-3度
    addNodes(sourceId,degree);
  }

  count++;

  graph.data(data);
  graph.render();
}

graph.on('node:click',(e) => {
  // console.log(e);
  updateNodes(e);
});

// 拖动
function refreshDragedNodePosition(e) {
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}
graph.on('node:dragstart', (e) => {
  graph.layout();
  refreshDragedNodePosition(e);
});
graph.on('node:drag', (e) => {
  refreshDragedNodePosition(e);
});
if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
};
