package com.microservice.invoice.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 发票配置状态枚举
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Getter
@AllArgsConstructor
public enum InvoiceConfigStatusEnum {
    
    PENDING("pending", "未生效"),
    ACTIVE("active", "生效中"),
    EXPIRED("expired", "已失效");

    private final String code;
    private final String desc;

    public static InvoiceConfigStatusEnum getByCode(String code) {
        if (code == null) {
            return null;
        }
        for (InvoiceConfigStatusEnum status : values()) {
            if (status.getCode().equals(code)) {
                return status;
            }
        }
        return null;
    }
}