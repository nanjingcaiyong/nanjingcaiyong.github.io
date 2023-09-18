### 

数组随机排序 
```js
const shuffle = (arr) => {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
};
```