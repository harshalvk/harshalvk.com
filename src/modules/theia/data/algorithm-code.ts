// src/modules/theia/data/algorithm-code.ts

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
    cpp: `std::vector<int> bubbleSort(std::vector<int>& arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        std::swap(arr[j], arr[j + 1]);
      }
    }
  }
  return arr;
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
    cpp: `std::vector<int> selectionSort(std::vector<int>& arr) {
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
  return arr;
}`,
  },

  // Stubs — add the rest following this exact pattern.
  // Each algo needs its `line` numbers in sorting-algorithms.ts to match
  // the line count of whichever snippet is currently selected (ts/go/java).
  // If line counts differ across languages, store separate line maps per lang
  // (see CodeBlock note below) instead of a single shared `line` number.
};
