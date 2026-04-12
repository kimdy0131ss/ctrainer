import { useState, useRef } from 'react'
import styles from './Visualizer.module.css'

/* ── 그래프 코드 스니펫 ── */
const CODE_SNIPPETS = {
  bfs: {
    python: [
      { text: 'from collections import deque', type: 'dim' },
      { text: '' },
      { text: 'def bfs(graph, start, end):' },
      { text: '    queue = deque([start])', phase: 'init' },
      { text: '    visited = {start}',      phase: 'init' },
      { text: '    prev = {}',              phase: 'init' },
      { text: '' },
      { text: '    while queue:',           phase: 'loop' },
      { text: '        node = queue.popleft()', phase: 'dequeue' },
      { text: '        if node == end:',       phase: 'check' },
      { text: '            return build_path(prev, end)', phase: 'found' },
      { text: '        for nb in graph[node]:',           phase: 'neighbor' },
      { text: '            if nb not in visited:',        phase: 'filter' },
      { text: '                visited.add(nb)',          phase: 'enqueue' },
      { text: '                prev[nb] = node',          phase: 'enqueue' },
      { text: '                queue.append(nb)',         phase: 'enqueue' },
      { text: '    return []', phase: 'done' },
    ],
    cpp: [
      { text: '#include <queue>', type: 'dim' },
      { text: '' },
      { text: 'vector<int> bfs(vector<vector<int>>& g, int s, int e) {' },
      { text: '    queue<int> q;  q.push(s);',            phase: 'init' },
      { text: '    unordered_set<int> vis = {s};',        phase: 'init' },
      { text: '    map<int,int> prev;',                   phase: 'init' },
      { text: '    while (!q.empty()) {',                 phase: 'loop' },
      { text: '        int u = q.front(); q.pop();',      phase: 'dequeue' },
      { text: '        if (u == e) return build(prev,e);', phase: 'check' },
      { text: '        for (int nb : g[u]) {',            phase: 'neighbor' },
      { text: '            if (!vis.count(nb)) {',        phase: 'filter' },
      { text: '                vis.insert(nb);',          phase: 'enqueue' },
      { text: '                prev[nb]=u; q.push(nb);',  phase: 'enqueue' },
      { text: '            }', },
      { text: '        }' },
      { text: '    }' },
      { text: '    return {};', phase: 'done' },
      { text: '}' },
    ],
    js: [
      { text: 'function bfs(graph, start, end) {' },
      { text: '    const q = [start];',                   phase: 'init' },
      { text: '    const vis = new Set([start]);',        phase: 'init' },
      { text: '    const prev = new Map();',              phase: 'init' },
      { text: '    while (q.length) {',                   phase: 'loop' },
      { text: '        const u = q.shift();',             phase: 'dequeue' },
      { text: '        if (u === end) return path(prev,end);', phase: 'check' },
      { text: '        for (const nb of graph[u]) {',     phase: 'neighbor' },
      { text: '            if (!vis.has(nb)) {',          phase: 'filter' },
      { text: '                vis.add(nb);',             phase: 'enqueue' },
      { text: '                prev.set(nb,u); q.push(nb);', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return [];', phase: 'done' },
      { text: '}' },
    ],
  },
  dfs: {
    python: [
      { text: 'def dfs(graph, start, end):' },
      { text: '    stack = [start]',        phase: 'init' },
      { text: '    visited = {start}',      phase: 'init' },
      { text: '    prev = {}',              phase: 'init' },
      { text: '    while stack:',           phase: 'loop' },
      { text: '        node = stack.pop()', phase: 'dequeue' },
      { text: '        if node == end:',    phase: 'check' },
      { text: '            return build_path(prev, end)', phase: 'found' },
      { text: '        for nb in graph[node]:',          phase: 'neighbor' },
      { text: '            if nb not in visited:',       phase: 'filter' },
      { text: '                visited.add(nb)',         phase: 'enqueue' },
      { text: '                prev[nb] = node',         phase: 'enqueue' },
      { text: '                stack.append(nb)',        phase: 'enqueue' },
      { text: '    return []', phase: 'done' },
    ],
    cpp: [
      { text: '#include <stack>', type: 'dim' },
      { text: '' },
      { text: 'vector<int> dfs(vector<vector<int>>& g, int s, int e) {' },
      { text: '    stack<int> st;  st.push(s);',         phase: 'init' },
      { text: '    unordered_set<int> vis = {s};',       phase: 'init' },
      { text: '    map<int,int> prev;',                  phase: 'init' },
      { text: '    while (!st.empty()) {',               phase: 'loop' },
      { text: '        int u = st.top(); st.pop();',     phase: 'dequeue' },
      { text: '        if (u == e) return build(prev,e);', phase: 'check' },
      { text: '        for (int nb : g[u]) {',           phase: 'neighbor' },
      { text: '            if (!vis.count(nb)) {',       phase: 'filter' },
      { text: '                vis.insert(nb);',         phase: 'enqueue' },
      { text: '                prev[nb]=u; st.push(nb);', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return {};', phase: 'done' },
      { text: '}' },
    ],
    js: [
      { text: 'function dfs(graph, start, end) {' },
      { text: '    const stack = [start];',              phase: 'init' },
      { text: '    const vis = new Set([start]);',       phase: 'init' },
      { text: '    const prev = new Map();',             phase: 'init' },
      { text: '    while (stack.length) {',              phase: 'loop' },
      { text: '        const u = stack.pop();',          phase: 'dequeue' },
      { text: '        if (u === end) return path(prev,end);', phase: 'check' },
      { text: '        for (const nb of graph[u]) {',   phase: 'neighbor' },
      { text: '            if (!vis.has(nb)) {',         phase: 'filter' },
      { text: '                vis.add(nb);',            phase: 'enqueue' },
      { text: '                prev.set(nb,u); stack.push(nb);', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return [];', phase: 'done' },
      { text: '}' },
    ],
  },
  dijkstra: {
    python: [
      { text: 'import heapq', type: 'dim' },
      { text: '' },
      { text: 'def dijkstra(graph, start, end):' },
      { text: '    heap = [(0, start)]',   phase: 'init' },
      { text: '    dist = {start: 0}',     phase: 'init' },
      { text: '    prev = {}',             phase: 'init' },
      { text: '    while heap:',           phase: 'loop' },
      { text: '        cost, node = heapq.heappop(heap)', phase: 'dequeue' },
      { text: '        if node == end:',   phase: 'check' },
      { text: '            return build_path(prev, end)', phase: 'found' },
      { text: '        for nb, w in graph[node]:',        phase: 'neighbor' },
      { text: '            nc = cost + w',                phase: 'filter' },
      { text: '            if nc < dist.get(nb, inf):',   phase: 'filter' },
      { text: '                dist[nb] = nc',            phase: 'enqueue' },
      { text: '                prev[nb] = node',          phase: 'enqueue' },
      { text: '                heapq.heappush(heap,(nc,nb))', phase: 'enqueue' },
      { text: '    return []', phase: 'done' },
    ],
    cpp: [
      { text: '#include <queue>', type: 'dim' },
      { text: '' },
      { text: 'vector<int> dijkstra(vector<vector<pair<int,int>>>& g, int s, int e) {' },
      { text: '    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;', phase: 'init' },
      { text: '    pq.push({0,s}); map<int,int> dist={{s,0}},prev;', phase: 'init' },
      { text: '    while (!pq.empty()) {',                           phase: 'loop' },
      { text: '        auto [cost,u] = pq.top(); pq.pop();',        phase: 'dequeue' },
      { text: '        if (u==e) return build(prev,e);',             phase: 'check' },
      { text: '        for (auto [nb,w]: g[u]) {',                  phase: 'neighbor' },
      { text: '            int nc=cost+w;',                          phase: 'filter' },
      { text: '            if (!dist.count(nb)||nc<dist[nb]) {',     phase: 'filter' },
      { text: '                dist[nb]=nc; prev[nb]=u; pq.push({nc,nb});', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return {};', phase: 'done' },
      { text: '}' },
    ],
    js: [
      { text: 'function dijkstra(graph, start, end) {' },
      { text: '    const pq = new MinHeap();',            phase: 'init' },
      { text: '    pq.push({cost:0, node:start});',       phase: 'init' },
      { text: '    const dist = new Map([[start,0]]);',   phase: 'init' },
      { text: '    const prev = new Map();',              phase: 'init' },
      { text: '    while (!pq.isEmpty()) {',              phase: 'loop' },
      { text: '        const {cost,node:u} = pq.pop();', phase: 'dequeue' },
      { text: '        if (u===end) return path(prev,end);', phase: 'check' },
      { text: '        for (const {nb,w} of graph[u]) {', phase: 'neighbor' },
      { text: '            const nc = cost+w;',           phase: 'filter' },
      { text: '            if (nc < (dist.get(nb)??Infinity)) {', phase: 'filter' },
      { text: '                dist.set(nb,nc); prev.set(nb,u); pq.push({cost:nc,node:nb});', phase: 'enqueue' },
      { text: '            }' },
      { text: '        }' },
      { text: '    }' },
      { text: '    return [];', phase: 'done' },
      { text: '}' },
    ],
  },
}

/* ── 정렬 코드 스니펫 (Python) ── */
const SORT_CODE = {
  bubble: [
    { text: 'def bubble_sort(arr):' },
    { text: '    n = len(arr)',                            phase: 'init' },
    { text: '    for i in range(n - 1):',                 phase: 'loop' },
    { text: '        for j in range(n - 1 - i):',         phase: 'loop' },
    { text: '            if arr[j] > arr[j + 1]:',        phase: 'compare' },
    { text: '                arr[j], arr[j+1] =',         phase: 'swap' },
    { text: '                    arr[j+1], arr[j]',       phase: 'swap' },
  ],
  selection: [
    { text: 'def selection_sort(arr):' },
    { text: '    n = len(arr)',                            phase: 'init' },
    { text: '    for i in range(n - 1):',                 phase: 'loop' },
    { text: '        min_idx = i',                        phase: 'init' },
    { text: '        for j in range(i + 1, n):',          phase: 'loop' },
    { text: '            if arr[j] < arr[min_idx]:',      phase: 'compare' },
    { text: '                min_idx = j',                phase: 'compare' },
    { text: '        arr[i], arr[min_idx] =',             phase: 'swap' },
    { text: '            arr[min_idx], arr[i]',           phase: 'swap' },
  ],
  insertion: [
    { text: 'def insertion_sort(arr):' },
    { text: '    for i in range(1, len(arr)):',           phase: 'loop' },
    { text: '        key = arr[i]',                       phase: 'init' },
    { text: '        j = i - 1',                         phase: 'init' },
    { text: '        while j >= 0 and arr[j] > key:',    phase: 'compare' },
    { text: '            arr[j + 1] = arr[j]',           phase: 'swap' },
    { text: '            j -= 1',                        phase: 'swap' },
    { text: '        arr[j + 1] = key',                  phase: 'swap' },
  ],
  merge: [
    { text: 'def merge_sort(arr):' },
    { text: '    if len(arr) <= 1: return arr',           phase: 'init' },
    { text: '    mid = len(arr) // 2',                   phase: 'init' },
    { text: '    L = merge_sort(arr[:mid])',              phase: 'loop' },
    { text: '    R = merge_sort(arr[mid:])',              phase: 'loop' },
    { text: '    return merge(L, R)',                     phase: 'compare' },
    { text: '' },
    { text: 'def merge(L, R):' },
    { text: '    result, i, j = [], 0, 0' },
    { text: '    while i < len(L) and j < len(R):',      phase: 'compare' },
    { text: '        if L[i] <= R[j]:',                  phase: 'compare' },
    { text: '            result.append(L[i]); i += 1',   phase: 'swap' },
    { text: '        else:' },
    { text: '            result.append(R[j]); j += 1',   phase: 'swap' },
    { text: '    return result + L[i:] + R[j:]',         phase: 'swap' },
  ],
  quick: [
    { text: 'def quick_sort(arr, low=0, high=None):' },
    { text: '    if high is None: high = len(arr)-1',    phase: 'init' },
    { text: '    if low < high:',                        phase: 'loop' },
    { text: '        p = partition(arr, low, high)',     phase: 'init' },
    { text: '        quick_sort(arr, low, p - 1)',       phase: 'loop' },
    { text: '        quick_sort(arr, p + 1, high)',      phase: 'loop' },
    { text: '' },
    { text: 'def partition(arr, low, high):' },
    { text: '    pivot = arr[high]',                     phase: 'init' },
    { text: '    i = low - 1',                          phase: 'init' },
    { text: '    for j in range(low, high):',            phase: 'loop' },
    { text: '        if arr[j] <= pivot:',               phase: 'compare' },
    { text: '            i += 1',                       phase: 'compare' },
    { text: '            arr[i], arr[j] = arr[j], arr[i]', phase: 'swap' },
    { text: '    arr[i+1], arr[high] = arr[high], arr[i+1]', phase: 'swap' },
    { text: '    return i + 1',                         phase: 'swap' },
  ],
}

/* ── 그래프 개념 데이터 ── */
const CONCEPTS = {
  bfs: {
    name: '너비 우선 탐색', eng: 'Breadth-First Search', abbr: 'BFS',
    color: '#2dd4bf',
    tagline: '가까운 곳부터 차례로 — 층별로 퍼져나가는 탐색',
    summary: '시작 노드에서 출발해 인접한 노드들을 먼저 모두 방문한 뒤, 그 다음 층으로 넘어갑니다. 물에 돌을 던졌을 때 파문이 동심원으로 퍼지는 것과 같은 원리입니다.',
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
      { label: '최단 경로',   value: '보장',     desc: '가중치 없는 그래프에서 최단 경로 발견', good: true },
      { label: '완전성',      value: '완전',     desc: '해가 존재하면 반드시 찾음', good: true },
    ],
    useCases: ['최단 경로 탐색 (미로, 지도)', '소셜 네트워크에서 최소 연결 단계', '레벨별 트리 순회', '네트워크 브로드캐스트'],
    caution: 'DFS보다 메모리를 많이 사용할 수 있습니다. 큐에 많은 노드가 쌓이기 때문입니다.',
  },
  dfs: {
    name: '깊이 우선 탐색', eng: 'Depth-First Search', abbr: 'DFS',
    color: '#a78bfa',
    tagline: '한 길을 끝까지 — 막히면 되돌아오는 탐색',
    summary: '시작 노드에서 출발해 한 방향으로 갈 수 있는 끝까지 내려간 뒤, 막히면 되돌아와 다른 방향을 탐색합니다. 미로를 오른쪽 벽을 짚고 끝까지 가는 전략과 같습니다.',
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
    useCases: ['경로 존재 여부 판별', '사이클 탐지', '위상 정렬', '백트래킹 (순열, 조합, N-Queen)', '연결 요소 개수 세기'],
    caution: '최단 경로를 보장하지 않습니다. 경로의 "존재 여부"만 확인할 때 적합합니다.',
  },
  dijkstra: {
    name: '다익스트라', eng: "Dijkstra's Algorithm", abbr: 'Dijkstra',
    color: '#fbbf24',
    tagline: '가장 가까운 것부터 — 누적 비용이 최소인 경로 탐색',
    summary: '출발 노드에서 각 노드까지의 최단 거리를 기록하며, 아직 확정되지 않은 노드 중 가장 비용이 낮은 것부터 처리합니다. BFS의 "층별 탐색"을 가중치가 있는 그래프로 확장한 알고리즘입니다.',
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
      { label: '음수 간선',   value: '불가',            desc: '음수 가중치가 있으면 벨만-포드를 사용', good: false },
    ],
    useCases: ['지도 앱의 최단 경로 (내비게이션)', '네트워크 라우팅 프로토콜 (OSPF)', '가중치 그래프에서의 최단 경로'],
    caution: '음수 가중치가 있는 그래프에서는 동작하지 않습니다. 벨만-포드 알고리즘을 사용하세요.',
  },
}

/* ── 정렬 개념 데이터 ── */
const SORT_CONCEPTS = {
  bubble: {
    name: '버블 정렬', eng: 'Bubble Sort', abbr: 'Bubble',
    color: '#60a5fa',
    tagline: '인접한 두 원소를 비교하며 거품처럼 떠오르는 정렬',
    summary: '인접한 두 원소를 비교해 순서가 맞지 않으면 교환합니다. 한 번의 순회마다 가장 큰 원소가 맨 뒤로 확정됩니다.',
    structure: 'In-place', structureDesc: '추가 메모리 없이 배열 내에서 정렬',
    steps: [
      { icon: '①', text: '첫 번째 원소부터 인접한 두 원소를 비교한다.' },
      { icon: '②', text: '앞 원소가 뒤 원소보다 크면 교환한다.' },
      { icon: '③', text: '한 번의 순회가 끝나면 가장 큰 원소가 맨 뒤에 확정된다.' },
      { icon: '④', text: '정렬된 부분을 제외하고 ①~③을 반복한다.' },
    ],
    props: [
      { label: '평균/최악 시간', value: 'O(n²)', desc: '항상 O(n²) 비교 수행' },
      { label: '최선 시간',     value: 'O(n)',   desc: '이미 정렬된 경우', good: true },
      { label: '공간 복잡도',   value: 'O(1)',   desc: '추가 메모리 없음', good: true },
      { label: '안정성',        value: '안정',   desc: '같은 값의 상대적 순서 유지', good: true },
    ],
    useCases: ['알고리즘 교육', '거의 정렬된 소규모 배열'],
    caution: '실전에서는 O(n²) 성능으로 거의 사용하지 않습니다.',
  },
  selection: {
    name: '선택 정렬', eng: 'Selection Sort', abbr: 'Selection',
    color: '#34d399',
    tagline: '매번 가장 작은 원소를 선택해 앞으로 옮기는 정렬',
    summary: '정렬되지 않은 부분에서 최솟값을 찾아 앞에 놓는 과정을 반복합니다. 교환 횟수가 최대 n번으로 적지만 비교는 항상 O(n²)입니다.',
    structure: 'In-place', structureDesc: '추가 메모리 없이 배열 내에서 정렬',
    steps: [
      { icon: '①', text: '정렬되지 않은 부분의 첫 번째를 최솟값 후보로 설정한다.' },
      { icon: '②', text: '나머지 원소와 비교하여 더 작으면 최솟값 후보를 교체한다.' },
      { icon: '③', text: '순회가 끝나면 최솟값을 정렬되지 않은 부분 첫 위치와 교환한다.' },
      { icon: '④', text: '정렬 범위를 한 칸씩 줄여가며 반복한다.' },
    ],
    props: [
      { label: '시간 복잡도',  value: 'O(n²)', desc: '항상 n(n-1)/2번 비교' },
      { label: '교환 횟수',    value: 'O(n)',   desc: '최대 n-1번 교환', good: true },
      { label: '공간 복잡도',  value: 'O(1)',   desc: '추가 메모리 없음', good: true },
      { label: '안정성',       value: '불안정', desc: '같은 값의 순서 변경 가능', good: false },
    ],
    useCases: ['교환 비용이 높은 경우 (교환 횟수 최소화)', '알고리즘 교육'],
    caution: '비교 횟수가 항상 O(n²)이므로 입력 상태에 관계없이 느립니다.',
  },
  insertion: {
    name: '삽입 정렬', eng: 'Insertion Sort', abbr: 'Insertion',
    color: '#f472b6',
    tagline: '카드를 올바른 위치에 끼워 넣듯이 정렬',
    summary: '이미 정렬된 부분에 새 원소를 올바른 위치에 삽입합니다. 거의 정렬된 데이터에서 매우 효율적입니다.',
    structure: 'In-place', structureDesc: '추가 메모리 없이 배열 내에서 정렬',
    steps: [
      { icon: '①', text: '두 번째 원소부터 시작해 현재 원소를 key로 저장한다.' },
      { icon: '②', text: 'key보다 큰 이전 원소들을 한 칸씩 오른쪽으로 이동한다.' },
      { icon: '③', text: '빈 자리에 key를 삽입한다.' },
      { icon: '④', text: '모든 원소에 대해 ①~③을 반복한다.' },
    ],
    props: [
      { label: '평균/최악 시간', value: 'O(n²)', desc: '역순 정렬 시 최악' },
      { label: '최선 시간',     value: 'O(n)',   desc: '거의 정렬된 경우', good: true },
      { label: '공간 복잡도',   value: 'O(1)',   desc: '추가 메모리 없음', good: true },
      { label: '안정성',        value: '안정',   desc: '같은 값의 순서 유지', good: true },
    ],
    useCases: ['거의 정렬된 소규모 배열', '온라인 정렬 (순서대로 입력)', 'Timsort의 기본 부분'],
    caution: '대규모 무작위 배열에서는 O(n²)으로 느립니다.',
  },
  merge: {
    name: '병합 정렬', eng: 'Merge Sort', abbr: 'Merge',
    color: '#fb923c',
    tagline: '분할하고 정복하여 합치는 안정적인 O(n log n) 정렬',
    summary: '배열을 반으로 나누고, 각각을 재귀적으로 정렬한 뒤 합칩니다. O(n log n)을 항상 보장하며 안정 정렬입니다.',
    structure: 'O(n) 추가 공간', structureDesc: '병합 시 임시 배열 필요',
    steps: [
      { icon: '①', text: '배열을 절반으로 나눈다.' },
      { icon: '②', text: '왼쪽 절반을 재귀적으로 병합 정렬한다.' },
      { icon: '③', text: '오른쪽 절반을 재귀적으로 병합 정렬한다.' },
      { icon: '④', text: '정렬된 두 절반을 비교하며 병합한다.' },
    ],
    props: [
      { label: '시간 복잡도',  value: 'O(n log n)', desc: '항상 보장', good: true },
      { label: '공간 복잡도',  value: 'O(n)',       desc: '임시 배열 필요', good: false },
      { label: '안정성',       value: '안정',       desc: '같은 값의 순서 유지', good: true },
      { label: '외부 정렬',    value: '적합',       desc: '대용량 파일 정렬에 유용', good: true },
    ],
    useCases: ['대규모 데이터 정렬', '연결 리스트 정렬', '외부 정렬 (파일)', '안정 정렬이 필요한 경우'],
    caution: 'O(n) 추가 공간이 필요합니다. 메모리가 제한된 환경에서는 퀵 정렬이 나을 수 있습니다.',
  },
  quick: {
    name: '퀵 정렬', eng: 'Quick Sort', abbr: 'Quick',
    color: '#c084fc',
    tagline: '피벗을 기준으로 분할 정복하는 가장 빠른 정렬',
    summary: '피벗을 선택해 작은 원소는 왼쪽, 큰 원소는 오른쪽으로 분할한 뒤 재귀적으로 정렬합니다. 평균적으로 가장 빠른 정렬 알고리즘입니다.',
    structure: 'In-place (재귀 스택 O(log n))', structureDesc: '피벗 기준 분할 후 재귀 호출',
    steps: [
      { icon: '①', text: '피벗(기준값)을 선택한다. (보통 마지막 원소)' },
      { icon: '②', text: '피벗보다 작은 원소는 왼쪽, 큰 원소는 오른쪽으로 이동한다.' },
      { icon: '③', text: '피벗을 올바른 위치에 놓는다. (피벗 위치 확정)' },
      { icon: '④', text: '피벗 양쪽을 재귀적으로 ①~③ 반복한다.' },
    ],
    props: [
      { label: '평균 시간',  value: 'O(n log n)', desc: '랜덤 데이터에서 최고 성능', good: true },
      { label: '최악 시간',  value: 'O(n²)',      desc: '이미 정렬된 경우 (피벗이 끝 원소)', good: false },
      { label: '공간 복잡도', value: 'O(log n)', desc: '재귀 스택 깊이', good: true },
      { label: '안정성',     value: '불안정',     desc: '같은 값의 순서 변경 가능', good: false },
    ],
    useCases: ['일반적인 대규모 정렬', '내장 정렬 함수 (C++ std::sort)', '캐시 효율이 중요한 경우'],
    caution: '최악의 경우 O(n²)이 될 수 있습니다. 무작위 피벗 선택으로 완화할 수 있습니다.',
  },
}

const STEP_PHASES = ['loop', 'dequeue', 'check', 'neighbor', 'filter', 'enqueue']

const PHASE_DESC = {
  init: '자료구조 초기화', loop: '큐/스택이 비었는지 확인',
  dequeue: '다음 노드를 꺼냄', check: '도착점 여부 확인',
  neighbor: '인접 노드 탐색', filter: '방문 여부 / 비용 비교',
  enqueue: '큐/스택에 추가', found: '경로 발견!', done: '탐색 종료',
  compare: '원소 비교 중', swap: '원소 교환 중',
}

/* ── 트리 구조 ── */
const TREE_NODES = [
  { id: 0,  x: 380, y: 45,  label: 'A' },
  { id: 1,  x: 120, y: 148, label: 'B' },
  { id: 2,  x: 380, y: 148, label: 'C' },
  { id: 3,  x: 640, y: 148, label: 'D' },
  { id: 4,  x: 55,  y: 252, label: 'E' },
  { id: 5,  x: 188, y: 252, label: 'F' },
  { id: 6,  x: 328, y: 252, label: 'G' },
  { id: 7,  x: 438, y: 252, label: 'H' },
  { id: 8,  x: 600, y: 252, label: 'I' },
  { id: 9,  x: 28,  y: 356, label: 'J' },
  { id: 10, x: 108, y: 356, label: 'K' },
  { id: 11, x: 218, y: 356, label: 'L' },
  { id: 12, x: 338, y: 356, label: 'M' },
  { id: 13, x: 448, y: 356, label: 'N' },
  { id: 14, x: 662, y: 356, label: 'O' },
]

const TREE_EDGES = [
  { u: 0, v: 1, w: 4 }, { u: 0, v: 2, w: 2 }, { u: 0, v: 3, w: 7 },
  { u: 1, v: 4, w: 3 }, { u: 1, v: 5, w: 5 },
  { u: 2, v: 6, w: 1 }, { u: 2, v: 7, w: 6 },
  { u: 3, v: 8, w: 2 },
  { u: 4, v: 9, w: 4 }, { u: 4, v: 10, w: 2 },
  { u: 5, v: 11, w: 3 },
  { u: 6, v: 12, w: 5 },
  { u: 7, v: 13, w: 1 },
  { u: 8, v: 14, w: 3 },
]

const TN = TREE_NODES.length

const TREE_ADJ = (() => {
  const adj = Array.from({ length: TN }, () => [])
  for (const { u, v, w } of TREE_EDGES) { adj[u].push({ to: v, w }); adj[v].push({ to: u, w }) }
  return adj
})()

function initTreeStates(start, end) {
  return TREE_NODES.map(n => n.id === start ? 'start' : n.id === end ? 'end' : 'unvisited')
}

function getNodeStyle(st, color) {
  switch (st) {
    case 'start':    return { fill: '#34d399', stroke: '#10b981', textFill: '#fff' }
    case 'end':      return { fill: '#f87171', stroke: '#ef4444', textFill: '#fff' }
    case 'path':     return { fill: '#fbbf24', stroke: '#f59e0b', textFill: '#1a1400' }
    case 'current':  return { fill: color, stroke: color, textFill: '#fff' }
    case 'visited':  return { fill: color + '55', stroke: color + 'bb', textFill: color }
    case 'frontier': return { fill: color + '22', stroke: color, textFill: color }
    default:         return { fill: 'var(--bg-card)', stroke: 'var(--border)', textFill: 'var(--text-muted)' }
  }
}

function buildTreePath(prev, end) {
  const path = []; let cur = end
  while (cur !== -1) { path.unshift(cur); cur = prev[cur] }
  return path.length > 1 ? path : []
}

function treeBfsSteps(start, end) {
  const visited = new Array(TN).fill(false)
  const prev = new Array(TN).fill(-1)
  const queue = [start]; visited[start] = true
  const steps = []
  const states = TREE_NODES.map(n => n.id === start ? 'start' : n.id === end ? 'end' : 'unvisited')
  const qSnap = (newId = -1) => queue.map(n => ({ id: n, label: TREE_NODES[n].label, isNew: n === newId }))

  while (queue.length) {
    const u = queue.shift()
    for (let i = 0; i < TN; i++) if (states[i] === 'current') states[i] = 'visited'
    if (states[u] !== 'start' && states[u] !== 'end') states[u] = 'current'
    steps.push({
      type: 'dequeue', current: u, newNode: -1,
      nodeStates: [...states], queueSnap: qSnap(),
      phase: 'dequeue', found: u === end,
      msg: `큐에서 ${TREE_NODES[u].label} 꺼냄 → 방문`,
    })
    if (u === end) break
    for (const { to } of TREE_ADJ[u]) {
      if (!visited[to]) {
        visited[to] = true; prev[to] = u; queue.push(to)
        if (states[to] !== 'start' && states[to] !== 'end') states[to] = 'frontier'
        steps.push({
          type: 'enqueue', current: u, newNode: to,
          nodeStates: [...states], queueSnap: qSnap(to),
          phase: 'enqueue', found: false,
          msg: `${TREE_NODES[u].label} → ${TREE_NODES[to].label} 발견, 큐에 추가`,
        })
      }
    }
  }
  return { steps, prev }
}

function treeDfsSteps(start, end) {
  const visited = new Array(TN).fill(false)
  const prev = new Array(TN).fill(-1)
  const stack = [start]; visited[start] = true
  const steps = []
  const states = TREE_NODES.map(n => n.id === start ? 'start' : n.id === end ? 'end' : 'unvisited')
  const qSnap = (newId = -1) => [...stack].reverse().map(n => ({ id: n, label: TREE_NODES[n].label, isNew: n === newId }))

  while (stack.length) {
    const u = stack.pop()
    for (let i = 0; i < TN; i++) if (states[i] === 'current') states[i] = 'visited'
    if (states[u] !== 'start' && states[u] !== 'end') states[u] = 'current'
    steps.push({
      type: 'dequeue', current: u, newNode: -1,
      nodeStates: [...states], queueSnap: qSnap(),
      phase: 'dequeue', found: u === end,
      msg: `스택에서 ${TREE_NODES[u].label} 꺼냄 → 방문`,
    })
    if (u === end) break
    for (const { to } of TREE_ADJ[u]) {
      if (!visited[to]) {
        visited[to] = true; prev[to] = u; stack.push(to)
        if (states[to] !== 'start' && states[to] !== 'end') states[to] = 'frontier'
        steps.push({
          type: 'enqueue', current: u, newNode: to,
          nodeStates: [...states], queueSnap: qSnap(to),
          phase: 'enqueue', found: false,
          msg: `${TREE_NODES[u].label} → ${TREE_NODES[to].label} 발견, 스택에 추가`,
        })
      }
    }
  }
  return { steps, prev }
}

function treeDijkstraSteps(start, end) {
  const dist = new Array(TN).fill(Infinity)
  const prev = new Array(TN).fill(-1)
  const settled = new Array(TN).fill(false)
  dist[start] = 0
  const pq = [{ node: start, cost: 0 }]
  const steps = []
  const states = TREE_NODES.map(n => n.id === start ? 'start' : n.id === end ? 'end' : 'unvisited')
  const qSnap = (newId = -1) => [...pq]
    .sort((a, b) => a.cost - b.cost)
    .map(({ node, cost: c }) => ({ id: node, label: TREE_NODES[node].label, cost: c, isNew: node === newId }))

  while (pq.length) {
    pq.sort((a, b) => a.cost - b.cost)
    const { node: u, cost } = pq.shift()
    if (settled[u]) continue
    settled[u] = true
    for (let i = 0; i < TN; i++) if (states[i] === 'current') states[i] = 'visited'
    if (states[u] !== 'start' && states[u] !== 'end') states[u] = 'current'
    steps.push({
      type: 'dequeue', current: u, newNode: -1,
      nodeStates: [...states], queueSnap: qSnap(),
      dist: [...dist], phase: 'dequeue', found: u === end,
      msg: `${TREE_NODES[u].label} 확정 (누적 비용: ${cost})`,
    })
    if (u === end) break
    for (const { to, w } of TREE_ADJ[u]) {
      const nc = cost + w
      if (nc < dist[to]) {
        dist[to] = nc; prev[to] = u; pq.push({ node: to, cost: nc })
        if (!settled[to] && states[to] !== 'start' && states[to] !== 'end') states[to] = 'frontier'
        steps.push({
          type: 'enqueue', current: u, newNode: to,
          nodeStates: [...states], queueSnap: qSnap(to),
          dist: [...dist], phase: 'enqueue', found: false,
          msg: `${TREE_NODES[to].label} 비용 갱신 → ${nc} (${TREE_NODES[u].label} + ${w})`,
        })
      }
    }
  }
  return { steps, prev }
}

/* ── 정렬 스텝 생성 ── */
function genArray(n = 16) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 88) + 12)
}

