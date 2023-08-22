
## 内置高级类型

### Awaited\<Type\>

### Partial\<Type\> 索引变为可选

### Required\<Type\> 索引去除可选

### Readonly\<Type\> 索引变为只读

### Record\<Keys, Type\> 映射一组相同类型的索引

### Pick\<Type, Keys\> 提取指定索引

### Omit\<Type, Keys\> 排除指定索引

与 `Pick` 功能相反

### Exclude\<UnionType, ExcludedMembers\> 排除

实现
```ts
type Exclude<T, U> = T extends U ? never : T;
```

使用
```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
     
type T0 = "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
     
type T1 = "c"
type T2 = Exclude<string | number | (() => void), Function>;
     
type T2 = string | number
 
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
 
type T3 = Exclude<Shape, { kind: "circle" }>
```

### Extract\<Type, Union\> 提取

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
     
type T0 = "a"
type T1 = Extract<string | number | (() => void), Function>;
     
type T1 = () => void
 
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
 
type T2 = Extract<Shape, { kind: "circle" }>
```

### NonNullable\<Type\>

```ts
type T0 = NonNullable<string | number | undefined>;  // type T0 = string 
type T1 = NonNullable<string[] | null | undefined>;  // type T1 = string[]
```

### Parameters\<Type\>

```ts
declare function f1 (a: number, b: string): void;

type T0 = Parameters<typeof f1>; // type T0 = [a: number, b: string]

type T1 = Parameters<(a: number) => void>; // type T1 = [a: number]

type T3 = Parameters<any>; // type T3 = unknown[];

type T4 = Parameters<never>; // type T4 = never;
```

### ReturnType\<Type\>

```ts
declare function f1 (): {a: number, b: string}

type T0 = ReturnType<typeof f1>; // type T0 = {a: number, b: string}

type T1 = ReturnType<() => string>; // type T1 = string;
```

### ConstructorParameters\<Type\>
```ts
class C {
  constructor (a: number, b: string) {}
}

type T0 = ConstructorParameters<typeof C>;  // type T0 = [a: number, b: string]

type T1 = ConstructorParameters<any>; // type T1 = unknown[]

```

### ThisType\<Type\>



### ThisParameterType\<Type\>

### OmitThisParameter\<Type\>

### InstanceType\<Type\>

### Uppercase\<StringType\>

### Lowercase\<StringType\>

### Capitalize\<StringType\>

### Uncapitalize\<StringType\>


## 关键字

### infer

```ts
type Func = (...args: any[]) => any;
type FunctionReturnType<T extends Func> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
```

`infer`，意为推断，如 infer R 中 R 就表示 `待推断的类型`。 `infer` 只能在 `条件类型` 中使用，因为我们实际上仍然需要类型结构是一致的，比如上例中类型信息需要是一个 `函数类型` 结构，我们才能提取出它的返回值类型。如果连函数类型都不是，那我只会给你一个 never 。

这里的类型结构当然并 `不局限` 于 `函数类型` 结构，还可以是`数组`：

```ts
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
```

除了数组，infer 结构也可以是接口：


### extends

条件类型中使用 `extends` 判断类型的 `兼容性`，而非判断类型的 `全等性`

```ts
type T0 = any extends string ? 1 : 2;     // 1 | 2
type T3 = any extends any ? 1 : 2;        // 1

type T4 = never extends string ? 1 : 2;   // 1
type T5 = never extends never ? 1 : 2;    // 1

type Special<T> = T extends never ? 1 : 2;  // type T0 = never
type T6 = Special<never>;  // type T0 = never
```

```ts
type T0 = 1 | 2 extends 1 | 2 | 3 | 4 ? true : false;

interface Person {
  name: string;
  age: number;
}

interface Male {
  name: string;
  age: number;
  gender: boolean;
}

type T1 = Male extends Male ? true : false;
```

```ts
type T0 = string | number extends string ? true : false; // type T0 = false;
```

### as

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

### typeof

`typeof` 操作符用于获取 `变量`（`typeof 后面只能跟变量，不能是类型`） 的类型

## 基础类型

### 原始类型

**any**

**unknown**

只能赋值给 `unknown` 和 `any` 类型

**never**

任何类型的子类型

在类型流的分析中，一旦一个 `返回值` 类型为 `never` 的函数被调用，那么下方的代码都会被视为 `无效` 的代码（即无法执行到）：
```ts
function justThrow(): never {
  throw new Error()
}

