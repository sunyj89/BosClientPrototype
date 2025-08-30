package com.microservice.invoice.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 发票模块MyBatis Plus字段自动填充处理器
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@Component
public class InvoiceMetaObjectHandler implements MetaObjectHandler {

    /**
     * 插入时自动填充
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        log.debug("插入时自动填充字段开始");
        LocalDateTime now = LocalDateTime.now();
        
        // 填充创建时间
        this.strictInsertFill(metaObject, "createdTime", LocalDateTime.class, now);
        // 填充更新时间
        this.strictInsertFill(metaObject, "updatedTime", LocalDateTime.class, now);
        // 填充创建者
        this.strictInsertFill(metaObject, "createdBy", String.class, "system");
        // 填充更新者
        this.strictInsertFill(metaObject, "updatedBy", String.class, "system");
        
        log.debug("插入时自动填充字段完成");
    }

    /**
     * 更新时自动填充
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        log.debug("更新时自动填充字段开始");
        LocalDateTime now = LocalDateTime.now();
        
        // 填充更新时间
        this.strictUpdateFill(metaObject, "updatedTime", LocalDateTime.class, now);
        // 填充更新者
        this.strictUpdateFill(metaObject, "updatedBy", String.class, "system");
        
        log.debug("更新时自动填充字段完成");
    }
}