function bubbleSortSteps(arr) {
  const a = [...arr]; const n = a.length; const steps = []; const sortedSet = new Set()
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ arr: [...a], hi: [j, j+1], pivot: -1, sorted: [...sortedSet], phase: 'compare' })
      if (a[j] > a[j+1]) {
        ;[a[j], a[j+1]] = [a[j+1], a[j]]
        steps.push({ arr: [...a], hi: [j, j+1], pivot: -1, sorted: [...sortedSet], phase: 'swap' })
      }
    }
    sortedSet.add(n - 1 - i)
  }
  sortedSet.add(0)
  steps.push({ arr: [...a], hi: [], pivot: -1, sorted: Array.from({length:n},(_,i)=>i), phase: 'done' })
  return steps
}

function selectionSortSteps(arr) {
  const a = [...arr]; const n = a.length; const steps = []; const sortedSet = new Set()
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      steps.push({ arr: [...a], hi: [minIdx, j], pivot: i, sorted: [...sortedSet], phase: 'compare' })
      if (a[j] < a[minIdx]) minIdx = j
    }
    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      steps.push({ arr: [...a], hi: [i, minIdx], pivot: -1, sorted: [...sortedSet], phase: 'swap' })
    }
    sortedSet.add(i)
  }
  sortedSet.add(n - 1)
  steps.push({ arr: [...a], hi: [], pivot: -1, sorted: Array.from({length:n},(_,i)=>i), phase: 'done' })
  return steps
}