function foo (input:number){
  if(input > 1){
    justThrow();
    // 等同于 return 语句后的代码，即 Dead Code
    const name = "linbudu";
  }
}

```

### `any` 和 `unknown` 的区别

1、unknown 类型可以 `被赋值` 任意类型，但只能 `赋值` 给 `any` 或 `unknown` 类型；any 类型可以 `被赋值` 任意类型，也可以 `赋值` 给任意类型


### object 和 Object 区别

首先是 `Object` 的使用。被 JavaScript 原型链折磨过的同学应该记得，原型链的顶端是 `Object` 以及 `Function`，这也就意味着所有的原始类型与对象类型最终都指向 `Object`，在 TypeScript 中就表现为 `Object` 包含了所有的类型：

```ts
// 对于 undefined、null、void 0 ，需要关闭 strictNullChecks
const tmp1: Object = undefined;
const tmp2: Object = null;
const tmp3: Object = void 0;

const tmp4: Object = 'linbudu';
const tmp5: Object = 599;
const tmp6: Object = { name: 'linbudu' };
const tmp7: Object = () => {};
const tmp8: Object = [];
```

在任何情况下，你都不应该使用这些装箱类型(Boolean、Number、String、Symbol)。

object 的引入就是为了解决对 Object 类型的错误使用，它代表所有非原始类型的类型，即数组、对象与函数类型这些：


```ts
// 对于 undefined、null、void 0 ，需要关闭 strictNullChecks
const tmp17: object = undefined;
const tmp18: object = null;
const tmp19: object = void 0;

const tmp20: object = 'linbudu';  // X 不成立，值为原始类型
const tmp21: object = 599; // X 不成立，值为原始类型

const tmp22: object = { name: 'linbudu' };
const tmp23: object = () => {};
const tmp24: object = [];
```


### 字面量类型

```ts
let str = 'name';       // let str: string;
const str = 'name';     // const str: "name"
```

使用 const 声明的变量，其类型会从值推导出最精确的字面量类型。而 const 定义的对象类型则只会推导至符合其属性结构的接口。

要解答这个现象，需要你回想 let 和 const 声明的意义。我们知道，使用 let 声明的变量是可以再次赋值的，在 TypeScript 中要求赋值类型始终与原类型一致（如果声明了的话）。因此对于 let 声明，只需要推导至这个值从属的类型即可。而 const 声明的原始类型变量将不再可变，因此类型可以直接一步到位收窄到最精确的字面量类型，但对象类型变量仍可变（但同样会要求其属性值类型保持一致）。

## type 与 interface

更推荐的方式是，interface 用来描述对象、类的结构，而类型别名用来将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型。但大部分场景下接口结构都可以被类型别名所取代，因此，只要你觉得统一使用类型别名让你觉得更整齐，也没什么问题


## 函数重载

在某些逻辑较复杂的情况下，函数可能有多组入参类型和返回值类型：
```ts
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}
```
在这个实例中，函数的返回类型基于其入参 `bar` 的值，并且从其内部逻辑中我们知道，当 `bar` 为 `true`，返回值为 `string` 类型，否则为 `number` 类型。而这里的`类型签名`完全没有体现这一点，我们只知道它的`返回值`是这么个`联合类型`。


要想实现与入参关联的返回值类型，我们可以使用 TypeScript 提供的函数重载签名（Overload Signature），将以上的例子使用重载改写：
```ts
function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}

