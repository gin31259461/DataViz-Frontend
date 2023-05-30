type GraphNode = {
  id: number;
  labels: string[];
};

type GraphEdge = {
  id: number;
  label: string | null;
  head: number;
  tail: number;
};

interface Graph {
  nodes: GraphNode[];
  edges: Record<string, GraphEdge>; // 使用字串作為鍵，例如 "node1_node2"
}

export function findPaths(graph: Graph, rootId: number = 0): number[][] {
  const paths: number[][] = [];

  function dfs(currentId: number, path: number[]): void {
    // 將目前節點加入路徑中
    path.push(currentId);

    const outgoingEdges = Object.values(graph.edges).filter(
      (edge) => edge.head === currentId,
    );

    if (outgoingEdges.length === 0) {
      // 如果目前節點沒有出邊（即為最底層節點），將路徑加入結果中
      paths.push([...path]);
    } else {
      // 遍歷目前節點的所有出邊
      for (const edge of outgoingEdges) {
        const nextId = edge.tail;

        // 遞迴呼叫深度優先搜索
        dfs(nextId, path);
      }
    }

    // 回溯，從路徑中移除目前節點
    path.pop();
  }

  dfs(rootId, []);

  return paths;
}