function insertionSortSteps(arr) {
  const a = [...arr]; const n = a.length; const steps = []; const sortedSet = new Set([0])
  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0 && a[j-1] > a[j]) {
      steps.push({ arr: [...a], hi: [j-1, j], pivot: i, sorted: [...sortedSet], phase: 'compare' })
      ;[a[j-1], a[j]] = [a[j], a[j-1]]
      steps.push({ arr: [...a], hi: [j-1, j], pivot: i, sorted: [...sortedSet], phase: 'swap' })
      j--
    }
    if (j === i) steps.push({ arr: [...a], hi: [j], pivot: i, sorted: [...sortedSet], phase: 'compare' })
    sortedSet.add(i)
  }
  steps.push({ arr: [...a], hi: [], pivot: -1, sorted: Array.from({length:n},(_,i)=>i), phase: 'done' })
  return steps
}

function mergeSortSteps(arr) {
  const a = [...arr]; const n = a.length; const steps = []
  function merge(arr, l, m, r) {
    const L = arr.slice(l, m+1), R = arr.slice(m+1, r+1)
    let i = 0, j = 0, k = l
    while (i < L.length && j < R.length) {
      steps.push({ arr: [...arr], hi: [l+i, m+1+j], pivot: -1, sorted: [], phase: 'compare' })
      if (L[i] <= R[j]) arr[k++] = L[i++]
      else arr[k++] = R[j++]
      steps.push({ arr: [...arr], hi: [k-1], pivot: -1, sorted: [], phase: 'swap' })
    }
    while (i < L.length) { arr[k++] = L[i++]; steps.push({ arr: [...arr], hi: [k-1], pivot: -1, sorted: [], phase: 'swap' }) }
    while (j < R.length) { arr[k++] = R[j++]; steps.push({ arr: [...arr], hi: [k-1], pivot: -1, sorted: [], phase: 'swap' }) }
  }
  function ms(arr, l, r) {
    if (l >= r) return
    const m = Math.floor((l+r)/2)
    ms(arr, l, m); ms(arr, m+1, r); merge(arr, l, m, r)
  }
  ms(a, 0, n-1)
  steps.push({ arr: [...a], hi: [], pivot: -1, sorted: Array.from({length:n},(_,i)=>i), phase: 'done' })
  return steps
}

