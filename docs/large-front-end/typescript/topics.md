

### 第一题，makeCustomer 为什么返回 User 会报错？

```ts
type User = {
  id: number;
  kind: string;
};

function makeCustomer<T extends User>(u: T): T {
/*
不能将类型“{ id: number; kind: string; }”分配给类型“T”。
"{ id: number; kind: string; }" 可赋给 "T" 类型的约束，但可以使用约束 "User" 的其他子类型实例化 "T"。
*/
  return {
    id: u.id,
    kind: 'customer'
  }
}
```

原因：首先 `T extends User` 说明 T 是 `User` 的子类型，`T` 可以赋值给 `User`，但 `User` 不能赋值给 `T`。

**解法：**
```ts
type User = {
  id: number;
  kind: string;
}

// 第一种解法
function makeCustomer<T extends User>(u: T): User {
  return {
    id: u.id,
    kind: 'customer'
  }
}

// 第二种解法, 修改返回值类型为 User 的子类型
function makeCustomer<T extends User>(u: T): T {
  return {
    ...u,
    id: t.id,
    kind: 'customer'
  }
}
```


### 第二题：本道题我们希望参考 `a` 和 `b` 的类型都是一致的，即 `a` 和 `b` 同时为 `number` 或 `string` 类型。当它们的类型不一致的值，TS 类型检查器能自动提示对应的错误信息。
```ts
// 我们想让函数接受的 a 和 b 类型一致，如果不一致，函数就报错！
function func(a: string | number, b: string | number) {
  if (typeof a === 'string') {
    return a + ':' + b; // no error but b can be number!
  } else {
    return a + b; // error as b can be number | string
  }
}

func(2, 3);      // ok
func(1, 'a');   // Error
func('a', 2);   // Error
func('a', 'b'); // ok
```

**解法**

```ts
// 第一种解法，函数重载
function func (a: number, b: number): number;
funciton func (a: string, b: string): string;
function func (a: number | string, b: number: string) : number | string {
  if (typeof a === 'string' && typeof b === 'string') {
    return a + ':' + b
  }
  return Number(a) + Number(b)
}

func(2, 3);    // Ok
func(1, 'a');  // Error
func('a', 2);  // Error
func('a', 'b');// Ok


// 第二种解法，extends 约束
const func = <T extends string | Number>(a: T, b: T): string | number => {
  if (typeof a  === 'string' && typeof b === 'string') {
    return a + ':' + b
  }
  return Number(a) + Number(b)
}

func(2, 3) // Ok
func(1, 'a') // Error
func('a', 2) // Error
func('a', 'b') // Ok
```

### 第三题: 定义一个 SetOptional 工具类型，支持把给定的 keys 对应的属性变成可选的。继续实现 SetRequired 工具类型，利用它可以把指定的 keys 对应的属性变成必选的。

```ts
type Foo = {
	a: number;
	b?: string;
	c: boolean;
}

// 测试用例
type SomeOptional = SetOptional<Foo, 'a' | 'b'>;

// type SomeOptional = {
// 	a?: number; // 该属性已变成可选的
// 	b?: string; // 保持不变
// 	c: boolean; 
// }

type Foo2 = {
	a?: number;
	b: string;
	c?: boolean;
}

// 测试用例
type SomeRequired = SetRequired<Foo2, 'b' | 'c'>;
// type SomeRequired = {
// 	a?: number;
// 	b: string; // 保持不变
// 	c: boolean; // 该属性已变成必填
// }

```

`解法1`：SetOptional

- 1. 把 `所有属性` 都置为 `可选类型`
- 2. 在把 `设置外` 的属性都置为 `必选类型`
- 3. 随后使用 `&` 进行类型合并

```ts
// 所有属性全部置为可选
type PartialOptions<T> = {
  [K in keyof T]?: T[K]
}
// 过滤出设置外的属性，这也是 Exclude 的实现方法
type FilterNotExist<T, K> = T extends K ? never : T

type RequiredFunc<T, K extends keyof T> = {
  [P in K]-?: T[P]
}

type Foo = {
  a: number
  b?: string
  c: boolean
}
// 实现内置工具方法
type SetOptional<T, K extends keyof T> = PartialOptions<T> &
  RequiredFunc<T, FilterNotExist<keyof T, K>>

// 成功实现
const foo: SetOptional<Foo, 'a' | 'b'> = {
  c: true
}
```

`解法2`：SetRequired

- 1. 筛选出指定的属性进行必选操作
- 2. 筛选出剩余属性进行分布式类型操作
- 3. 最后进行 & 合并

```ts

type FilterNotExist<T,K> = T extends K ? never : T;
type PartialOptions<T, U extends keyof T> = {
  [K in U]?: T[K]
}
type RequiredFunc<T, K extends keyof T> = {
  [P in K]-?: T[K]
}


type Foo = {
  a: number;
  b?: string;
  c: boolean;
}

type SetRequied<T, U extends keyof T> = RequiredFunc<T, U> & PartialOptions<T, FilterNotExist<keyof T, U>>

type SomeOptional = SetRequied<Foo, 'a' | 'b'>

let T0: SomeOptional = {
  a: 1,
  b: '1'
}

```

### 第四题: 定义一个 `ConditionalPick` 工具类型，支持根据指定的 `Condition` 条件来生成新的类型

```ts
// 提取指定类型参数生成新类型！

interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}
```