const res1 = func(599); // number
const res2 = func(599, true); // string
const res3 = func(599, false); // number
```

这里有一个需要注意的地方，拥有多个重载声明的函数在被调用时，是按照重载的`声明顺序`往下查找的。因此在第一个重载声明中，为了与逻辑中保持一致，即在 `bar` 为 `true` 时返回 `string` 类型，这里我们需要将第一个重载声明的 `bar` 声明为`必选`的字面量类型。

你可以试着为`第一个重载`声明的 `bar` 参数也加上`可选符号`，然后就会发现第一个函数调用错误地匹配到了第一个重载声明。

`不能` 在 `声明文件` 中使用 `函数重载`，必须要有`默认导出`。否则会报错（`函数实现重复。ts(2393)`）

## 类

### 访问修饰符
- public      此类成员在类、类的实例、子类中都能被访问
- private     此类成员仅能在类的内部被访问
```ts
// Utils 类内部全部都是静态成员，我们不希望有人去实例化这个类。就可以使用私有构造函数来阻止它被错误地实例化
class Utils {
  public static version = '1.0.0'
  private constructor () {}
  public static getName () {}
}
```
- protected   此类成员仅能在类与子类中被访问

### 操作修饰符
- readonly

### 静态成员

```ts
class Foo {
  static staticHandler () {}
  public instanceHandler () {}
}
```
类的 `内部成员` 无法通过 `this` 访问静态成员，需要通过 `Foo.staticHandler` 这种形式进行访问。

我们可以查看编译到 ES5 及以下 target 的 JavaScript 代码（ES6 以上就原生支持静态成员了），来进一步了解它们的区别：

```js
var Foo = /** @class */ (function () {
  function Foo() {
  }
  Foo.staticHandler = function () { };
  Foo.prototype.instanceHandler = function () { };
  return Foo;
}());
```

从中我们可以看到，`静态成员`直接被挂载在`函数体上`，而`实例成员`挂载在`原型上`，这就是二者的最重要差异：`静态成员`不会被实例继承，它始终只属于当前定义的这个类（以及其子类）。而`原型对象`上的实例成员则会沿着`原型链`进行传递，也就是能够被继承。

而对于 `静态成员` 和 `实例成员` 的 `使用时机`，其实并不需要非常刻意地划分。比如我会用类 + 静态成员来收敛变量与 utils 方法：

```ts
class Utils {
  public static identifier = "linbudu";

  public static makeUHappy() {
    Utils.studyWithU();
    // ...
  }

  public static studyWithU() { }
}

Utils.makeUHappy();
```

### override 重写

在`子类`覆盖`父类`的方法时，并不能确保子类的这一方法能覆盖父类方法，万一父类中 `不存` 这方法 `或` 给这方法 `改了名`？所以，Typescript `4.3` 新增了 `override` 关键字，来 `确保` 子类尝试 `覆盖` 的方法`一定` 在父类中 `存在`：
```ts
class Base {
  printWithLove () {}
}

class Derived extends Base {
  override print () {}
}
```

这里 `ts` 将会给出错误,因为 `尝试覆盖的方法并未在父类中声明`。


### abstract 抽象类与抽象方法

抽象类使用 `abstract` 关键字声明：
```ts
abstract class Male {
  abstract name:string;
  abstract eat (): string;
  abstract get age (): number
}
```

注意，抽象类中的成员也需要使用 abstract 关键字才能被视为抽象类成员，如这里的抽象方法。我们可以实现（implements）一个抽象类：

```ts
class Men extends Male {
  name: string = 'zhangsan';
  eat(): string {
    return '吃饭'
  }
  get age(): number {
    return 23
  }
}
```

此时，我们`必须` `完全实现` 这个抽象类的`每一个` `抽象成员`。需要注意的是，在 TypeScript 中`无法声明` `静态` 的 `抽象成员`。


对于抽象类，它的本质就是 `描述类的结构`。看到结构，你是否又想到了 `interface`？是的。`interface` 不仅可以 `声明函数结构`，也可以 `声明类的结构`：

```ts
interface Male {
  name: string;
  eat (): string;
  get age (): number;
}

class Men implements Male {
  name: string = 'zhangsan';
  eat(): string {
    return '吃饭'
  }
  get age(): number {
    return 23
  }
}
```

在这里，我们让 `类` 去实现了一个`接口`。这里`接口`的作用和`抽象类`一样，都是描述这个 `类的结构`。除此以外，我们还可以使用 `Newable Interface` 来描述一个类的结构（类似于描述函数结构的 Callable Interface）：

```ts
class Foo { 
  constructor (public name: string) {
    this.name = name
  }
  getName () {
    return this.name
  }
}

interface FooStruct {
  new(name:string): Foo
}

declare const NewableFoo: FooStruct;

const foo = new NewableFoo('zhangsan');

foo.getName()
```

## 抽象类 和 接口的区别

`抽象类` 是对 `类本质` 的 `抽象`，表达的是 `is a` 的关系。比如：male is a Human。抽象类包含并实现子类的通用特性，将子类存在差异化的特性进行抽象，交由子类去实现。


`接口`是对 `行为` 的抽象，表达的是 `like a` 的关系。比如：Baoma like a plane（它有飞的功能一样可以飞），但其本质上 is a Car。接口的核心是定义行为，即实现类可以做什么，至于实现类主体是谁、是如何实现的，接口并不关心。


## 断言


### 双重断言

如果在使用类型断言时，`原类型` 与 `断言类型` 之间差异过大，也就是`指鹿为马`太过离谱，离谱到了指鹿为霸王龙的程度，TypeScript 会给你一个类型报错：

```ts
const str: string = 'zhangsan';