function quickSortSteps(arr) {
  const a = [...arr]; const n = a.length; const steps = []; const sortedSet = new Set()
  function partition(arr, l, r) {
    const pivotVal = arr[r]; let i = l - 1
    steps.push({ arr: [...arr], hi: [], pivot: r, sorted: [...sortedSet], phase: 'compare' })
    for (let j = l; j < r; j++) {
      steps.push({ arr: [...arr], hi: [j, r], pivot: r, sorted: [...sortedSet], phase: 'compare' })
      if (arr[j] <= pivotVal) {
        i++
        if (i !== j) { ;[arr[i], arr[j]] = [arr[j], arr[i]]; steps.push({ arr: [...arr], hi: [i, j], pivot: r, sorted: [...sortedSet], phase: 'swap' }) }
      }
    }
    ;[arr[i+1], arr[r]] = [arr[r], arr[i+1]]
    steps.push({ arr: [...arr], hi: [i+1], pivot: i+1, sorted: [...sortedSet], phase: 'swap' })
    return i + 1
  }
  function qs(arr, l, r) {
    if (l >= r) { if (l === r) sortedSet.add(l); return }
    const p = partition(arr, l, r); sortedSet.add(p)
    qs(arr, l, p-1); qs(arr, p+1, r)
  }
  qs(a, 0, n-1)
  steps.push({ arr: [...a], hi: [], pivot: -1, sorted: Array.from({length:n},(_,i)=>i), phase: 'done' })
  return steps
}

