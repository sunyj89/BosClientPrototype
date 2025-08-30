package com.microservice.invoice.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 发票服务商类型枚举
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Getter
@AllArgsConstructor
public enum InvoiceProviderTypeEnum {
    
    BAIWANG_LEQI(1, "百旺乐企");

    private final Integer code;
    private final String desc;

    public static InvoiceProviderTypeEnum getByCode(Integer code) {
        if (code == null) {
            return null;
        }
        for (InvoiceProviderTypeEnum type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }
}