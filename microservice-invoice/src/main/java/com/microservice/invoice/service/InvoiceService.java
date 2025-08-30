package com.microservice.invoice.service;

import com.microservice.invoice.dto.InvoiceRequestDTO;
import com.microservice.invoice.dto.InvoiceResponseDTO;

/**
 * 统一开票服务接口
 *
 * @author yangyang
 * @date 2025-01-18
 */
public interface InvoiceService {
    
    /**
     * 开具发票
     *
     * @param request 开票请求参数
     * @return 开票响应结果
     */
    InvoiceResponseDTO issueInvoice(InvoiceRequestDTO request);
    
    /**
     * 获取发票下载地址
     *
     * @param invoiceNo 发票号码
     * @param merchantId 商户ID
     * @return 下载地址信息
     */
    InvoiceResponseDTO getInvoiceDownloadUrl(String invoiceNo, Long merchantId);
    
    /**
     * 根据订单编码获取发票下载地址
     *
     * @param orderCode 订单编码
     * @param merchantId 商户ID
     * @return 下载地址信息
     */
    InvoiceResponseDTO getInvoiceDownloadUrlByOrderCode(String orderCode, Long merchantId);
    
    /**
     * 查询发票
     *
     * @param invoiceNo 发票号码
     * @param merchantId 商户ID
     * @return 发票信息
     */
    InvoiceResponseDTO queryInvoice(String invoiceNo, Long merchantId);
    
    /**
     * 根据订单编码查询发票
     *
     * @param orderCode 订单编码
     * @param merchantId 商户ID
     * @return 发票信息
     */
    InvoiceResponseDTO queryInvoiceByOrderCode(String orderCode, Long merchantId);
    
    /**
     * 申请红字确认单
     *
     * @param request 红字确认单申请参数
     * @return 红字确认单响应
     */
    InvoiceResponseDTO applyRedConfirm(InvoiceRequestDTO request);
    
    /**
     * 开具红字发票
     *
     * @param request 红字发票请求参数
     * @return 红字发票响应
     */
    InvoiceResponseDTO issueRedInvoice(InvoiceRequestDTO request);
}