// 从 X 类型 到 Y 类型的断言可能是错误的，blabla
(str as { handler: () => {} }).handler()
```

此时它会提醒你先断言到 unknown 类型，再断言到预期类型，就像这样：

```ts
const str: string = 'zhangsan';
(str as unknown as { handler: () => {} }).handler();
```

这是因为你的 `断言类型` 和 `原类型` 的差异太大，需要先断言到一个 `通用类`，即 `any` / `unknown`。这一通用类型包含了所有可能的类型，因此断言到它和从它断言到另一个类型差异不大。

### 非空断言


## 类型工具

### 类型别名

### 索引类型

由于 JavaScript 中，对于 `obj[prop]` 形式的访问会将数字索引访问转换为字符串索引访问，也就是说， `obj[599]` 和 `obj['599']` 的效果是一致的。因此，在字符串索引签名类型中我们仍然可以声明数字类型的键。类似的，symbol 类型也是如此：

```ts
const foo: AllStringTypes = {
  "linbudu": "599",
  599: "linbudu",
  [Symbol("ddd")]: 'symbol',
}
```

**索引类型查询**

刚才我们已经提到了索引类型查询，也就是 `keyof` 操作符。严谨地说，它可以将`对象中的所有键`转换为对应`字面量类型`，然后再组合成`联合类型`。注意，这里并不会将数字类型的键名转换为字符串类型字面量，而是仍然保持为数字类型字面量。

```ts
interface Foo {
  zhangsan: 'xxx',
  599: 2
}

type FooKeys = keyof Foo; // "zhangsan" | 599
// 在 VS Code 中悬浮鼠标只能看到 'keyof Foo'
// 看不到其中的实际值，你可以这么做：
type FooKeys = keyof Foo & {}; // "zhangsan" | 599

```

除了应用在已知的对象类型结构上以外，你还可以直接 `keyof any` 来生产一个`联合类型`，它会由所有可用作对象键值的类型组成：`string | number | symbol`。也就是说，它是由`无数字面量`类型组成的，由此我们可以知道， keyof 的产物必定是一个联合类型。

**索引类型访问**

在 `JavaScript` 中我们可以通过 `obj[expression]` 的方式来动态访问一个对象属性（即计算属性），expression 表达式会先被执行，然后使用返回值来访问属性。而 `TypeScript` 中我们也可以通过类似的方式，只不过这里的 `expression` 要换成类型。接下来，我们来看个例子：
```ts
interface NumberRecord {
  [key: string]: number;
}

type PropType = NumberRecord[string]; // number

```

这里，我们使用 string 这个类型来访问 NumberRecord。由于其内部声明了数字类型的索引签名，这里访问到的结果即是 number 类型。注意，其访问方式与返回值均是类型。

更直观的例子是通过字面量类型来进行索引类型访问：

```ts
interface Foo {
  propA: number;
  propB: boolean;
}

type PropAType = Foo['propA']; // number
type PropBType = Foo['propB']; // boolean

```

看起来这里就是普通的值访问，但实际上这里的 `'propA'` 和 `'propB'` 都是`字符串字面量`类型，而不是一个 `JavaScript` 字符串值。索引类型查询的本质其实就是，通过`键的字面量类型`（'propA'）访问这个`键对应的键值类型`（number）。

看到这你肯定会想到，上面的 keyof 操作符能一次性获取这个对象所有的键的字面量类型，是否能用在这里？当然，这可是 TypeScript 啊。

```ts
interface Foo {
  propA: number;
  propB: boolean;
  propC: string;
  propD: string;
}

type PropTypeUnion = Foo[keyof Foo]; // string | number | boolean

```

使用 `字面量联合类型` 进行 `索引类型` 访问时，其结果就是将 `联合类型` `每个分支` 对应的类型进行访问后的结果，重新组装成联合类型。`索引类型查询、索引类型访问通常会和映射类型一起搭配使用`，前两者负责`访问键`，而 `映射类型` 在其基础上`访问键值类型`，我们在下面一个部分就会讲到。

注意，在未声明索引签名类型的情况下，我们不能使用 NumberRecord[string] 这种原始类型的访问方式，而只能通过键名的字面量类型来进行访问。

```ts
interface Foo {
  propA: number;
}

