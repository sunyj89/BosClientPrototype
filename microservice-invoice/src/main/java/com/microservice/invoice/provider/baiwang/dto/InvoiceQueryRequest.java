package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 单张发票查询请求参数
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class InvoiceQueryRequest {
    /**
     * 发票代码
     */
    private String fpdm;
    
    /**
     * 发票号码
     */
    private String fphm;
    
    /**
     * 发票请求流水号
     */
    private String fpqqlsh;
    
    /**
     * 发票类型
     */
    private String fpType;
}