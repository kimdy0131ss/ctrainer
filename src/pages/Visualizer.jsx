import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './Visualizer.module.css'

/* ── 알고리즘 코드 스니펫 ── */
const CODE_SNIPPETS = {
  bfs: {
    python: [
      { text: 'from collections import deque', type: 'dim' },
      { text: '' },
      { text: 'def bfs(grid, start, end):' },
      { text: '    queue = deque([start])', phase: 'init' },
      { text: '    visited = {start}',      phase: 'init' },
      { text: '    prev = {}',              phase: 'init' },
      { text: '' },
      { text: '    while queue:',           phase: 'loop' },
      { text: '        node = queue.popleft()', phase: 'dequeue' },
      { text: '        if node == end:',       phase: 'check' },
      { text: '            return build_path(prev, end)', phase: 'found' },
      { text: '        for nb in neighbors(node):',       phase: 'neighbor' },
      { text: '            if nb not in visited:',        phase: 'filter' },
      { text: '                visited.add(nb)',          phase: 'enqueue' },
      { text: '                prev[nb] = node',          phase: 'enqueue' },
      { text: '                queue.append(nb)',         phase: 'enqueue' },
      { text: '    return []  # 경로 없음',   phase: 'done' },
    ],
    cpp: [
      { text: '#include <queue>', type: 'dim' },
      { text: '#include <unordered_set>', type: 'dim' },
      { text: '' },
      { text: 'vector<Node> bfs(Grid& grid, Node start, Node end) {' },
      { text: '    queue<Node> q;',         phase: 'init' },
      { text: '    q.push(start);',         phase: 'init' },
      { text: '    unordered_set<Node> visited = {start};', phase: 'init' },
      { text: '    map<Node,Node> prev;',   phase: 'init' },
      { text: '' },
      { text: '    while (!q.empty()) {',  phase: 'loop' },
      { text: '        Node node = q.front(); q.pop();', phase: 'dequeue' },
      { text: '        if (node == end)',   phase: 'check' },
      { text: '            return build_path(prev, end);', phase: 'found' },
      { text: '        for (Node nb : neighbors(node)) {', phase: 'neighbor' },
      { text: '            if (!visited.count(nb)) {',    phase: 'filter' },
      { text: '                visited.insert(nb);',      phase: 'enqueue' },
      { text: '                prev[nb] = node;',         phase: 'enqueue' },
      { text: '                q.push(nb);',              phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return {};  // 경로 없음', phase: 'done' },
      { text: '}' },
    ],
    js: [
      { text: 'function bfs(grid, start, end) {' },
      { text: '    const queue = [start];',   phase: 'init' },
      { text: '    const visited = new Set([String(start)]);', phase: 'init' },
      { text: '    const prev = new Map();',  phase: 'init' },
      { text: '' },
      { text: '    while (queue.length) {',  phase: 'loop' },
      { text: '        const node = queue.shift();', phase: 'dequeue' },
      { text: '        if (isEnd(node, end))', phase: 'check' },
      { text: '            return buildPath(prev, end);', phase: 'found' },
      { text: '        for (const nb of neighbors(node)) {', phase: 'neighbor' },
      { text: '            const key = String(nb);', phase: 'filter' },
      { text: '            if (!visited.has(key)) {', phase: 'filter' },
      { text: '                visited.add(key);',   phase: 'enqueue' },
      { text: '                prev.set(key, node);', phase: 'enqueue' },
      { text: '                queue.push(nb);',     phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return [];  // 경로 없음', phase: 'done' },
      { text: '}' },
    ],
  },
  dfs: {
    python: [
      { text: 'def dfs(grid, start, end):' },
      { text: '    stack = [start]',        phase: 'init' },
      { text: '    visited = {start}',      phase: 'init' },
      { text: '    prev = {}',              phase: 'init' },
      { text: '' },
      { text: '    while stack:',           phase: 'loop' },
      { text: '        node = stack.pop()', phase: 'dequeue' },
      { text: '        if node == end:',    phase: 'check' },
      { text: '            return build_path(prev, end)', phase: 'found' },
      { text: '        for nb in neighbors(node):',       phase: 'neighbor' },
      { text: '            if nb not in visited:',        phase: 'filter' },
      { text: '                visited.add(nb)',          phase: 'enqueue' },
      { text: '                prev[nb] = node',          phase: 'enqueue' },
      { text: '                stack.append(nb)',         phase: 'enqueue' },
      { text: '    return []  # 경로 없음', phase: 'done' },
    ],
    cpp: [
      { text: '#include <stack>', type: 'dim' },
      { text: '' },
      { text: 'vector<Node> dfs(Grid& grid, Node start, Node end) {' },
      { text: '    stack<Node> s;',         phase: 'init' },
      { text: '    s.push(start);',         phase: 'init' },
      { text: '    unordered_set<Node> visited = {start};', phase: 'init' },
      { text: '    map<Node,Node> prev;',   phase: 'init' },
      { text: '' },
      { text: '    while (!s.empty()) {',  phase: 'loop' },
      { text: '        Node node = s.top(); s.pop();', phase: 'dequeue' },
      { text: '        if (node == end)',   phase: 'check' },
      { text: '            return build_path(prev, end);', phase: 'found' },
      { text: '        for (Node nb : neighbors(node)) {', phase: 'neighbor' },
      { text: '            if (!visited.count(nb)) {',    phase: 'filter' },
      { text: '                visited.insert(nb);',      phase: 'enqueue' },
      { text: '                prev[nb] = node;',         phase: 'enqueue' },
      { text: '                s.push(nb);',              phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return {};  // 경로 없음', phase: 'done' },
      { text: '}' },
    ],
    js: [
      { text: 'function dfs(grid, start, end) {' },
      { text: '    const stack = [start];',   phase: 'init' },
      { text: '    const visited = new Set([String(start)]);', phase: 'init' },
      { text: '    const prev = new Map();',  phase: 'init' },
      { text: '' },
      { text: '    while (stack.length) {',  phase: 'loop' },
      { text: '        const node = stack.pop();', phase: 'dequeue' },
      { text: '        if (isEnd(node, end))',      phase: 'check' },
      { text: '            return buildPath(prev, end);', phase: 'found' },
      { text: '        for (const nb of neighbors(node)) {', phase: 'neighbor' },
      { text: '            const key = String(nb);',  phase: 'filter' },
      { text: '            if (!visited.has(key)) {', phase: 'filter' },
      { text: '                visited.add(key);',    phase: 'enqueue' },
      { text: '                prev.set(key, node);', phase: 'enqueue' },
      { text: '                stack.push(nb);',      phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return [];  // 경로 없음', phase: 'done' },
      { text: '}' },
    ],
  },
  dijkstra: {
    python: [
      { text: 'import heapq', type: 'dim' },
      { text: '' },
      { text: 'def dijkstra(grid, start, end):' },
      { text: '    heap = [(0, start)]',   phase: 'init' },
      { text: '    dist = {start: 0}',     phase: 'init' },
      { text: '    prev = {}',             phase: 'init' },
      { text: '' },
      { text: '    while heap:',           phase: 'loop' },
      { text: '        cost, node = heapq.heappop(heap)', phase: 'dequeue' },
      { text: '        if node == end:',   phase: 'check' },
      { text: '            return build_path(prev, end)', phase: 'found' },
      { text: '        for nb, w in weighted_neighbors(node):', phase: 'neighbor' },
      { text: '            new_cost = cost + w',           phase: 'filter' },
      { text: '            if new_cost < dist.get(nb, inf):', phase: 'filter' },
      { text: '                dist[nb] = new_cost',       phase: 'enqueue' },
      { text: '                prev[nb] = node',           phase: 'enqueue' },
      { text: '                heapq.heappush(heap, (new_cost, nb))', phase: 'enqueue' },
      { text: '    return []  # 경로 없음', phase: 'done' },
    ],
    cpp: [
      { text: '#include <queue>', type: 'dim' },
      { text: '' },
      { text: 'vector<Node> dijkstra(Grid& grid, Node start, Node end) {' },
      { text: '    priority_queue<pair<int,Node>,', phase: 'init' },
      { text: '        vector<...>, greater<...>> pq;', phase: 'init' },
      { text: '    pq.push({0, start});',  phase: 'init' },
      { text: '    map<Node,int> dist = {{start, 0}};', phase: 'init' },
      { text: '    map<Node,Node> prev;',  phase: 'init' },
      { text: '' },
      { text: '    while (!pq.empty()) {', phase: 'loop' },
      { text: '        auto [cost, node] = pq.top(); pq.pop();', phase: 'dequeue' },
      { text: '        if (node == end)',  phase: 'check' },
      { text: '            return build_path(prev, end);', phase: 'found' },
      { text: '        for (auto [nb, w] : weighted_neighbors(node)) {', phase: 'neighbor' },
      { text: '            int nc = cost + w;', phase: 'filter' },
      { text: '            if (!dist.count(nb) || nc < dist[nb]) {', phase: 'filter' },
      { text: '                dist[nb] = nc;', phase: 'enqueue' },
      { text: '                prev[nb] = node;', phase: 'enqueue' },
      { text: '                pq.push({nc, nb});', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return {};', phase: 'done' },
      { text: '}' },
    ],
    js: [
      { text: 'function dijkstra(grid, start, end) {' },
      { text: '    const pq = new MinHeap();',  phase: 'init' },
      { text: '    pq.push({ cost: 0, node: start });', phase: 'init' },
      { text: '    const dist = new Map([[key(start), 0]]);', phase: 'init' },
      { text: '    const prev = new Map();',    phase: 'init' },
      { text: '' },
      { text: '    while (!pq.isEmpty()) {',   phase: 'loop' },
      { text: '        const { cost, node } = pq.pop();', phase: 'dequeue' },
      { text: '        if (isEnd(node, end))', phase: 'check' },
      { text: '            return buildPath(prev, end);', phase: 'found' },
      { text: '        for (const { nb, w } of weightedNeighbors(node)) {', phase: 'neighbor' },
      { text: '            const nc = cost + w;', phase: 'filter' },
      { text: '            if (nc < (dist.get(key(nb)) ?? Infinity)) {', phase: 'filter' },
      { text: '                dist.set(key(nb), nc);', phase: 'enqueue' },
      { text: '                prev.set(key(nb), node);', phase: 'enqueue' },
      { text: '                pq.push({ cost: nc, node: nb });', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return [];', phase: 'done' },
      { text: '}' },
    ],
  },
}

/* ── 개념 설명 데이터 ── */
const CONCEPTS = {
  bfs: {
    name: '너비 우선 탐색',
    eng: 'Breadth-First Search',
    abbr: 'BFS',
    color: '#2dd4bf',
    tagline: '가까운 곳부터 차례로 — 층별로 퍼져나가는 탐색',
    summary:
      '시작 노드에서 출발해 인접한 노드들을 먼저 모두 방문한 뒤, 그 다음 층으로 넘어갑니다. ' +
      '물에 돌을 던졌을 때 파문이 동심원으로 퍼지는 것과 같은 원리입니다.',
    structure: '큐 (Queue, FIFO)',
    structureDesc: '먼저 넣은 노드를 먼저 꺼냄 → 층별 탐색',
    steps: [
      { icon: '①', text: '시작 노드를 큐에 넣고, 방문 처리한다.' },
      { icon: '②', text: '큐에서 노드를 하나 꺼낸다.' },
      { icon: '③', text: '해당 노드의 인접 노드 중 방문하지 않은 것을 모두 큐에 넣고 방문 처리한다.' },
      { icon: '④', text: '큐가 빌 때까지 ②~③을 반복한다.' },
    ],
    props: [
      { label: '시간 복잡도', value: 'O(V + E)', desc: '모든 정점·간선을 한 번씩 탐색' },
      { label: '공간 복잡도', value: 'O(V)',     desc: '큐에 최대 V개의 노드 저장' },
      { label: '최단 경로',   value: '보장',     desc: '가중치 없는 그래프에서 반드시 최단 경로 발견', good: true },
      { label: '완전성',      value: '완전',     desc: '해가 존재하면 반드시 찾음', good: true },
    ],
    useCases: [
      '최단 경로 탐색 (미로, 지도)',
      '소셜 네트워크에서 최소 연결 단계',
      '레벨별 트리 순회',
      '네트워크 브로드캐스트',
    ],
    caution: 'DFS보다 메모리를 많이 사용할 수 있습니다. 큐에 많은 노드가 쌓이기 때문입니다.',
  },
  dfs: {
    name: '깊이 우선 탐색',
    eng: 'Depth-First Search',
    abbr: 'DFS',
    color: '#a78bfa',
    tagline: '한 길을 끝까지 — 막히면 되돌아오는 탐색',
    summary:
      '시작 노드에서 출발해 한 방향으로 갈 수 있는 끝까지 내려간 뒤, 막히면 되돌아와 다른 방향을 탐색합니다. ' +
      '미로를 탐색할 때 오른쪽 벽을 짚고 끝까지 가는 전략과 같습니다.',
    structure: '스택 (Stack, LIFO) 또는 재귀',
    structureDesc: '나중에 넣은 노드를 먼저 꺼냄 → 깊이 우선 탐색',
    steps: [
      { icon: '①', text: '시작 노드를 스택에 넣고, 방문 처리한다.' },
      { icon: '②', text: '스택에서 노드를 하나 꺼낸다.' },
      { icon: '③', text: '해당 노드의 방문하지 않은 인접 노드를 스택에 넣고 방문 처리한다.' },
      { icon: '④', text: '스택이 빌 때까지 ②~③을 반복한다.' },
    ],
    props: [
      { label: '시간 복잡도', value: 'O(V + E)', desc: '모든 정점·간선을 한 번씩 탐색' },
      { label: '공간 복잡도', value: 'O(V)',     desc: '스택 깊이는 최대 V' },
      { label: '최단 경로',   value: '미보장',   desc: '최단 경로를 찾지 못할 수 있음', good: false },
      { label: '완전성',      value: '무한 그래프 주의', desc: '무한 그래프에서는 빠져나오지 못할 수 있음', good: false },
    ],
    useCases: [
      '경로 존재 여부 판별',
      '사이클 탐지',
      '위상 정렬',
      '백트래킹 (순열, 조합, N-Queen)',
      '연결 요소 개수 세기',
    ],
    caution: '최단 경로를 보장하지 않습니다. 경로의 "존재 여부"만 확인할 때 적합합니다.',
  },
  dijkstra: {
    name: '다익스트라',
    eng: "Dijkstra's Algorithm",
    abbr: 'Dijkstra',
    color: '#fbbf24',
    tagline: '가장 가까운 것부터 — 누적 비용이 최소인 경로 탐색',
    summary:
      '출발 노드에서 각 노드까지의 최단 거리를 기록하며, 아직 확정되지 않은 노드 중 가장 비용이 낮은 것부터 처리합니다. ' +
      'BFS의 "층별 탐색"을 가중치가 있는 그래프로 확장한 알고리즘입니다.',
    structure: '우선순위 큐 (Min-Heap)',
    structureDesc: '누적 비용이 가장 낮은 노드를 먼저 꺼냄',
    steps: [
      { icon: '①', text: '시작 노드의 비용을 0, 나머지는 무한대(∞)로 초기화한다.' },
      { icon: '②', text: '비용이 가장 낮은 미확정 노드를 우선순위 큐에서 꺼낸다.' },
      { icon: '③', text: '인접 노드까지의 새 비용 = 현재 비용 + 간선 가중치를 계산한다.' },
      { icon: '④', text: '새 비용이 기존보다 낮으면 업데이트(Relaxation)하고 큐에 넣는다.' },
      { icon: '⑤', text: '큐가 빌 때까지 ②~④를 반복한다.' },
    ],
    props: [
      { label: '시간 복잡도', value: 'O((V+E) log V)', desc: '우선순위 큐 사용 기준' },
      { label: '공간 복잡도', value: 'O(V)',            desc: '거리 배열 및 큐' },
      { label: '최단 경로',   value: '보장',            desc: '음수 가중치가 없을 때 최단 경로 보장', good: true },
      { label: '음수 간선',   value: '불가',            desc: '음수 가중치가 있으면 벨만-포드를 사용해야 함', good: false },
    ],
    useCases: [
      '지도 앱의 최단 경로 (내비게이션)',
      '네트워크 라우팅 프로토콜 (OSPF)',
      '가중치 그래프에서의 최단 경로',
    ],
    caution: '음수 가중치가 있는 그래프에서는 동작하지 않습니다. 벨만-포드 알고리즘을 사용하세요.',
  },
}

// 애니메이션 단계 → 코드 phase 매핑
const STEP_PHASES = ['loop', 'dequeue', 'check', 'neighbor', 'filter', 'enqueue']

const PHASE_DESC = {
  init:     '자료구조 초기화',
  loop:     '큐/스택이 비었는지 확인',
  dequeue:  '다음 노드를 꺼냄',
  check:    '도착점 여부 확인',
  neighbor: '인접 노드 탐색',
  filter:   '방문 여부 / 비용 비교',
  enqueue:  '큐/스택에 추가',
  found:    '경로 발견!',
  done:     '탐색 종료',
}

const ROWS = 20
const COLS = 40
const CELL_EMPTY = 0
const CELL_WALL = 1
const CELL_START = 2
const CELL_END = 3
const CELL_VISITED = 4
const CELL_PATH = 5
const CELL_FRONTIER = 6

function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(CELL_EMPTY))
}

const DIRS = [[-1,0],[1,0],[0,-1],[0,1]]

function bfsSteps(grid, startR, startC, endR, endC) {
  const steps = []
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  const queue = [[startR, startC]]
  visited[startR][startC] = true
  let found = false

  while (queue.length && !found) {
    const nextQueue = []
    const frontierCells = []
    const visitedCells = []

    for (const [r, c] of queue) {
      if (r === endR && c === endC) { found = true; break }
      visitedCells.push([r, c])
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited[nr][nc] && grid[nr][nc] !== CELL_WALL) {
          visited[nr][nc] = true
          prev[nr][nc] = [r, c]
          nextQueue.push([nr, nc])
          frontierCells.push([nr, nc])
        }
      }
    }

    steps.push({ visited: visitedCells, frontier: frontierCells })
    queue.length = 0
    queue.push(...nextQueue)
  }

  const path = []
  if (found) {
    let cur = [endR, endC]
    while (cur) {
      path.unshift(cur)
      const [r, c] = cur
      cur = prev[r][c]
    }
  }
  return { steps, path }
}

function dfsSteps(grid, startR, startC, endR, endC) {
  const steps = []
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
  const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  const stack = [[startR, startC]]
  visited[startR][startC] = true
  let found = false

  while (stack.length && !found) {
    const [r, c] = stack.pop()
    if (r === endR && c === endC) { found = true; break }
    const frontier = []
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited[nr][nc] && grid[nr][nc] !== CELL_WALL) {
        visited[nr][nc] = true
        prev[nr][nc] = [r, c]
        stack.push([nr, nc])
        frontier.push([nr, nc])
      }
    }
    steps.push({ visited: [[r, c]], frontier })
  }

  const path = []
  if (found) {
    let cur = [endR, endC]
    while (cur) {
      path.unshift(cur)
      const [r, c] = cur
      cur = prev[r][c]
    }
  }
  return { steps, path }
}

