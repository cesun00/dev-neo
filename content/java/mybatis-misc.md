---
title: "Mybatis Memo"
date: 2024-01-01
lastmod: 2024-05-01
draft: false
tags:
  - mybatis
  - java
---

## jdbcType is not necessary in mybatis mapper

> The JDBC type is only required for nullable columns upon insert, update or delete. This is a JDBC requirement, not a MyBatis one. So even if you were coding JDBC directly, you'd need to specify this type – but only for nullable values.

https://stackoverflow.com/questions/18645820/is-jdbctype-necessary-in-a-mybatis-mapper

## Get the `AUTO_INCREMENT` Generated Primary Key

希望在PK自增的表里插入一行，并拿到这个由SQL生成的自增PK，不需要插完了再查；只需要：

```xml
<insert id="insertSelective" parameterType="com.haiziwang.lark.common.domain.po.task.TaskInfoPo" keyProperty="id" useGeneratedKeys="true">
    insert into task_info
    ...
</insert>
```

```java
TaskInfoPo taskInfoPo = new TaskInfoPo();
//taskInfoPo.set...()
// set everything EXCEPT the primary key
taskInfoMapper.insertSelective(taskInfoPo);
final Long taskId = taskInfoPo.getId(); // now the auto-increment PK is filled back.

public interface TaskInfoMapper{
    int insertSelective(TaskInfoPo record);

    //...
}
```

注意此方法只能用于回填自增PK，不会修改PO中其他字段。