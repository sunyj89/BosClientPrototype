package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 获取发票下载地址请求参数
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class InvoiceDownloadRequest {
    /**
     * 发票类型代码
     */
    private String fplxdm;
    
    /**
     * 发票号码
     */
    private String fphm;
    
    /**
     * 开票日期
     */
    private String kprq;
}