function dijkstraSteps(grid, startR, startC, endR, endC) {
  // simplified: uniform cost (same as BFS on unweighted grid)
  return bfsSteps(grid, startR, startC, endR, endC)
}

const ALGO_MAP = { bfs: bfsSteps, dfs: dfsSteps, dijkstra: dijkstraSteps }

const SPEED_MAP = { slow: 80, normal: 30, fast: 8 }

const CELL_COLORS = {
  [CELL_EMPTY]:    'var(--cell-empty)',
  [CELL_WALL]:     'var(--cell-wall)',
  [CELL_START]:    'var(--cell-start)',
  [CELL_END]:      'var(--cell-end)',
  [CELL_VISITED]:  'var(--cell-visited)',
  [CELL_PATH]:     'var(--cell-path)',
  [CELL_FRONTIER]: 'var(--cell-frontier)',
}

export default function Visualizer() {
  const [grid, setGrid] = useState(createGrid)
  const [algo, setAlgo] = useState('bfs')
  const [speed, setSpeed] = useState('normal')
  const [mode, setMode] = useState('wall') // wall | start | end
  const [startPos, setStartPos] = useState([Math.floor(ROWS/2), 4])
  const [endPos, setEndPos] = useState([Math.floor(ROWS/2), COLS - 5])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [codeLang, setCodeLang] = useState('python')
  const [codePhase, setCodePhase] = useState(null)
  const [showCode, setShowCode] = useState(true)

  const animRef = useRef(null)
  const displayGrid = useRef(createGrid())
  const [renderTick, setRenderTick] = useState(0)

  // Initialize start/end on grid
  useEffect(() => {
    const g = createGrid()
    g[startPos[0]][startPos[1]] = CELL_START
    g[endPos[0]][endPos[1]] = CELL_END
    displayGrid.current = g
    setGrid(g.map(r => [...r]))
    setRenderTick(t => t + 1)
  }, [])

  const resetVisualization = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current)
    setRunning(false)
    setDone(false)
    setStats(null)
    const g = grid.map(r => r.map(cell =>
      cell === CELL_VISITED || cell === CELL_PATH || cell === CELL_FRONTIER ? CELL_EMPTY : cell
    ))
    g[startPos[0]][startPos[1]] = CELL_START
    g[endPos[0]][endPos[1]] = CELL_END
    displayGrid.current = g
    setGrid(g.map(r => [...r]))
  }, [grid, startPos, endPos])

  const clearAll = () => {
    if (animRef.current) clearTimeout(animRef.current)
    setRunning(false)
    setDone(false)
    setStats(null)
    const g = createGrid()
    g[startPos[0]][startPos[1]] = CELL_START
    g[endPos[0]][endPos[1]] = CELL_END
    displayGrid.current = g
    setGrid(g.map(r => [...r]))
  }

  const runAlgorithm = () => {
    resetVisualization()
    setTimeout(() => {
      const g = displayGrid.current.map(r => r.map(c => c === CELL_VISITED || c === CELL_PATH || c === CELL_FRONTIER ? CELL_EMPTY : c))
      g[startPos[0]][startPos[1]] = CELL_START
      g[endPos[0]][endPos[1]] = CELL_END
      displayGrid.current = g

      const fn = ALGO_MAP[algo]
      const { steps, path } = fn(g, startPos[0], startPos[1], endPos[0], endPos[1])
      const delay = SPEED_MAP[speed]
      let stepIdx = 0

      setRunning(true)
      setDone(false)
      setStats(null)
      setCodePhase('init')

      const animate = () => {
        if (stepIdx >= steps.length) {
          // Draw path
          const pathGrid = displayGrid.current.map(r => [...r])
          for (const [r, c] of path) {
            if (pathGrid[r][c] !== CELL_START && pathGrid[r][c] !== CELL_END) {
              pathGrid[r][c] = CELL_PATH
            }
          }
          displayGrid.current = pathGrid
          setGrid(pathGrid.map(r => [...r]))
          setRunning(false)
          setDone(true)
          setCodePhase(path.length > 0 ? 'found' : 'done')
          setStats({
            visited: steps.reduce((acc, s) => acc + s.visited.length, 0),
            pathLen: path.length,
            found: path.length > 0,
          })
          return
        }

        setCodePhase(STEP_PHASES[stepIdx % STEP_PHASES.length])
        const { visited, frontier } = steps[stepIdx]
        const newGrid = displayGrid.current.map(r => [...r])
        for (const [r, c] of frontier) {
          if (newGrid[r][c] !== CELL_START && newGrid[r][c] !== CELL_END) {
            newGrid[r][c] = CELL_FRONTIER
          }
        }
        for (const [r, c] of visited) {
          if (newGrid[r][c] !== CELL_START && newGrid[r][c] !== CELL_END && newGrid[r][c] !== CELL_FRONTIER) {
            newGrid[r][c] = CELL_VISITED
          }
        }
        // Mark old frontiers as visited
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (newGrid[r][c] === CELL_FRONTIER && !frontier.some(([fr,fc]) => fr===r && fc===c)) {
              if (newGrid[r][c] !== CELL_START && newGrid[r][c] !== CELL_END) {
                newGrid[r][c] = CELL_VISITED
              }
            }
          }
        }
        displayGrid.current = newGrid
        setGrid(newGrid.map(r => [...r]))
        stepIdx++
        animRef.current = setTimeout(animate, delay)
      }

      animRef.current = setTimeout(animate, delay)
    }, 50)
  }

  const handleCellInteract = (r, c) => {
    if (running) return
    const g = grid.map(row => [...row])

    if (mode === 'start') {
      g[startPos[0]][startPos[1]] = CELL_EMPTY
      g[r][c] = CELL_START
      setStartPos([r, c])
    } else if (mode === 'end') {
      g[endPos[0]][endPos[1]] = CELL_EMPTY
      g[r][c] = CELL_END
      setEndPos([r, c])
    } else {
      const isStart = r === startPos[0] && c === startPos[1]
      const isEnd = r === endPos[0] && c === endPos[1]
      if (!isStart && !isEnd) {
        g[r][c] = g[r][c] === CELL_WALL ? CELL_EMPTY : CELL_WALL
      }
    }
    displayGrid.current = g
    setGrid(g)
  }

  const handleCellDrag = (r, c) => {
    if (!mouseDown || running || mode !== 'wall') return
    const isStart = r === startPos[0] && c === startPos[1]
    const isEnd = r === endPos[0] && c === endPos[1]
    if (!isStart && !isEnd && grid[r][c] !== CELL_WALL) {
      const g = grid.map(row => [...row])
      g[r][c] = CELL_WALL
      displayGrid.current = g
      setGrid(g)
    }
  }

  const generateMaze = () => {
    if (running) return
    clearAll()
    setTimeout(() => {
      const g = createGrid()
      // Simple random walls
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const isStart = r === startPos[0] && c === startPos[1]
          const isEnd = r === endPos[0] && c === endPos[1]
          if (!isStart && !isEnd && Math.random() < 0.3) {
            g[r][c] = CELL_WALL
          }
        }
      }
      g[startPos[0]][startPos[1]] = CELL_START
      g[endPos[0]][endPos[1]] = CELL_END
      displayGrid.current = g
      setGrid(g.map(r => [...r]))
    }, 50)
  }

  const concept = CONCEPTS[algo]

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── 알고리즘 선택 탭 ── */}
        <div className={styles.algoTabs}>
          {Object.values(CONCEPTS).map(c => (
            <button
              key={c.abbr.toLowerCase()}
              className={`${styles.algoTab} ${algo === c.abbr.toLowerCase() ? styles.algoTabActive : ''}`}
              style={algo === c.abbr.toLowerCase() ? { borderColor: c.color, color: c.color, background: c.color + '12' } : {}}
              onClick={() => { if (!running) { setAlgo(c.abbr.toLowerCase()); setCodePhase(null) } }}
              disabled={running}
            >
              <span className={styles.algoTabAbbr}>{c.abbr}</span>
              <span className={styles.algoTabName}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════
            개념 설명 (메인)
        ══════════════════════════════════ */}

        {/* 정의 & 요약 */}
        <div className={styles.conceptHero} style={{ borderColor: concept.color + '30', background: concept.color + '06' }}>
          <div className={styles.conceptHeroLeft}>
            <span className={styles.conceptAbbr} style={{ color: concept.color }}>{concept.abbr}</span>
            <h1 className={styles.conceptName}>{concept.name}</h1>
            <p className={styles.conceptEng}>{concept.eng}</p>
            <p className={styles.conceptTagline} style={{ color: concept.color }}>"{concept.tagline}"</p>
            <p className={styles.conceptSummary}>{concept.summary}</p>
          </div>
          <div className={styles.conceptHeroRight}>
            <div className={styles.structureBox} style={{ borderColor: concept.color + '40' }}>
              <span className={styles.structureLabel}>핵심 자료구조</span>
              <span className={styles.structureValue} style={{ color: concept.color }}>{concept.structure}</span>
              <span className={styles.structureDesc}>{concept.structureDesc}</span>
            </div>
          </div>
        </div>

        {/* 동작 순서 */}
        <div className={styles.conceptCard}>
          <h2 className={styles.conceptCardTitle}>동작 순서</h2>
          <div className={styles.stepList}>
            {concept.steps.map((step, i) => (
              <div key={i} className={styles.stepRow}>
                <span className={styles.stepIcon} style={{ color: concept.color, borderColor: concept.color + '40', background: concept.color + '10' }}>
                  {step.icon}
                </span>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 핵심 특성 */}
        <div className={styles.conceptCard}>
          <h2 className={styles.conceptCardTitle}>핵심 특성</h2>
          <div className={styles.propsGrid}>
            {concept.props.map(p => (
              <div key={p.label} className={`${styles.propCard} ${p.good === true ? styles.propGood : p.good === false ? styles.propBad : ''}`}>
                <span className={styles.propLabel}>{p.label}</span>
                <span className={styles.propValue}>{p.value}</span>
                <span className={styles.propDesc}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 언제 써야 할까 / 주의사항 */}
        <div className={styles.twoCol}>
          <div className={styles.conceptCard}>
            <h2 className={styles.conceptCardTitle}>언제 사용하나요?</h2>
            <ul className={styles.useCaseList}>
              {concept.useCases.map(u => (
                <li key={u} className={styles.useCaseItem}>
                  <span className={styles.useCaseDot} style={{ background: concept.color }} />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.conceptCard} ${styles.cautionCard}`}>
            <h2 className={styles.conceptCardTitle}>⚠ 주의사항</h2>
            <p className={styles.cautionText}>{concept.caution}</p>
          </div>
        </div>

        {/* BFS vs DFS 비교표 (Dijkstra 제외) */}
        {algo !== 'dijkstra' && (
          <div className={styles.conceptCard}>
            <h2 className={styles.conceptCardTitle}>BFS vs DFS 비교</h2>
            <div className={styles.compareTable}>
              <div className={styles.compareHead}>
                <span />
                <span style={{ color: '#2dd4bf' }}>BFS</span>
                <span style={{ color: '#a78bfa' }}>DFS</span>
              </div>
              {[
                { item: '자료구조',   bfs: '큐 (Queue)',     dfs: '스택 / 재귀' },
                { item: '탐색 방식', bfs: '층별 (레벨 순)', dfs: '깊이 우선' },
                { item: '최단 경로', bfs: '✓ 보장',          dfs: '✗ 미보장' },
                { item: '메모리',    bfs: '상대적으로 많음', dfs: '상대적으로 적음' },
                { item: '적합한 경우', bfs: '최단 경로, 레벨 탐색', dfs: '경로 탐색, 백트래킹' },
              ].map(row => (
                <div key={row.item} className={`${styles.compareRow} ${styles[`compare_${algo}`]}`}>
                  <span className={styles.compareItem}>{row.item}</span>
                  <span className={algo === 'bfs' ? styles.compareHighlight : ''}>{row.bfs}</span>
                  <span className={algo === 'dfs' ? styles.compareHighlight : ''}>{row.dfs}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            코드
        ══════════════════════════════════ */}
        <div className={styles.codeSection}>
          <div className={styles.codeSectionHeader}>
            <div className={styles.codeSectionLeft}>
              <button className={styles.codeToggle} onClick={() => setShowCode(v => !v)}>
                {showCode ? '▾' : '▸'} 기본 코드 보기
              </button>
              {codePhase && showCode && (
                <span className={styles.phaseChip}>
                  <span className={styles.phaseDot} />
                  {PHASE_DESC[codePhase]}
                </span>
              )}
            </div>
            {showCode && (
              <div className={styles.langTabs}>
                {[{ id:'python', label:'Python' }, { id:'cpp', label:'C++' }, { id:'js', label:'JavaScript' }].map(l => (
                  <button key={l.id} className={`${styles.langTab} ${codeLang === l.id ? styles.langActive : ''}`} onClick={() => setCodeLang(l.id)}>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {showCode && (
            <div className={styles.codeBlock}>
              <div className={styles.codeBlockInner}>
                {(CODE_SNIPPETS[algo]?.[codeLang] ?? []).map((line, i) => {
                  const isActive = codePhase && line.phase === codePhase
                  return (
                    <div key={i} className={`${styles.codeLn} ${isActive ? styles.codeLnActive : ''} ${line.type === 'dim' ? styles.codeLnDim : ''}`}>
                      <span className={styles.codeNum}>{line.text ? i + 1 : ''}</span>
                      <span className={styles.codeText}>{line.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════
            직접 해보기 (시각화)
        ══════════════════════════════════ */}
        <div className={styles.trySection}>
          <h2 className={styles.trySectionTitle}>직접 해보기</h2>
          <p className={styles.trySectionDesc}>벽을 그리고 알고리즘을 실행해보세요. 탐색 과정을 실시간으로 확인할 수 있습니다.</p>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Speed */}
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>속도</span>
            <div className={styles.btnGroup}>
              {[
                { id: 'slow', label: '느리게' },
                { id: 'normal', label: '보통' },
                { id: 'fast', label: '빠르게' },
              ].map(s => (
                <button
                  key={s.id}
                  className={`${styles.groupBtn} ${speed === s.id ? styles.groupActive : ''}`}
                  onClick={() => setSpeed(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>그리기</span>
            <div className={styles.btnGroup}>
              {[
                { id: 'wall', label: '🧱 벽' },
                { id: 'start', label: '🟢 시작' },
                { id: 'end', label: '🔴 도착' },
              ].map(m => (
                <button
                  key={m.id}
                  className={`${styles.groupBtn} ${mode === m.id ? styles.groupActive : ''}`}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>기타</span>
            <div className={styles.btnGroup}>
              <button className={styles.mazeBtn} onClick={generateMaze} disabled={running}>
                랜덤 미로
              </button>
              <button className={styles.clearBtn} onClick={clearAll} disabled={running}>
                초기화
              </button>
            </div>
          </div>

          <button
            className={`${styles.runBtn} ${running ? styles.runBtnRunning : ''}`}
            onClick={running ? undefined : runAlgorithm}
            disabled={running}
          >
            {running ? (
              <>
                <div className={styles.spinner} />
                탐색 중...
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <polygon points="2,1 11,6 2,11" fill="currentColor"/>
                </svg>
                {algo.toUpperCase()} 시각화
              </>
            )}
          </button>
        </div>

        {/* Stats bar */}
        {(done || running) && (
          <div className={styles.statsBar}>
            {done && stats && (
              <>
                <div className={`${styles.statChip} ${stats.found ? styles.found : styles.notFound}`}>
                  {stats.found ? '✓ 경로 발견' : '✗ 경로 없음'}
                </div>
                <div className={styles.statChip}>
                  <span className={styles.statKey}>방문 노드</span>
                  <span className={styles.statNum}>{stats.visited}</span>
                </div>
                <div className={styles.statChip}>
                  <span className={styles.statKey}>경로 길이</span>
                  <span className={styles.statNum}>{stats.pathLen}</span>
                </div>
              </>
            )}
            {running && (
              <div className={styles.statChip}>
                <div className={styles.spinnerSm} />
                <span>노드 탐색 중...</span>
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        <div
          className={styles.gridWrap}
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
          onMouseLeave={() => setMouseDown(false)}
        >
          <div
            className={styles.grid}
            style={{ '--cols': COLS, '--rows': ROWS }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`${styles.cell} ${styles[`c${cell}`]}`}
                  onMouseDown={() => handleCellInteract(r, c)}
                  onMouseEnter={() => handleCellDrag(r, c)}
                />
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {[
            { cls: 'c0', label: '빈 칸' },
            { cls: 'c1', label: '벽' },
            { cls: 'c2', label: '시작' },
            { cls: 'c3', label: '도착' },
            { cls: 'c6', label: '탐색 중' },
            { cls: 'c4', label: '방문함' },
            { cls: 'c5', label: '최단 경로' },
          ].map(item => (
            <div key={item.label} className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles[item.cls]}`} />
              <span className={styles.legendLabel}>{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
