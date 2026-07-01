export type CodeLang = 'ts' | 'go' | 'java' | 'cpp';

export const ALGORITHM_CODE: Record<string, Record<CodeLang, string>> = {
  'bubble-sort': {
    ts: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    go: `func bubbleSort(arr []int) []int {
  n := len(arr)
  for i := 0; i < n-1; i++ {
    for j := 0; j < n-i-1; j++ {
      if arr[j] > arr[j+1] {
        arr[j], arr[j+1] = arr[j+1], arr[j]
      }
    }
  }
  return arr
}`,
    java: `int[] bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    cpp: `void bubbleSort(std::vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        std::swap(arr[j], arr[j + 1]);
      }
    }
  }
}`,
  },

  'selection-sort': {
    ts: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
    go: `func selectionSort(arr []int) []int {
  n := len(arr)
  for i := 0; i < n-1; i++ {
    minIdx := i
    for j := i + 1; j < n; j++ {
      if arr[j] < arr[minIdx] {
        minIdx = j
      }
    }
    if minIdx != i {
      arr[i], arr[minIdx] = arr[minIdx], arr[i]
    }
  }
  return arr
}`,
    java: `int[] selectionSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx != i) {
      int temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
    cpp: `void selectionSort(std::vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx != i) {
      std::swap(arr[i], arr[minIdx]);
    }
  }
}`,
  },

  'insertion-sort': {
    ts: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    go: `func insertionSort(arr []int) []int {
  for i := 1; i < len(arr); i++ {
    key := arr[i]
    j := i - 1
    for j >= 0 && arr[j] > key {
      arr[j+1] = arr[j]
      j--
    }
    arr[j+1] = key
  }
  return arr
}`,
    java: `int[] insertionSort(int[] arr) {
  for (int i = 1; i < arr.length; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    cpp: `void insertionSort(std::vector<int>& arr) {
  for (int i = 1; i < arr.size(); i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
  },

  'merge-sort': {
    ts: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(l: number[], r: number[]): number[] {
  const res: number[] = [];
  let i = 0, j = 0;
  while (i < l.length && j < r.length) {
    res.push(l[i] <= r[j] ? l[i++] : r[j++]);
  }
  return res.concat(l.slice(i), r.slice(j));
}`,
    go: `func mergeSort(arr []int) []int {
  if len(arr) <= 1 {
    return arr
  }
  mid := len(arr) / 2
  left := mergeSort(arr[:mid])
  right := mergeSort(arr[mid:])
  return merge(left, right)
}
func merge(l, r []int) []int {
  res := []int{}
  i, j := 0, 0
  for i < len(l) && j < len(r) {
    if l[i] <= r[j] {
      res = append(res, l[i])
      i++
    } else {
      res = append(res, r[j])
      j++
    }
  }
  return append(append(res, l[i:]...), r[j:]...)
}`,
    java: `int[] mergeSort(int[] arr) {
  if (arr.length <= 1) return arr;
  int mid = arr.length / 2;
  int[] l = mergeSort(Arrays.copyOfRange(arr, 0, mid));
  int[] r = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
  return merge(l, r);
}
int[] merge(int[] l, int[] r) {
  int[] res = new int[l.length + r.length];
  int i = 0, j = 0, k = 0;
  while (i < l.length && j < r.length)
    res[k++] = l[i] <= r[j] ? l[i++] : r[j++];
  while (i < l.length) res[k++] = l[i++];
  while (j < r.length) res[k++] = r[j++];
  return res;
}`,
    cpp: `void merge(std::vector<int>& a, int lo, int mid, int hi) {
  std::vector<int> l(a.begin() + lo, a.begin() + mid + 1);
  std::vector<int> r(a.begin() + mid + 1, a.begin() + hi + 1);
  int i = 0, j = 0, k = lo;
  while (i < l.size() && j < r.size())
    a[k++] = l[i] <= r[j] ? l[i++] : r[j++];
  while (i < l.size()) a[k++] = l[i++];
  while (j < r.size()) a[k++] = r[j++];
}
void mergeSort(std::vector<int>& a, int lo, int hi) {
  if (lo < hi) {
    int mid = (lo + hi) / 2;
    mergeSort(a, lo, mid);
    mergeSort(a, mid + 1, hi);
    merge(a, lo, mid, hi);
  }
}`,
  },

  'quick-sort': {
    ts: `function quickSort(arr: number[], lo = 0, hi = arr.length - 1): number[] {
  if (lo < hi) {
    const p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}
function partition(arr: number[], lo: number, hi: number): number {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}`,
    go: `func quickSort(arr []int, lo, hi int) []int {
  if lo < hi {
    p := partition(arr, lo, hi)
    quickSort(arr, lo, p-1)
    quickSort(arr, p+1, hi)
  }
  return arr
}
func partition(arr []int, lo, hi int) int {
  pivot := arr[hi]
  i := lo - 1
  for j := lo; j < hi; j++ {
    if arr[j] < pivot {
      i++
      arr[i], arr[j] = arr[j], arr[i]
    }
  }
  arr[i+1], arr[hi] = arr[hi], arr[i+1]
  return i + 1
}`,
    java: `int[] quickSort(int[] arr, int lo, int hi) {
  if (lo < hi) {
    int p = partition(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
  }
  return arr;
}
int partition(int[] arr, int lo, int hi) {
  int pivot = arr[hi];
  int i = lo - 1;
  for (int j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
  }
  int t = arr[i+1]; arr[i+1] = arr[hi]; arr[hi] = t;
  return i + 1;
}`,
    cpp: `int partition(std::vector<int>& a, int lo, int hi) {
  int pivot = a[hi];
  int i = lo - 1;
  for (int j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      i++;
      std::swap(a[i], a[j]);
    }
  }
  std::swap(a[i + 1], a[hi]);
  return i + 1;
}
void quickSort(std::vector<int>& a, int lo, int hi) {
  if (lo < hi) {
    int p = partition(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
  }
}`,
  },

  'heap-sort': {
    ts: `function heapSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr: number[], n: number, i: number) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    go: `func heapSort(arr []int) []int {
  n := len(arr)
  for i := n/2 - 1; i >= 0; i-- {
    heapify(arr, n, i)
  }
  for i := n - 1; i > 0; i-- {
    arr[0], arr[i] = arr[i], arr[0]
    heapify(arr, i, 0)
  }
  return arr
}
func heapify(arr []int, n, i int) {
  largest := i
  l, r := 2*i+1, 2*i+2
  if l < n && arr[l] > arr[largest] {
    largest = l
  }
  if r < n && arr[r] > arr[largest] {
    largest = r
  }
  if largest != i {
    arr[i], arr[largest] = arr[largest], arr[i]
    heapify(arr, n, largest)
  }
}`,
    java: `int[] heapSort(int[] arr) {
  int n = arr.length;
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (int i = n - 1; i > 0; i--) {
    int t = arr[0]; arr[0] = arr[i]; arr[i] = t;
    heapify(arr, i, 0);
  }
  return arr;
}
void heapify(int[] arr, int n, int i) {
  int largest = i;
  int l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest != i) {
    int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;
    heapify(arr, n, largest);
  }
}`,
    cpp: `void heapify(std::vector<int>& a, int n, int i) {
  int largest = i;
  int l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && a[l] > a[largest]) largest = l;
  if (r < n && a[r] > a[largest]) largest = r;
  if (largest != i) {
    std::swap(a[i], a[largest]);
    heapify(a, n, largest);
  }
}
void heapSort(std::vector<int>& a) {
  int n = a.size();
  for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
  for (int i = n - 1; i > 0; i--) {
    std::swap(a[0], a[i]);
    heapify(a, i, 0);
  }
}`,
  },

  'counting-sort': {
    ts: `function countingSort(arr: number[]): number[] {
  const min = Math.min(...arr), max = Math.max(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  for (let x of arr) count[x - min]++;
  for (let i = 1; i < range; i++) count[i] += count[i - 1];
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  return output;
}`,
    go: `func countingSort(arr []int) []int {
  min, max := arr[0], arr[0]
  for _, x := range arr {
    if x < min { min = x }
    if x > max { max = x }
  }
  count := make([]int, max-min+1)
  for _, x := range arr { count[x-min]++ }
  for i := 1; i < len(count); i++ {
    count[i] += count[i-1]
  }
  output := make([]int, len(arr))
  for i := len(arr) - 1; i >= 0; i-- {
    output[count[arr[i]-min]-1] = arr[i]
    count[arr[i]-min]--
  }
  return output
}`,
    java: `int[] countingSort(int[] arr) {
  int min = arr[0], max = arr[0];
  for (int x : arr) {
    if (x < min) min = x;
    if (x > max) max = x;
  }
  int[] cnt = new int[max - min + 1];
  for (int x : arr) cnt[x - min]++;
  for (int i = 1; i < cnt.length; i++)
    cnt[i] += cnt[i - 1];
  int[] out = new int[arr.length];
  for (int i = arr.length - 1; i >= 0; i--) {
    out[cnt[arr[i] - min] - 1] = arr[i];
    cnt[arr[i] - min]--;
  }
  return out;
}`,
    cpp: `void countingSort(std::vector<int>& arr) {
  int min = *std::min_element(arr.begin(), arr.end());
  int max = *std::max_element(arr.begin(), arr.end());
  int range = max - min + 1;
  std::vector<int> count(range, 0);
  for (int x : arr) count[x - min]++;
  for (int i = 1; i < range; i++) count[i] += count[i - 1];
  std::vector<int> out(arr.size());
  for (int i = arr.size() - 1; i >= 0; i--) {
    out[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  arr = out;
}`,
  },

  'radix-sort': {
    ts: `function radixSort(arr: number[]): number[] {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
    countSort(arr, exp);
  return arr;
}
function countSort(arr: number[], exp: number) {
  const output = new Array(arr.length);
  const count = new Array(10).fill(0);
  for (let x of arr) count[Math.floor(x / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  for (let i = 0; i < arr.length; i++) arr[i] = output[i];
}`,
    go: `func radixSort(arr []int) []int {
  max := arr[0]
  for _, x := range arr {
    if x > max { max = x }
  }
  for exp := 1; max/exp > 0; exp *= 10 {
    countSort(arr, exp)
  }
  return arr
}
func countSort(arr []int, exp int) {
  out := make([]int, len(arr))
  cnt := make([]int, 10)
  for _, x := range arr { cnt[x/exp%10]++ }
  for i := 1; i < 10; i++ { cnt[i] += cnt[i-1] }
  for i := len(arr) - 1; i >= 0; i-- {
    out[cnt[arr[i]/exp%10]-1] = arr[i]
    cnt[arr[i]/exp%10]--
  }
  copy(arr, out)
}`,
    java: `int[] radixSort(int[] arr) {
  int max = arr[0];
  for (int x : arr) if (x > max) max = x;
  for (int exp = 1; max / exp > 0; exp *= 10)
    countSort(arr, exp);
  return arr;
}
void countSort(int[] arr, int exp) {
  int[] out = new int[arr.length];
  int[] cnt = new int[10];
  for (int x : arr) cnt[x / exp % 10]++;
  for (int i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
  for (int i = arr.length - 1; i >= 0; i--) {
    out[cnt[arr[i] / exp % 10] - 1] = arr[i];
    cnt[arr[i] / exp % 10]--;
  }
  System.arraycopy(out, 0, arr, 0, arr.length);
}`,
    cpp: `void countSort(std::vector<int>& arr, int exp) {
  std::vector<int> out(arr.size());
  std::vector<int> cnt(10, 0);
  for (int x : arr) cnt[x / exp % 10]++;
  for (int i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
  for (int i = arr.size() - 1; i >= 0; i--) {
    out[cnt[arr[i] / exp % 10] - 1] = arr[i];
    cnt[arr[i] / exp % 10]--;
  }
  arr = out;
}
void radixSort(std::vector<int>& arr) {
  int max = *std::max_element(arr.begin(), arr.end());
  for (int exp = 1; max / exp > 0; exp *= 10)
    countSort(arr, exp);
}`,
  },

  'shell-sort': {
    ts: `function shellSort(arr: number[]): number[] {
  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i++) {
      let j = i;
      while (j >= gap && arr[j - gap] > arr[j]) {
        [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
        j -= gap;
      }
    }
  }
  return arr;
}`,
    go: `func shellSort(arr []int) []int {
  n := len(arr)
  for gap := n / 2; gap > 0; gap = gap / 2 {
    for i := gap; i < n; i++ {
      j := i
      for j >= gap && arr[j-gap] > arr[j] {
        arr[j-gap], arr[j] = arr[j], arr[j-gap]
        j -= gap
      }
    }
  }
  return arr
}`,
    java: `int[] shellSort(int[] arr) {
  for (int gap = arr.length / 2; gap > 0; gap /= 2) {
    for (int i = gap; i < arr.length; i++) {
      int j = i;
      while (j >= gap && arr[j - gap] > arr[j]) {
        int t = arr[j - gap];
        arr[j - gap] = arr[j];
        arr[j] = t;
        j -= gap;
      }
    }
  }
  return arr;
}`,
    cpp: `void shellSort(std::vector<int>& arr) {
  for (int gap = arr.size() / 2; gap > 0; gap /= 2) {
    for (int i = gap; i < arr.size(); i++) {
      int j = i;
      while (j >= gap && arr[j - gap] > arr[j]) {
        std::swap(arr[j - gap], arr[j]);
        j -= gap;
      }
    }
  }
}`,
  },

  'bucket-sort': {
    ts: `function bucketSort(arr: number[]): number[] {
  const min = Math.min(...arr), max = Math.max(...arr);
  const n = arr.length, buckets = Math.sqrt(n);
  const bucketSize = (max - min + 1) / buckets;
  const bucket: number[][] = Array.from({ length: buckets }, () => []);
  for (let x of arr) {
    const idx = Math.min(buckets - 1, Math.floor((x - min) / bucketSize));
    bucket[idx].push(x);
  }
  bucket.forEach(b => b.sort((a, c) => a - c));
  return bucket.flat();
}`,
    go: `func bucketSort(arr []int) []int {
  if len(arr) == 0 { return arr }
  min, max := arr[0], arr[0]
  for _, x := range arr {
    if x < min { min = x }
    if x > max { max = x }
  }
  buckets := int(math.Sqrt(float64(len(arr))))
  bucket := make([][]int, buckets)
  for _, x := range arr {
    idx := (x - min) * buckets / (max - min + 1)
    bucket[idx] = append(bucket[idx], x)
  }
  for i := 0; i < buckets; i++ {
    sort.Ints(bucket[i])
  }
  result := []int{}
  for _, b := range bucket {
    result = append(result, b...)
  }
  return result
}`,
    java: `int[] bucketSort(int[] arr) {
  int min = arr[0], max = arr[0];
  for (int x : arr) {
    if (x < min) min = x;
    if (x > max) max = x;
  }
  int b = (int)Math.sqrt(arr.length);
  List<Integer>[] bucket = new List[b];
  for (int i = 0; i < b; i++) bucket[i] = new ArrayList<>();
  for (int x : arr) {
    int idx = Math.min(b - 1, (x - min) * b / (max - min + 1));
    bucket[idx].add(x);
  }
  for (List<Integer> l : bucket) Collections.sort(l);
  int[] out = new int[arr.length];
  int k = 0;
  for (List<Integer> l : bucket)
    for (int x : l) out[k++] = x;
  return out;
}`,
    cpp: `void bucketSort(std::vector<int>& arr) {
  int min = *std::min_element(arr.begin(), arr.end());
  int max = *std::max_element(arr.begin(), arr.end());
  int b = (int)std::sqrt(arr.size());
  std::vector<std::vector<int>> bucket(b);
  for (int x : arr) {
    int idx = std::min(b - 1, (x - min) * b / (max - min + 1));
    bucket[idx].push_back(x);
  }
  for (auto& b : bucket) std::sort(b.begin(), b.end());
  int idx = 0;
  for (auto& b : bucket)
    for (int x : b) arr[idx++] = x;
}`,
  },

  'tim-sort': {
    ts: `function timSort(arr: number[]): number[] {
  const RUN = 8;
  for (let i = 0; i < arr.length; i += RUN)
    insertionSort(arr, i, Math.min(i + RUN, arr.length));
  for (let size = RUN; size < arr.length; size *= 2)
    for (let lo = 0; lo < arr.length; lo += 2 * size)
      merge(arr, lo, Math.min(lo + size, arr.length), Math.min(lo + 2 * size, arr.length));
  return arr;
}
function insertionSort(a: number[], lo: number, hi: number) {
  for (let i = lo + 1; i < hi; i++) {
    let j = i - 1, k = a[i];
    while (j >= lo && a[j] > k) a[j + 1] = a[j--];
    a[j + 1] = k;
  }
}
function merge(a: number[], lo: number, mid: number, hi: number) {
  const l = a.slice(lo, mid), r = a.slice(mid, hi);
  let i = 0, j = 0, k = lo;
  while (i < l.length && j < r.length) a[k++] = l[i] <= r[j] ? l[i++] : r[j++];
  while (i < l.length) a[k++] = l[i++];
  while (j < r.length) a[k++] = r[j++];
}`,
    go: `func timSort(arr []int) []int {
  const RUN = 8
  n := len(arr)
  for i := 0; i < n; i += RUN {
    insertSort(arr, i, min(i+RUN, n))
  }
  for size := RUN; size < n; size *= 2 {
    for lo := 0; lo < n; lo += 2 * size {
      merge(arr, lo, min(lo+size, n), min(lo+2*size, n))
    }
  }
  return arr
}
func insertSort(a []int, lo, hi int) {
  for i := lo + 1; i < hi; i++ {
    j, k := i-1, a[i]
    for j >= lo && a[j] > k {
      a[j+1] = a[j]
      j--
    }
    a[j+1] = k
  }
}
func merge(a []int, lo, mid, hi int) {
  l := append([]int{}, a[lo:mid]...)
  r := append([]int{}, a[mid:hi]...)
  i, j := 0, 0
  for k := lo; k < hi; k++ {
    if i < len(l) && (j >= len(r) || l[i] <= r[j]) {
      a[k] = l[i]
      i++
    } else {
      a[k] = r[j]
      j++
    }
  }
}`,
    java: `int[] timSort(int[] arr) {
  final int RUN = 8;
  for (int i = 0; i < arr.length; i += RUN)
    insertSort(arr, i, Math.min(i + RUN, arr.length));
  for (int sz = RUN; sz < arr.length; sz *= 2)
    for (int lo = 0; lo < arr.length; lo += 2 * sz)
      merge(arr, lo, Math.min(lo + sz, arr.length), Math.min(lo + 2 * sz, arr.length));
  return arr;
}
void insertSort(int[] a, int lo, int hi) {
  for (int i = lo + 1; i < hi; i++) {
    int j = i - 1, k = a[i];
    while (j >= lo && a[j] > k) a[j + 1] = a[j--];
    a[j + 1] = k;
  }
}
void merge(int[] a, int lo, int mid, int hi) {
  int[] l = Arrays.copyOfRange(a, lo, mid);
  int[] r = Arrays.copyOfRange(a, mid, hi);
  int i = 0, j = 0;
  for (int k = lo; k < hi; k++)
    a[k] = (i < l.length && (j >= r.length || l[i] <= r[j])) ? l[i++] : r[j++];
}`,
    cpp: `void merge(std::vector<int>& a, int lo, int mid, int hi) {
  std::vector<int> l(a.begin() + lo, a.begin() + mid);
  std::vector<int> r(a.begin() + mid, a.begin() + hi);
  int i = 0, j = 0, k = lo;
  while (i < l.size() && j < r.size())
    a[k++] = l[i] <= r[j] ? l[i++] : r[j++];
  while (i < l.size()) a[k++] = l[i++];
  while (j < r.size()) a[k++] = r[j++];
}
void insertSort(std::vector<int>& a, int lo, int hi) {
  for (int i = lo + 1; i < hi; i++) {
    int k = a[i], j = i - 1;
    while (j >= lo && a[j] > k) a[j + 1] = a[j--];
    a[j + 1] = k;
  }
}
void timSort(std::vector<int>& arr) {
  const int RUN = 8;
  int n = arr.size();
  for (int i = 0; i < n; i += RUN)
    insertSort(arr, i, std::min(i + RUN, n));
  for (int sz = RUN; sz < n; sz *= 2)
    for (int lo = 0; lo < n; lo += 2 * sz)
      merge(arr, lo, std::min(lo + sz, n), std::min(lo + 2 * sz, n));
}`,
  },

  'intro-sort': {
    ts: `function introSort(arr: number[], lo = 0, hi = arr.length - 1, maxDepth = 2 * Math.log2(arr.length)) {
  while (lo < hi) {
    if (hi - lo < 8) {
      insertionSort(arr, lo, hi + 1);
      return;
    }
    if (maxDepth-- <= 0) {
      heapSort(arr, lo, hi + 1);
      return;
    }
    const p = partition(arr, lo, hi);
    introSort(arr, lo, p - 1, maxDepth);
    lo = p + 1;
  }
  return arr;
}
function partition(a: number[], lo: number, hi: number): number {
  let i = lo - 1;
  for (let j = lo; j < hi; j++)
    if (a[j] < a[hi]) [a[++i], a[j]] = [a[j], a[i]];
  [a[++i], a[hi]] = [a[hi], a[i]];
  return i;
}`,
    go: `func introSort(arr []int) []int {
  introsortHelper(arr, 0, len(arr)-1, 2*bits.Len(uint(len(arr))))
  return arr
}
func introsortHelper(a []int, lo, hi, maxDepth int) {
  for lo < hi {
    if hi-lo < 8 {
      insertSort(a, lo, hi+1)
      return
    }
    if maxDepth == 0 {
      heapSort(a, lo, hi+1)
      return
    }
    p := partition(a, lo, hi)
    introsortHelper(a, lo, p-1, maxDepth-1)
    lo = p + 1
    maxDepth--
  }
}`,
    java: `int[] introSort(int[] arr) {
  introsortHelper(arr, 0, arr.length - 1, (int)(2 * Math.log(arr.length) / Math.log(2)));
  return arr;
}
void introsortHelper(int[] a, int lo, int hi, int maxDepth) {
  while (lo < hi) {
    if (hi - lo < 8) {
      insertSort(a, lo, hi + 1);
      return;
    }
    if (maxDepth-- <= 0) {
      heapSort(a, lo, hi + 1);
      return;
    }
    int p = partition(a, lo, hi);
    introsortHelper(a, lo, p - 1, maxDepth);
    lo = p + 1;
  }
}`,
    cpp: `int partition(std::vector<int>& a, int lo, int hi) {
  int pivot = a[hi], i = lo - 1;
  for (int j = lo; j < hi; j++)
    if (a[j] < pivot) std::swap(a[++i], a[j]);
  std::swap(a[++i], a[hi]);
  return i;
}
void introSortHelper(std::vector<int>& a, int lo, int hi, int maxDepth) {
  while (lo < hi) {
    if (hi - lo < 8) {
      std::sort(a.begin() + lo, a.begin() + hi + 1);
      return;
    }
    if (maxDepth-- <= 0) {
      std::make_heap(a.begin() + lo, a.begin() + hi + 1);
      std::sort_heap(a.begin() + lo, a.begin() + hi + 1);
      return;
    }
    int p = partition(a, lo, hi);
    introSortHelper(a, lo, p - 1, maxDepth);
    lo = p + 1;
  }
}
void introSort(std::vector<int>& arr) {
  introSortHelper(arr, 0, arr.size() - 1, 2 * (int)std::log2(arr.size()));
}`,
  },

  'bitonic-sort': {
    ts: `function bitonicSort(arr: number[], lo = 0, cnt = arr.length, dir = true) {
  if (cnt > 1) {
    const k = Math.floor(cnt / 2);
    bitonicSort(arr, lo, k, true);
    bitonicSort(arr, lo + k, k, false);
    bitonicMerge(arr, lo, cnt, dir);
  }
  return arr;
}
function bitonicMerge(arr: number[], lo: number, cnt: number, dir: boolean) {
  if (cnt > 1) {
    const k = Math.floor(cnt / 2);
    for (let i = lo; i < lo + k; i++)
      compareSwap(arr, i, i + k, dir);
    bitonicMerge(arr, lo, k, dir);
    bitonicMerge(arr, lo + k, k, dir);
  }
}
function compareSwap(a: number[], i: number, j: number, dir: boolean) {
  if ((a[i] > a[j]) === dir) [a[i], a[j]] = [a[j], a[i]];
}`,
    go: `func bitonicSort(arr []int) []int {
  bitonicSortHelper(arr, 0, len(arr), true)
  return arr
}
func bitonicSortHelper(a []int, lo, cnt int, dir bool) {
  if cnt > 1 {
    k := cnt / 2
    bitonicSortHelper(a, lo, k, true)
    bitonicSortHelper(a, lo+k, k, false)
    bitonicMerge(a, lo, cnt, dir)
  }
}
func bitonicMerge(a []int, lo, cnt int, dir bool) {
  if cnt > 1 {
    k := cnt / 2
    for i := lo; i < lo+k; i++ {
      compareSwap(a, i, i+k, dir)
    }
    bitonicMerge(a, lo, k, dir)
    bitonicMerge(a, lo+k, k, dir)
  }
}
func compareSwap(a []int, i, j int, dir bool) {
  if (a[i] > a[j]) == dir {
    a[i], a[j] = a[j], a[i]
  }
}`,
    java: `int[] bitonicSort(int[] arr) {
  bitonicSortHelper(arr, 0, arr.length, true);
  return arr;
}
void bitonicSortHelper(int[] a, int lo, int cnt, boolean dir) {
  if (cnt > 1) {
    int k = cnt / 2;
    bitonicSortHelper(a, lo, k, true);
    bitonicSortHelper(a, lo + k, k, false);
    bitonicMerge(a, lo, cnt, dir);
  }
}
void bitonicMerge(int[] a, int lo, int cnt, boolean dir) {
  if (cnt > 1) {
    int k = cnt / 2;
    for (int i = lo; i < lo + k; i++) compareSwap(a, i, i + k, dir);
    bitonicMerge(a, lo, k, dir);
    bitonicMerge(a, lo + k, k, dir);
  }
}
void compareSwap(int[] a, int i, int j, boolean dir) {
  if ((a[i] > a[j]) == dir) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
  }
}`,
    cpp: `void compareSwap(std::vector<int>& a, int i, int j, bool dir) {
  if ((a[i] > a[j]) == dir) std::swap(a[i], a[j]);
}
void bitonicMerge(std::vector<int>& a, int lo, int cnt, bool dir) {
  if (cnt > 1) {
    int k = cnt / 2;
    for (int i = lo; i < lo + k; i++)
      compareSwap(a, i, i + k, dir);
    bitonicMerge(a, lo, k, dir);
    bitonicMerge(a, lo + k, k, dir);
  }
}
void bitonicSort(std::vector<int>& a, int lo, int cnt, bool dir) {
  if (cnt > 1) {
    int k = cnt / 2;
    bitonicSort(a, lo, k, true);
    bitonicSort(a, lo + k, k, false);
    bitonicMerge(a, lo, cnt, dir);
  }
}
void bitonicSort(std::vector<int>& arr) {
  bitonicSort(arr, 0, arr.size(), true);
}`,
  },
};
