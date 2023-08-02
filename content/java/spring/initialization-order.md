---
title: "Prototype Bean Initialization Order"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
---

```java
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)

// ...

    /**
     * 店铺名到店铺编码的映射
     */
    private final ImmutableMap<String, String> wcShopMap = ImmutableMap.copyOf(getSysDictAsMap("wc_shop_name"));

    /**
     * 快递公司名到WDGJ理解的快递公司编码的映射
     */
    private final ImmutableMap<String, String> expressMap = ImmutableMap.copyOf(getSysDictAsMap("o_erp_vs_express_wc"));


      protected Map<String, String> getSysDictAsMap(String dictType) {
        SysDictDataParam q = new SysDictDataParam();
        q.setDictType(dictType);
        return sysDictDataService.selectDictDataList(q, null).getData()
                .stream().collect(Collectors.toMap(SysDictDataBO::getDictLabel, SysDictDataBO::getDictValue));
    }

     @DubboReference
    ISysDictDataService sysDictDataService;
```