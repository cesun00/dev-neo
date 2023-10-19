---
title: "Nacos: Overview"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Nacos是一个在线字符串存储程序。为了组织这些字符串的存储，Nacos 做了以下划分：
1. 顶级划分：namespace. 一个 namespace 包含若干个 group
2. 次级划分：group. 一个 namespace 的一个 group 包含了若干个 data id.
3. 一个 namespace 的一个 group 的一个 data id，唯一指代了一个字符串。可以查询其文本内容。

当存储的字符串符合某种大家熟知的结构化格式（如 java properties / XML / YAML) 时，nacos可以被当做所谓的配置中心使用；
这也是nacos的通常用法。

您可以
1. 存储一个新字符串: `POST /nacos/v2/cs/config`
2. 