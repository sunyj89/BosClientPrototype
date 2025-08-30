package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 获取发票下载地址响应数据
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class InvoiceDownloadResponse {
    /**
     * PDF文件URL
     */
    private String pdfurl;
    
    /**
     * 二维码URL
     */
    private String ewmurl;
    
    /**
     * OFD文件URL
     */
    private String ofdurl;
    
    /**
     * XML文件URL
     */
    private String xmlurl;
}