**解: ConditionalPick**

- 1. 使用 `in keyof` 触发分布式条件类型
- 2. 通过 `as` 断言进行判断 `T[K]` 是否约束于 `U` 成功返回键名 `K`，失败返回 `never`，该键名直接不存在。键名只允许 `string`，`number`，`symbol`
```ts
interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

type ConditionalPick<T, U> = {
  [K in keyof T as (T[K] extends U ? K : never)]: T[K]
}

type StringKeyOnly = ConditionalPick<Example, string>
```


### 第五题: 定义一个工具类型 `AppendArgument`，为已有的函数类型增加指定类型的参数，新增的参数名是 `x`，将作为新函数类型的第一个参数。

```ts
type Fn = (a: number, b: string) => number;

type AppendArgument<F extends (...args: any[]) => any, A> =  (x: A, ...args: Parameters<F>) => ReturnType<F>

type FF = AppendArgument<Fn, boolean>; // // (x: boolean, a: number, b: string) => number
```


### 定义一个 `NativeFlat` 工具类型，支持把数组类型拍平（扁平化）,在完成 `NaiveFlat` 工具类型之后，再继续实现 `DeepFlat` 工具类型

```ts

// 1. 定义一个 NativeFlat
type NaiveFlat<T extends any[]> = // 你的实现代码

// 测试用例
type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>
// NaiveResult的结果： "a" | "b" | "c" | "d"
```

**解法1**

```ts
type NaiveFlat<T extends any[]> = T extends any[] ? NaiveFlat<T[number]> : T;

type T0 = NaiveFlat<[['a', ['b', 'c'], ['d']]]>; // type T0 = "b" | "c" | "d" | "a"
```

注意 `NaiveFlat<T[number]>` `递归遍历` 时 `类型索引` 的使用

**解法2**

```ts
type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]]

type DeepFlat<T extends any[]> = {
  [K in keyof T]: T[K] extends any[] ? DeepFlat<T[K]> : T[K]
}[number]

type T0 = DeepFlat<Deep>
```

这里的 `{}[number]`, 因为对象类型的 `K` 是数组对象的索引，所以我们用 `[number]` 将其展开成 `联合类型`。

在对象尾后使用 `[keyof obj]`, 还可以将 `对象` 转换成键值的 `联合类型`，并且把 `never` 类型都给去除掉

```ts
type Arr = [1,2,3,4,5,6][number]; // type Arr = 6 | 1 | 2 | 3 | 4 | 5

type Person = {
  id: never;
  name: string;
  age: never;
  gender?: true;
}

type T0 = Person[keyof Person]; // type T0 = string | true
```


### 第七题: 使用类型别名定义一个 `EmptyObject` 类型，使得该类型只允许 `空对象赋值`, 更改以下 `takeSomeTypeOnly` 函数的类型定义，让它的参数只允许严格 `SomeType` 类型的值。

```ts
 // 1. 使用类型别名定义一个 `EmptyObject` 类型，使得该类型只允许空对象赋值
type EmptyObject = // 你的代码

// 测试用例
const shouldPass: EmptyObject = {}; // 可以正常赋值
const shouldFail: EmptyObject = { // 将出现编译错误
  prop: "TS"
}

// 2. 更改以下 `takeSomeTypeOnly` 函数的类型定义，
//    让它的参数只允许严格SomeType类型的值
type SomeType =  {
  prop: string
}

// 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
function takeSomeTypeOnly(x: SomeType) { return x }

// 测试用例：
const x = { prop: 'a' };
takeSomeTypeOnly(x) // 可以正常调用

const y = { prop: 'a', addditionalProp: 'x' };
takeSomeTypeOnly(y) // 将出现编译错误
```

**解：EmptyObject**

```ts
type EmptyObject = {
  [K in keyof any]: never;
}
const T0:EmptyObject = {};
const T1:EmptyObject = {name: 'TS'}; // Error: 不能将类型“string”分配给类型“never”。
```

### 第八题 定义 `NonEmptyArray` 工具类型，用于确保数据非空数组。

```ts
type NonEmptyArray<T> = never;  // 你的实现代码

const a: NonEmptyArray<string> = []; // 将出现编译错误
const b = NonEmptyArray<stromh> = ['hello ts']; // 非空数据，正常使用
```

`解法1：`
```ts
type NonEmptyArray<T> = [T, ...T[]];
const T0: NonEmptyArray<string> = [];           // 编译报错
const T1: NonEmptyArray<string> = ['Hello Ts'];
```

`解法2：`
```ts
type NonEmptyArray<T> = T[] & {0: T}
const T0: NonEmptyArray<string> = [];           // 编译报错
const T1: NonEmptyArray<string> = ['Hello Ts'];
```


### 第九题: 定义一个 `JoinStrArray` 工具类型，用于根据指定的 `Separator` 分隔符，对字符串数组类型进行拼接。

```ts
type JoinStrArray<
  Arr extends string[],
  Separator extends string,
  Result extends string = ''
> = never; // 你的实现代码

type Names = ['Sem', 'Lolo', 'Kaquko'];
type NamesComma = JoinStrArray<Names, ','>; // "Sem,Lolo,Kaquko" 
type NamesSpace = JoinStrArray<Names, ' '>; // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, '⭐️'>;// "Sem⭐️Lolo⭐️Kaquko"
```

解法：