// 类型“Foo”没有匹配的类型“string”的索引签名。
type PropAType = Foo[string]; 

```

`索引类型`的最佳拍档之一就是`映射类型`，同时`映射类型`也是类型编程中常用的一个手段。



## 类型守卫

### is

### 基于 in 与 instanceof 的类型保护

## 类型断言守卫

### asserts


## 结构化类型系统

在 TypeScript 中，你可能遇见过以下这样“看起来不太对，但竟然能正常运行”的代码：

```ts
class Cat {
  eat() { }
}

class Dog {
  eat() { }
}

function feedCat(cat: Cat) { }

feedCat(new Dog())
```

这是因为，`TypeScript` 比较两个类型 `并非` 通过 `类型的名称`，而是比较这两个类型上 `实际拥有的属性与方法`。也就是说，这里实际上是比较 `Cat` 类型上的属性是否都存在于 `Dog` 类型上。


## 标称类型系统

## 装箱类型
`基础类型` 是 `包装类型` 的 `子类型`

```ts

```


## 分布式条件类型

条件分布式起作用的条件：
- 类型参数需要是一个联合类型
- 参数需要通过泛型参数的方式传入
- 条件类型中的泛型参数不能被包裹


```ts
type isNever<T> = T extends never ? true : false;
type T0 = isNever<never>; // type T0 = never;
```

泛型参数添加包裹，让分布式条件类型失效
```ts
type isNever<T> = [T] extends [never] ? true : false;
type T0 = isNever<never>; // type T0 = true;
```


## 类型转换

### 枚举转联合类型

```ts
enum Position {
  inner,
  outer
}

type Keys = keyof typeof Position; // type Keys = "inner" | "outer"
```

在 `Typescript` 中需要使用 `typeof Position` 来取实际的枚举类型（不然就是Number的子类型）。可以理解 `枚举` 有可能是一个 `值类型`


## 上下文类型


### void 返回值类型下的特殊情况

上下文类型同样会推导并约束函数的返回值类型，但存在这么个特殊的情况，当内置函数类型的返回值类型为 void 时：

```ts
type CustomHandler = (name: string, age: number) => void;

const handler1: CustomHandler = (name, age) => true
const handler2: CustomHandler = (name, age) => '123'
const handler3: CustomHandler = (name, age) => null
const handler4: CustomHandler = (name, age) => undefined
```

`上下文类型`对于 `void 返回值类型`的函数，并不会真的要求它啥都不能返回。然而，虽然这些函数实现可以`返回任意类型的值`，但对于调用结果的类型，仍然是 void：

```ts
const result1 = handler1('linbudu', 599); // void
const result2 = handler2('linbudu', 599); // void
const result3 = handler3('linbudu', 599); // void
const result4 = handler4('linbudu', 599); // void
```

我们实际上就是在将 `更少参数的函数` 赋值给 `具有更多参数的函数` 类型！再看一个更明显的例子：

在上下文类型中，我们实现的表达式可以只使用 `更少的参数`，而 `不能使用更多`，这还是因为上下文类型基于位置的匹配，一旦参数个数超过定义的数量，那就没法进行匹配了

```ts
function handler (arg: string) {
  console.log(arg)
}

handler('123', 123); // 应有 1 个参数，但获得 2 个。ts(2554)
```

只能将更少参数的 `函数` 赋值给 具有更多参数的 `函数`，才不会触发错误提示

```ts
function handler(arg: string) {
  console.log(arg);
}

function useHandler(callback: (arg1: string, arg2: number) => void) {
  callback('linbudu', 599);
}

useHandler(handler);
```

### TSConfig 中的 StrictFunctionTypes

在默认情况下，对函数参数的检查采用 双变（ bivariant ） ，即逆变与协变都被认为是可接受的。如果启用 `strictFunctionTypes` 选项将 `启用函数参数类型逆变检查`

```ts
// method 声明
interface T1 {
  func(arg: string): number;
}

// property 声明
interface T2 {
  func: (arg: string) => number;
}
```

进行如此约束的原因即，对于 `property` 声明，才能在 `开启严格函数类型检查` 的情况下享受到基于 `逆变的参数类型检查`。而对于 `method` 声明（以及构造函数声明），其 `无法` 享受到这一更严格的检查。