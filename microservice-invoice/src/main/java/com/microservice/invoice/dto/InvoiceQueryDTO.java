package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

/**
 * 发票查询DTO
 * 支持两种查询方式：
 * 1. 通过发票号码查询
 * 2. 通过订单编码查询
 * 至少需要提供一个查询条件
 *
 * @author yangyang
 * @date 2025-01-26
 */
@Data
@Schema(description = "发票查询请求参数")
public class InvoiceQueryDTO {
    
    @Schema(description = "发票号码（与orderCode二选一）", example = "20250126000001")
    private String invoiceNo;
    
    @Schema(description = "订单编码（与invoiceNo二选一）", example = "ORDER_DIESEL_001")
    private String orderCode;
    
    @NotNull(message = "商户ID不能为空")
    @Schema(description = "商户ID", example = "2001")
    private Long merchantId;
    
    @AssertTrue(message = "发票号码和订单编码至少需要提供一个")
    @Schema(hidden = true)
    public boolean isValid() {
        return (invoiceNo != null && !invoiceNo.trim().isEmpty()) || 
               (orderCode != null && !orderCode.trim().isEmpty());
    }
}