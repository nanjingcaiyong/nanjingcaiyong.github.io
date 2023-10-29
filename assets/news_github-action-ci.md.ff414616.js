import{_ as a,c as s,o as e,a as n}from"./app.c1ceec64.js";const A=JSON.parse('{"title":"\u521B\u5EFA","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u521B\u5EFA","slug":"\u521B\u5EFA"},{"level":2,"title":"\u5B57\u6BB5","slug":"\u5B57\u6BB5"},{"level":3,"title":"name","slug":"name"},{"level":3,"title":"on","slug":"on"}],"relativePath":"news/github-action-ci.md"}'),l={name:"news/github-action-ci.md"},p=n(`<h2 id="\u521B\u5EFA" tabindex="-1">\u521B\u5EFA <a class="header-anchor" href="#\u521B\u5EFA" aria-hidden="true">#</a></h2><div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">mkdir .github/workflows</span></span>
<span class="line"><span style="color:#A6ACCD;">touch ci.yml</span></span>
<span class="line"></span></code></pre></div><h2 id="\u5B57\u6BB5" tabindex="-1">\u5B57\u6BB5 <a class="header-anchor" href="#\u5B57\u6BB5" aria-hidden="true">#</a></h2><h3 id="name" tabindex="-1">name <a class="header-anchor" href="#name" aria-hidden="true">#</a></h3><div class="language-txt"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">on: Github Action Demo</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>name\u5B57\u6BB5\u662F workflow \u7684\u540D\u79F0\u3002\u5982\u679C\u7701\u7565\u8BE5\u5B57\u6BB5\uFF0C\u9ED8\u8BA4\u4E3A\u5F53\u524D workflow \u7684\u6587\u4EF6\u540D\u3002</p><h3 id="on" tabindex="-1">on <a class="header-anchor" href="#on" aria-hidden="true">#</a></h3><p>on\u5B57\u6BB5\u6307\u5B9A\u89E6\u53D1 workflow \u7684\u6761\u4EF6\uFF0C\u901A\u5E38\u662F\u67D0\u4E9B\u4E8B\u4EF6\u3002</p><div class="language-txt"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">on: push</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u4E0A\u9762\u4EE3\u7801\u6307\u5B9A\uFF0Cpush\u4E8B\u4EF6\u89E6\u53D1 workflow\u3002</p><p>on\u5B57\u6BB5\u4E5F\u53EF\u4EE5\u662F\u4E8B\u4EF6\u7684\u6570\u7EC4\u3002</p><div class="language-txt"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">on: [push, pull_request]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u4E0A\u9762\u4EE3\u7801\u6307\u5B9A\uFF0Cpush\u4E8B\u4EF6\u6216pull_request\u4E8B\u4EF6\u90FD\u53EF\u4EE5\u89E6\u53D1 workflow\u3002</p><p>\u5B8C\u6574\u7684\u4E8B\u4EF6\u5217\u8868\uFF0C\u8BF7\u67E5\u770B\u5B98\u65B9\u6587\u6863\u3002\u9664\u4E86\u4EE3\u7801\u5E93\u4E8B\u4EF6\uFF0CGitHub Actions \u4E5F\u652F\u6301\u5916\u90E8\u4E8B\u4EF6\u89E6\u53D1\uFF0C\u6216\u8005\u5B9A\u65F6\u8FD0\u884C\u3002</p>`,14),o=[p];function t(c,i,r,d,h,u){return e(),s("div",null,o)}var C=a(l,[["render",t]]);export{A as __pageData,C as default};