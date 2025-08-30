package com.microservice.invoice.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 发票金额依据枚举
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Getter
@AllArgsConstructor
public enum InvoiceAmountBasisEnum {
    
    ACTUAL_AMOUNT(1, "实付金额"),
    ORIGINAL_AMOUNT(2, "原价金额");

    private final Integer code;
    private final String desc;

    public static InvoiceAmountBasisEnum getByCode(Integer code) {
        if (code == null) {
            return null;
        }
        for (InvoiceAmountBasisEnum basis : values()) {
            if (basis.getCode().equals(code)) {
                return basis;
            }
        }
        return null;
    }
}