const GRAPH_FN = { bfs: treeBfsSteps, dfs: treeDfsSteps, dijkstra: treeDijkstraSteps }
const SORT_FN  = { bubble: bubbleSortSteps, selection: selectionSortSteps, insertion: insertionSortSteps, merge: mergeSortSteps, quick: quickSortSteps }
const SPEED_MAP      = { slow: 1200, normal: 650, fast: 150 }
const SORT_SPEED_MAP = { slow: 220, normal: 60, fast: 12 }

function getBarColor(idx, ds, accentColor) {
  if (!ds) return { fill: 'var(--bg-card)', stroke: 'var(--border)' }
  const { hi, pivot, sorted, phase } = ds
  if (sorted && sorted.includes(idx)) return { fill: '#fbbf24', stroke: '#f59e0b' }
  if (pivot === idx) return { fill: '#c084fc', stroke: '#a855f7' }
  if (hi && hi.includes(idx)) {
    return phase === 'swap'
      ? { fill: '#fb923c', stroke: '#ea580c' }
      : { fill: accentColor, stroke: accentColor }
  }
  return { fill: 'var(--bg-card)', stroke: 'var(--border)' }
}

const EMPTY_ALGO_FORM = {
  abbr: '', name: '', eng: '', color: '#2dd4bf', tagline: '',
  summary: '', structure: '', structureDesc: '',
  steps: '', useCases: '', caution: '', codeC: '',
  vizType: 'bfs',  // 'bfs' | 'dfs' | 'dijkstra' | 'none'
}

