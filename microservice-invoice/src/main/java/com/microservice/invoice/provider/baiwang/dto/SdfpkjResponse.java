package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 数电发票开具响应数据
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class SdfpkjResponse {
    /**
     * 发票请求流水号
     */
    private String fpqqlsh;
    
    /**
     * 发票号码
     */
    private String fphm;
    
    /**
     * 开票日期
     */
    private String kprq;
}