export default function Visualizer({ isAdmin }) {
  /* ── 공통 상태 ── */
  const [pageType, setPageType] = useState('graph')  // 'graph' | 'sort'
  const [speed, setSpeed]       = useState('normal')
  const [running, setRunning]   = useState(false)
  const [done, setDone]         = useState(false)
  const [codePhase, setCodePhase] = useState(null)
  const [showCode, setShowCode] = useState(true)
  const animRef = useRef(null)

  /* ── 그래프 상태 ── */
  const [algo, setAlgo]             = useState('bfs')
  const [startNode, setStartNode]   = useState(0)
  const [endNode, setEndNode]       = useState(14)
  const [selectMode, setSelectMode] = useState(null)
  const [nodeStates, setNodeStates] = useState(() => initTreeStates(0, 14))
  const [pathEdges, setPathEdges]   = useState(new Set())
  const [stats, setStats]           = useState(null)
  const [nodeDists, setNodeDists]   = useState(null)
  const [codeLang, setCodeLang]     = useState('python')
  const [currentQueue, setCurrentQueue] = useState([])
  const [stepMsg, setStepMsg] = useState(null)
  const [customConcepts, setCustomConcepts] = useState([])
  const [showAddForm, setShowAddForm]       = useState(false)
  const [algoForm, setAlgoForm]             = useState(EMPTY_ALGO_FORM)
  const [editAlgoKey, setEditAlgoKey]       = useState(null)
  const statesRef = useRef(initTreeStates(0, 14))

  /* ── 정렬 상태 ── */
  const [sortAlgo, setSortAlgo]             = useState('bubble')
  const [sortArray, setSortArray]           = useState(() => genArray())
  const [sortDisplayState, setSortDisplayState] = useState(null)
  const [sortStats, setSortStats]           = useState(null)

  /* ── 그래프 함수 ── */
  const resetViz = (sNode, eNode) => {
    const s = sNode ?? startNode, e = eNode ?? endNode
    if (animRef.current) clearTimeout(animRef.current)
    setRunning(false); setDone(false); setStats(null); setCodePhase(null)
    setPathEdges(new Set()); setNodeDists(null); setCurrentQueue([]); setStepMsg(null)
    const ns = initTreeStates(s, e)
    statesRef.current = ns; setNodeStates([...ns])
  }

  const runGraph = () => {
    if (animRef.current) clearTimeout(animRef.current)
    setSelectMode(null)
    const ns = initTreeStates(startNode, endNode)
    statesRef.current = ns; setNodeStates([...ns])
    setPathEdges(new Set()); setRunning(true); setDone(false)
    setStats(null); setCodePhase('init'); setNodeDists(null); setCurrentQueue([]); setStepMsg(null)

    const stepFn = GRAPH_FN[algo] ?? GRAPH_FN[concept?.vizType]
    if (!stepFn) { setRunning(false); return }
    const { steps, prev } = stepFn(startNode, endNode)
    const delay = SPEED_MAP[speed]
    let idx = 0

    const tick = () => {
      if (idx >= steps.length) {
        setRunning(false); setDone(true); setCodePhase('done')
        const visitedCount = steps.filter(s => s.type === 'dequeue').length
        setStats({ visited: visitedCount, pathLen: 0, found: false })
        setCurrentQueue([]); setStepMsg(null)
        return
      }
      const step = steps[idx]
      if (step.dist) setNodeDists([...step.dist])
      setCodePhase(step.phase)
      setCurrentQueue(step.queueSnap || [])
      setStepMsg(step.msg || null)
      setNodeStates([...step.nodeStates])
      statesRef.current = [...step.nodeStates]
      idx++

      if (step.found) {
        animRef.current = setTimeout(() => {
          const path = buildTreePath(prev, endNode)
          const pEdges = new Set()
          for (let i = 1; i < path.length; i++)
            pEdges.add(`${Math.min(path[i-1],path[i])}-${Math.max(path[i-1],path[i])}`)
          const final = [...statesRef.current]
          for (const n of path) { if (final[n] !== 'start' && final[n] !== 'end') final[n] = 'path' }
          statesRef.current = final; setNodeStates([...final])
          setPathEdges(pEdges); setRunning(false); setDone(true); setCodePhase('found')
          const visitedCount = steps.filter(s => s.type === 'dequeue').length
          setStats({ visited: visitedCount, pathLen: path.length - 1, found: true })
          setCurrentQueue([]); setStepMsg(null)
        }, delay * 2)
        return
      }
      animRef.current = setTimeout(tick, delay)
    }
    animRef.current = setTimeout(tick, delay)
  }

  const handleNodeClick = (id) => {
    if (running || !selectMode) return
    const blocked = selectMode === 'start' ? endNode : startNode
    if (id === blocked) return
    if (selectMode === 'start') { setStartNode(id); resetViz(id, endNode) }
    else { setEndNode(id); resetViz(startNode, id) }
    setSelectMode(null)
  }

  /* ── 정렬 함수 ── */
  const resetSort = (newArr) => {
    if (animRef.current) clearTimeout(animRef.current)
    setRunning(false); setDone(false); setSortStats(null)
    setCodePhase(null); setSortDisplayState(null)
    if (newArr) setSortArray(newArr)
  }

  const runSort = () => {
    if (animRef.current) clearTimeout(animRef.current)
    setRunning(true); setDone(false); setSortStats(null); setCodePhase('init')
    setSortDisplayState(null)

    const steps = SORT_FN[sortAlgo]([...sortArray])
    const delay = SORT_SPEED_MAP[speed]
    let idx = 0
    let comparisons = 0, swaps = 0

    const tick = () => {
      if (idx >= steps.length) {
        setRunning(false); setDone(true)
        setSortStats({ comparisons, swaps }); return
      }
      const step = steps[idx]
      setSortDisplayState({ ...step })
      if (step.phase === 'compare') comparisons++
      if (step.phase === 'swap') swaps++
      if (step.phase !== 'done') setCodePhase(step.phase)
      else { setCodePhase('done'); setRunning(false); setDone(true); setSortStats({ comparisons, swaps }); return }
      idx++
      animRef.current = setTimeout(tick, delay)
    }
    animRef.current = setTimeout(tick, delay)
  }

  /* ── Admin ── */
  const customMap   = Object.fromEntries(customConcepts.map(c => [c.abbr.toLowerCase(), c]))
  const allConcepts = { ...CONCEPTS, ...customMap }
  const concept     = allConcepts[algo]
  const isCustomAlgo = !!customMap[algo]
  const sortConcept  = SORT_CONCEPTS[sortAlgo]

  const openAddForm = (key) => {
    if (key) {
      const c = customMap[key]
      setAlgoForm({ abbr:c.abbr, name:c.name, eng:c.eng, color:c.color, tagline:c.tagline,
        summary:c.summary, structure:c.structure, structureDesc:c.structureDesc,
        steps:c.steps.map(s=>s.text).join('\n'), useCases:c.useCases.join('\n'),
        caution:c.caution, codeC:c.codeC||'', vizType:c.vizType||'bfs' })
      setEditAlgoKey(key)
    } else { setAlgoForm(EMPTY_ALGO_FORM); setEditAlgoKey(null) }
    setShowAddForm(true)
  }
  const saveAlgo = () => {
    const f = algoForm; if (!f.abbr.trim()||!f.name.trim()) return
    const key = f.abbr.toLowerCase()
    const steps = f.steps.split('\n').filter(Boolean).map((t,i)=>({icon:`${i+1}.`,text:t}))
    const useCases = f.useCases.split('\n').filter(Boolean)
    const nc = {...f, abbr:f.abbr.toUpperCase(), steps, useCases, props:[], vizType:f.vizType||'bfs'}
    if (editAlgoKey) setCustomConcepts(prev=>prev.map(c=>c.abbr.toLowerCase()===editAlgoKey?nc:c))
    else setCustomConcepts(prev=>[...prev,nc])
    setShowAddForm(false); setAlgo(key)
  }
  const deleteAlgo = (key) => {
    setCustomConcepts(prev=>prev.filter(c=>c.abbr.toLowerCase()!==key))
    if (algo===key) setAlgo('bfs')
  }

  /* ── 현재 표시할 배열 ── */
  const displayArr = sortDisplayState ? sortDisplayState.arr : sortArray
  const maxVal = Math.max(...displayArr, 1)
  const barSlot = 760 / displayArr.length
  const barW = barSlot * 0.88

  /* ── 개념 섹션 렌더러 (그래프/정렬 공통) ── */
  const renderConcept = (c) => (
    <>
      <div className={styles.conceptHero} style={{ borderColor: c.color+'30', background: c.color+'06' }}>
        <div className={styles.conceptHeroLeft}>
          <span className={styles.conceptAbbr} style={{ color: c.color }}>{c.abbr}</span>
          <h1 className={styles.conceptName}>{c.name}</h1>
          <p className={styles.conceptEng}>{c.eng}</p>
          <p className={styles.conceptTagline} style={{ color: c.color }}>"{c.tagline}"</p>
          <p className={styles.conceptSummary}>{c.summary}</p>
        </div>
        <div className={styles.conceptHeroRight}>
          <div className={styles.structureBox} style={{ borderColor: c.color+'40' }}>
            <span className={styles.structureLabel}>핵심 자료구조</span>
            <span className={styles.structureValue} style={{ color: c.color }}>{c.structure}</span>
            <span className={styles.structureDesc}>{c.structureDesc}</span>
          </div>
        </div>
      </div>

      <div className={styles.conceptCard}>
        <h2 className={styles.conceptCardTitle}>동작 순서</h2>
        <div className={styles.stepList}>
          {c.steps.map((step, i) => (
            <div key={i} className={styles.stepRow}>
              <span className={styles.stepIcon} style={{ color:c.color, borderColor:c.color+'40', background:c.color+'10' }}>{step.icon}</span>
              <p className={styles.stepText}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.conceptCard}>
        <h2 className={styles.conceptCardTitle}>핵심 특성</h2>
        <div className={styles.propsGrid}>
          {c.props.map(p => (
            <div key={p.label} className={`${styles.propCard} ${p.good===true?styles.propGood:p.good===false?styles.propBad:''}`}>
              <span className={styles.propLabel}>{p.label}</span>
              <span className={styles.propValue}>{p.value}</span>
              <span className={styles.propDesc}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.conceptCard}>
          <h2 className={styles.conceptCardTitle}>언제 사용하나요?</h2>
          <ul className={styles.useCaseList}>
            {c.useCases.map(u => (
              <li key={u} className={styles.useCaseItem}>
                <span className={styles.useCaseDot} style={{ background: c.color }} />{u}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.conceptCard} ${styles.cautionCard}`}>
          <h2 className={styles.conceptCardTitle}>⚠ 주의사항</h2>
          <p className={styles.cautionText}>{c.caution}</p>
        </div>
      </div>

    </>
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── 페이지 타입 스위처 ── */}
        <div className={styles.pageTypeTabs}>
          <button
            className={`${styles.pageTypeTab} ${pageType==='graph'?styles.pageTypeActive:''}`}
            onClick={() => { if (!running) { setPageType('graph'); resetSort() } }}
            disabled={running}
          >그래프 탐색</button>
          <button
            className={`${styles.pageTypeTab} ${pageType==='sort'?styles.pageTypeActive:''}`}
            onClick={() => { if (!running) { setPageType('sort'); resetViz() } }}
            disabled={running}
          >정렬 알고리즘</button>
        </div>

        {/* ════════════════════════════
            그래프 탐색 섹션
        ════════════════════════════ */}
        {pageType === 'graph' && (
          <>
            {/* 알고리즘 탭 */}
            <div className={styles.algoTabs}>
              {Object.values(allConcepts).map(c => {
                const key = c.abbr.toLowerCase(); const isCustom = !!customMap[key]
                return (
                  <button key={key}
                    className={`${styles.algoTab} ${algo===key?styles.algoTabActive:''}`}
                    style={algo===key?{borderColor:c.color,color:c.color,background:c.color+'12'}:{}}
                    onClick={() => { if (!running) { setAlgo(key); setCodePhase(null); resetViz() } }}
                    disabled={running}
                  >
                    <span className={styles.algoTabAbbr}>{c.abbr}</span>
                    <span className={styles.algoTabName}>{c.name}</span>
                    {isAdmin && isCustom && (
                      <span style={{display:'flex',gap:4,marginTop:4}}>
                        <span onClick={e=>{e.stopPropagation();openAddForm(key)}} style={{fontSize:10,padding:'1px 5px',background:'rgba(99,102,241,0.3)',borderRadius:3,cursor:'pointer'}}>수정</span>
                        <span onClick={e=>{e.stopPropagation();deleteAlgo(key)}} style={{fontSize:10,padding:'1px 5px',background:'rgba(248,113,113,0.3)',borderRadius:3,cursor:'pointer'}}>삭제</span>
                      </span>
                    )}
                  </button>
                )
              })}
              {isAdmin && (
                <button className={styles.algoTab} style={{borderStyle:'dashed',color:'#6366f1',borderColor:'#6366f1'}} onClick={()=>openAddForm(null)} disabled={running}>
                  <span className={styles.algoTabAbbr} style={{fontSize:20}}>+</span>
                  <span className={styles.algoTabName}>추가</span>
                </button>
              )}
            </div>

            {renderConcept(concept)}

            {algo !== 'dijkstra' && (
              <div className={styles.conceptCard}>
                <h2 className={styles.conceptCardTitle}>BFS vs DFS 비교</h2>
                <div className={styles.compareTable}>
                  <div className={styles.compareHead}><span /><span style={{color:'#2dd4bf'}}>BFS</span><span style={{color:'#a78bfa'}}>DFS</span></div>
                  {[
                    {item:'자료구조',   bfs:'큐 (Queue)',        dfs:'스택 / 재귀'},
                    {item:'탐색 방식',  bfs:'층별 (레벨 순)',    dfs:'깊이 우선'},
                    {item:'최단 경로',  bfs:'✓ 보장',            dfs:'✗ 미보장'},
                    {item:'메모리',     bfs:'상대적으로 많음',   dfs:'상대적으로 적음'},
                    {item:'적합한 경우',bfs:'최단 경로, 레벨 탐색', dfs:'경로 탐색, 백트래킹'},
                  ].map(row => (
                    <div key={row.item} className={styles.compareRow}>
                      <span className={styles.compareItem}>{row.item}</span>
                      <span className={algo==='bfs'?styles.compareHighlight:''}>{row.bfs}</span>
                      <span className={algo==='dfs'?styles.compareHighlight:''}>{row.dfs}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 코드 */}
            <div className={styles.codeSection}>
              <div className={styles.codeSectionHeader}>
                <div className={styles.codeSectionLeft}>
                  <button className={styles.codeToggle} onClick={()=>setShowCode(v=>!v)}>
                    {showCode?'▾':'▸'} 기본 코드 보기
                  </button>
                  {codePhase && showCode && (
                    <span className={styles.phaseChip}><span className={styles.phaseDot}/>{PHASE_DESC[codePhase]}</span>
                  )}
                </div>
                {showCode && (
                  <div className={styles.langTabs}>
                    {[{id:'python',label:'Python'},{id:'cpp',label:'C++'},{id:'js',label:'JavaScript'}].map(l=>(
                      <button key={l.id} className={`${styles.langTab} ${codeLang===l.id?styles.langActive:''}`} onClick={()=>setCodeLang(l.id)}>{l.label}</button>
                    ))}
                  </div>
                )}
              </div>
              {showCode && (
                <div className={styles.codeBlock}><div className={styles.codeBlockInner}>
                  {(CODE_SNIPPETS[algo]?.[codeLang]??[]).map((line,i)=>{
                    const isActive = codePhase && line.phase===codePhase
                    return (
                      <div key={i} className={`${styles.codeLn} ${isActive?styles.codeLnActive:''} ${line.type==='dim'?styles.codeLnDim:''}`}>
                        <span className={styles.codeNum}>{line.text?i+1:''}</span>
                        <span className={styles.codeText}>{line.text}</span>
                      </div>
                    )
                  })}
                </div></div>
              )}
            </div>

            {isCustomAlgo && concept.codeC && (
              <div className={styles.codeSection}>
                <div className={styles.codeSectionHeader}><div className={styles.codeSectionLeft}><span className={styles.codeToggle}>C 코드</span></div></div>
                <div className={styles.codeBlock}><div className={styles.codeBlockInner}>
                  {concept.codeC.split('\n').map((line,i)=>(
                    <div key={i} className={styles.codeLn}><span className={styles.codeNum}>{i+1}</span><span className={styles.codeText}>{line}</span></div>
                  ))}
                </div></div>
              </div>
            )}

            {/* 직접 해보기 */}
            <div className={styles.trySection}>
              <h2 className={styles.trySectionTitle}>직접 해보기</h2>
              <p className={styles.trySectionDesc}>
                {isCustomAlgo && concept.vizType === 'none'
                  ? '이 알고리즘은 시각화 유형이 "없음"으로 설정되어 있습니다.'
                  : isCustomAlgo
                    ? `${CONCEPTS[concept.vizType]?.name ?? concept.vizType.toUpperCase()} 방식으로 트리 탐색을 시각화합니다.`
                    : '시작점·도착점을 선택하고 알고리즘을 실행해 트리 탐색 과정을 확인하세요.'}
              </p>
            </div>

            {(!isCustomAlgo || (isCustomAlgo && concept.vizType !== 'none')) && (
              <>
                <div className={styles.controls}>
                  <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>속도</span>
                    <div className={styles.btnGroup}>
                      {[{id:'slow',label:'느리게'},{id:'normal',label:'보통'},{id:'fast',label:'빠르게'}].map(s=>(
                        <button key={s.id} className={`${styles.groupBtn} ${speed===s.id?styles.groupActive:''}`} onClick={()=>setSpeed(s.id)}>{s.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.controlGroup}>
                    <span className={styles.controlLabel}>노드 선택</span>
                    <div className={styles.btnGroup}>
                      <button className={`${styles.mazeBtn} ${selectMode==='start'?styles.groupActive:''}`} onClick={()=>!running&&setSelectMode(m=>m==='start'?null:'start')} disabled={running}>🟢 시작점</button>
                      <button className={`${styles.mazeBtn} ${selectMode==='end'?styles.groupActive:''}`} onClick={()=>!running&&setSelectMode(m=>m==='end'?null:'end')} disabled={running}>🔴 도착점</button>
                      <button className={styles.clearBtn} onClick={()=>resetViz()} disabled={running}>초기화</button>
                    </div>
                  </div>
                  <button className={`${styles.runBtn} ${running?styles.runBtnRunning:''}`} onClick={running?undefined:runGraph} disabled={running}>
                    {running ? <><div className={styles.spinner}/>탐색 중...</> : <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="2,1 11,6 2,11" fill="currentColor"/></svg>{algo.toUpperCase()} 시각화</>}
                  </button>
                </div>

                {selectMode && (
                  <div className={styles.selectPrompt}>
                    <span>{selectMode==='start'?'🟢 시작점으로 설정할 노드를 클릭하세요':'🔴 도착점으로 설정할 노드를 클릭하세요'}</span>
                    <button onClick={()=>setSelectMode(null)}>취소</button>
                  </div>
                )}

                {/* 큐/스택 상태 패널 */}
                {(running || done) && (
                  <div className={styles.queuePanel}>
                    <div className={styles.queueLabelWrap}>
                      <span className={styles.queueLabel}>
                        {algo==='bfs'?'큐 (Queue)':algo==='dfs'?'스택 (Stack)':'우선순위 큐'}
                      </span>
                      <span className={styles.queueHint}>
                        {algo==='dfs'?'← top (다음 처리)':'→ 처리 순서'}
                      </span>
                    </div>
                    {stepMsg && running && (
                      <div className={styles.stepMsgRow}>
                        <span className={styles.stepMsgDot} style={{ background: concept.color }}/>
                        <span className={styles.stepMsgText}>{stepMsg}</span>
                      </div>
                    )}
                    <div className={styles.queueList}>
                      {currentQueue.length === 0 ? (
                        <span className={styles.queueEmpty}>비어 있음</span>
                      ) : currentQueue.map((item, i) => (
                        <div key={i}
                          className={`${styles.queueItem} ${item.isNew ? styles.queueItemNew : ''}`}
                          style={{
                            borderColor: concept.color + (item.isNew ? 'cc' : '55'),
                            background:  concept.color + (item.isNew ? '28' : '12'),
                          }}>
                          <span className={styles.queueNodeLabel} style={{ color: concept.color }}>{item.label}</span>
                          {item.cost !== undefined && <span className={styles.queueNodeCost}>{item.cost}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(done || running) && (
                  <div className={styles.statsBar}>
                    {done && stats && (
                      <>
                        <div className={`${styles.statChip} ${stats.found?styles.found:styles.notFound}`}>{stats.found?'✓ 경로 발견':'✗ 경로 없음'}</div>
                        <div className={styles.statChip}><span className={styles.statKey}>방문 노드</span><span className={styles.statNum}>{stats.visited}</span></div>
                        {stats.found && <div className={styles.statChip}><span className={styles.statKey}>경로 길이</span><span className={styles.statNum}>{stats.pathLen}</span></div>}
                      </>
                    )}
                    {running && <div className={styles.statChip}><div className={styles.spinnerSm}/><span>노드 탐색 중...</span></div>}
                  </div>
                )}

                {/* SVG 트리 */}
                <div className={styles.treeWrap}>
                  <svg viewBox="0 0 760 400" className={styles.treeSvg}>
                    {TREE_EDGES.map(({u,v,w})=>{
                      const nu=TREE_NODES[u], nv=TREE_NODES[v]
                      const eKey=`${Math.min(u,v)}-${Math.max(u,v)}`
                      const isPath=pathEdges.has(eKey)
                      return (
                        <g key={eKey}>
                          <line x1={nu.x} y1={nu.y} x2={nv.x} y2={nv.y}
                            stroke={isPath?'#fbbf24':'var(--border)'}
                            strokeWidth={isPath?3:1.5} strokeLinecap="round"
                            style={{transition:'stroke 0.3s ease'}}
                          />
                          {algo==='dijkstra' && (
                            <text x={(nu.x+nv.x)/2} y={(nu.y+nv.y)/2-6}
                              textAnchor="middle" fontSize="10" fontWeight="600"
                              fill="var(--text-muted)" fontFamily="monospace">{w}</text>
                          )}
                        </g>
                      )
                    })}
                    {TREE_NODES.map(({id,x,y,label})=>{
                      const st = nodeStates[id]??'unvisited'
                      const {fill,stroke,textFill} = getNodeStyle(st, concept.color)
                      const isCurrent = st==='current'
                      const blocked = selectMode==='start'?endNode:startNode
                      const canClick = !running && selectMode!==null && id!==blocked
                      const dist = (algo==='dijkstra'&&nodeDists)?nodeDists[id]:null
                      return (
                        <g key={id} onClick={()=>canClick&&handleNodeClick(id)} style={{cursor:canClick?'pointer':'default'}}>
                          {isCurrent && <circle cx={x} cy={y} r={30} className={styles.nodeRing} style={{fill:concept.color+'20',stroke:'none'}}/>}
                          <circle cx={x} cy={y} r={22}
                            style={{fill,stroke,transition:'fill 0.25s ease,stroke 0.25s ease'}}
                            strokeWidth={isCurrent||st==='path'?3:2}
                          />
                          <text x={x} y={y+5} textAnchor="middle" fontSize="13" fontWeight="700"
                            style={{fill:textFill,transition:'fill 0.25s ease'}} fontFamily="var(--font-mono)" pointerEvents="none">
                            {label}
                          </text>
                          {dist!==null&&dist!==Infinity&&(
                            <text x={x} y={y+38} textAnchor="middle" fontSize="10" fontWeight="700"
                              fill={concept.color} fontFamily="monospace" pointerEvents="none">
                              {dist}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className={styles.legend}>
                  {[
                    {bg:'#34d399',                                      label:'시작점'},
                    {bg:'#f87171',                                      label:'도착점'},
                    {bg:concept.color+'22',bd:concept.color,            label:'프론티어 (탐색 예정)'},
                    {bg:concept.color+'55',bd:concept.color+'bb',       label:'방문 완료'},
                    {bg:concept.color,                                  label:'현재 처리 중'},
                    {bg:'#fbbf24',                                      label:'최단 경로'},
                  ].map(item=>(
                    <div key={item.label} className={styles.legendItem}>
                      <div className={styles.legendCircle} style={{background:item.bg,border:item.bd?`2px solid ${item.bd}`:'2px solid transparent'}}/>
                      <span className={styles.legendLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ════════════════════════════
            정렬 알고리즘 섹션
        ════════════════════════════ */}
        {pageType === 'sort' && (
          <>
            {/* 정렬 알고리즘 탭 */}
            <div className={styles.algoTabs}>
              {Object.values(SORT_CONCEPTS).map(c => {
                const key = c.abbr.toLowerCase()
                return (
                  <button key={key}
                    className={`${styles.algoTab} ${sortAlgo===key?styles.algoTabActive:''}`}
                    style={sortAlgo===key?{borderColor:c.color,color:c.color,background:c.color+'12'}:{}}
                    onClick={() => { if (!running) { setSortAlgo(key); resetSort() } }}
                    disabled={running}
                  >
                    <span className={styles.algoTabAbbr}>{c.abbr}</span>
                    <span className={styles.algoTabName}>{c.name}</span>
                  </button>
                )
              })}
            </div>

            {renderConcept(sortConcept)}

            {/* 코드 (Python) */}
            <div className={styles.codeSection}>
              <div className={styles.codeSectionHeader}>
                <div className={styles.codeSectionLeft}>
                  <button className={styles.codeToggle} onClick={()=>setShowCode(v=>!v)}>
                    {showCode?'▾':'▸'} Python 코드 보기
                  </button>
                  {codePhase && showCode && (
                    <span className={styles.phaseChip}><span className={styles.phaseDot}/>{PHASE_DESC[codePhase]}</span>
                  )}
                </div>
                {showCode && (
                  <span className={styles.langTab} style={{cursor:'default',background:'none',color:'var(--text-muted)',fontSize:12,fontFamily:'var(--font-mono)'}}>Python</span>
                )}
              </div>
              {showCode && (
                <div className={styles.codeBlock}><div className={styles.codeBlockInner}>
                  {(SORT_CODE[sortAlgo]??[]).map((line,i)=>{
                    const isActive = codePhase && line.phase===codePhase
                    return (
                      <div key={i} className={`${styles.codeLn} ${isActive?styles.codeLnActive:''}`}>
                        <span className={styles.codeNum}>{line.text?i+1:''}</span>
                        <span className={styles.codeText}>{line.text}</span>
                      </div>
                    )
                  })}
                </div></div>
              )}
            </div>

            {/* 직접 해보기 */}
            <div className={styles.trySection}>
              <h2 className={styles.trySectionTitle}>직접 해보기</h2>
              <p className={styles.trySectionDesc}>배열을 생성하고 정렬 알고리즘을 실행해 정렬 과정을 확인하세요.</p>
            </div>

            {/* 정렬 컨트롤 */}
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>속도</span>
                <div className={styles.btnGroup}>
                  {[{id:'slow',label:'느리게'},{id:'normal',label:'보통'},{id:'fast',label:'빠르게'}].map(s=>(
                    <button key={s.id} className={`${styles.groupBtn} ${speed===s.id?styles.groupActive:''}`} onClick={()=>setSpeed(s.id)}>{s.label}</button>
                  ))}
                </div>
              </div>
              <div className={styles.controlGroup}>
                <span className={styles.controlLabel}>배열</span>
                <div className={styles.btnGroup}>
                  <button className={styles.mazeBtn} onClick={()=>resetSort(genArray())} disabled={running}>새 배열</button>
                  <button className={styles.clearBtn} onClick={()=>resetSort()} disabled={running}>초기화</button>
                </div>
              </div>
              <button className={`${styles.runBtn} ${running?styles.runBtnRunning:''}`} onClick={running?undefined:runSort} disabled={running}>
                {running ? <><div className={styles.spinner}/>정렬 중...</> : <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polygon points="2,1 11,6 2,11" fill="currentColor"/></svg>{sortConcept.abbr} 시작</>}
              </button>
            </div>

            {/* 통계 */}
            {(done || running) && (
              <div className={styles.statsBar}>
                {done && sortStats && (
                  <>
                    <div className={`${styles.statChip} ${styles.found}`}>✓ 정렬 완료</div>
                    <div className={styles.statChip}><span className={styles.statKey}>비교 횟수</span><span className={styles.statNum}>{sortStats.comparisons}</span></div>
                    <div className={styles.statChip}><span className={styles.statKey}>교환 횟수</span><span className={styles.statNum}>{sortStats.swaps}</span></div>
                  </>
                )}
                {running && <div className={styles.statChip}><div className={styles.spinnerSm}/><span>정렬 중...</span></div>}
              </div>
            )}

            {/* 막대 차트 SVG */}
            <div className={styles.treeWrap}>
              <svg viewBox="0 0 760 290" className={styles.treeSvg}>
                {/* baseline */}
                <line x1={0} y1={258} x2={760} y2={258} stroke="var(--border)" strokeWidth={1}/>

                {displayArr.map((val, idx) => {
                  const { fill, stroke } = getBarColor(idx, sortDisplayState, sortConcept.color)
                  const barH = Math.max(4, Math.round((val / maxVal) * 230))
                  const barX = idx * barSlot + (barSlot - barW) / 2
                  const barY = 258 - barH
                  return (
                    <g key={idx}>
                      <rect
                        x={barX} y={barY} width={barW} height={barH} rx={3}
                        style={{ fill, stroke }}
                        strokeWidth={1.5}
                      />
                      <text x={barX + barW/2} y={274}
                        textAnchor="middle" fontSize="9" fill="var(--text-muted)"
                        fontFamily="monospace" pointerEvents="none">
                        {val}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* 범례 */}
            <div className={styles.legend}>
              {[
                {bg:sortConcept.color, label:'비교 중'},
                {bg:'#fb923c',        label:'교환 중'},
                {bg:'#c084fc',        label:'피벗 (Quick Sort)'},
                {bg:'#fbbf24',        label:'정렬 완료'},
                {bg:'var(--bg-card)', bd:'var(--border)', label:'미정렬'},
              ].map(item=>(
                <div key={item.label} className={styles.legendItem}>
                  <div className={styles.legendCircle} style={{background:item.bg,border:item.bd?`2px solid ${item.bd}`:'2px solid transparent'}}/>
                  <span className={styles.legendLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* ── 관리자 모달 ── */}
      {showAddForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:300,display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'40px 16px'}} onClick={()=>setShowAddForm(false)}>
          <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,width:'100%',maxWidth:640,padding:28,display:'flex',flexDirection:'column',gap:14}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{margin:0,fontSize:18,fontWeight:700,color:'#e2e8f0'}}>{editAlgoKey?'알고리즘 수정':'알고리즘 추가'}</h2>
              <button onClick={()=>setShowAddForm(false)} style={{background:'none',border:'none',color:'#64748b',fontSize:18,cursor:'pointer'}}>✕</button>
            </div>
            {[['약어','abbr'],['한국어 이름','name'],['영어 이름','eng'],['색상 (hex)','color'],['한 줄 소개','tagline']].map(([label,key])=>(
              <div key={key} style={{display:'flex',flexDirection:'column',gap:4}}>
                <label style={{fontSize:12,fontWeight:600,color:'#64748b',textTransform:'uppercase'}}>{label}</label>
                <input value={algoForm[key]} onChange={e=>setAlgoForm(f=>({...f,[key]:e.target.value}))}
                  style={{padding:'8px 12px',background:'#0b1220',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#e2e8f0',fontSize:14}}/>
              </div>
            ))}
            {/* 시각화 유형 */}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <label style={{fontSize:12,fontWeight:600,color:'#64748b',textTransform:'uppercase'}}>시각화 유형</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                {[
                  ['bfs',      'BFS',       '큐 방식 너비 우선 탐색', '#2dd4bf'],
                  ['dfs',      'DFS',       '스택 방식 깊이 우선 탐색', '#a78bfa'],
                  ['dijkstra', 'Dijkstra',  '가중치 최단 경로 탐색', '#fbbf24'],
                  ['none',     '없음',      '개념 설명만 제공', '#64748b'],
                ].map(([val, name, desc, color]) => (
                  <label key={val} onClick={()=>setAlgoForm(f=>({...f,vizType:val}))}
                    style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 14px',borderRadius:10,
                      border:`1px solid ${algoForm.vizType===val?color+'80':'rgba(255,255,255,0.08)'}`,
                      background:algoForm.vizType===val?color+'12':'#0b1220',cursor:'pointer',transition:'all 0.15s'}}>
                    <div style={{width:14,height:14,borderRadius:'50%',border:`2px solid ${color}`,
                      background:algoForm.vizType===val?color:'transparent',flexShrink:0,marginTop:2}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:algoForm.vizType===val?color:'#e2e8f0'}}>{name}</div>
                      <div style={{fontSize:11,color:'#64748b',marginTop:2}}>{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {[['요약 설명','summary'],['핵심 자료구조','structure'],['자료구조 설명','structureDesc'],['동작 순서 (한 줄에 하나씩)','steps'],['활용 예시 (한 줄에 하나씩)','useCases'],['주의사항','caution'],['C 코드 예시','codeC']].map(([label,key])=>(
              <div key={key} style={{display:'flex',flexDirection:'column',gap:4}}>
                <label style={{fontSize:12,fontWeight:600,color:'#64748b',textTransform:'uppercase'}}>{label}</label>
                <textarea rows={key==='codeC'?8:3} value={algoForm[key]} onChange={e=>setAlgoForm(f=>({...f,[key]:e.target.value}))}
                  style={{padding:'8px 12px',background:key==='codeC'?'#080f1a':'#0b1220',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:key==='codeC'?'#a5f3fc':'#e2e8f0',fontSize:key==='codeC'?13:14,fontFamily:key==='codeC'?'monospace':'inherit',resize:'vertical'}}/>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:4}}>
              <button onClick={()=>setShowAddForm(false)} style={{padding:'9px 18px',background:'rgba(255,255,255,0.07)',color:'#94a3b8',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,cursor:'pointer'}}>취소</button>
              <button onClick={saveAlgo} style={{padding:'9px 22px',background:'#6366f1',color:'white',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer'}}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
