package com.microservice.invoice.provider;

import com.microservice.invoice.dto.InvoiceRequestDTO;
import com.microservice.invoice.dto.InvoiceResponseDTO;

/**
 * 开票服务提供者接口
 *
 * @author yangyang
 * @date 2025-01-18
 */
public interface InvoiceProvider {
    
    /**
     * 获取服务商类型
     *
     * @return 服务商类型 1:百旺乐企
     */
    Integer getProviderType();
    
    /**
     * 开具发票
     *
     * @param request 开票请求参数
     * @param config 油站开票配置
     * @return 开票响应结果
     */
    InvoiceResponseDTO issueInvoice(InvoiceRequestDTO request, StationInvoiceConfig config);
    
    /**
     * 获取发票下载地址
     *
     * @param invoiceNo 发票号码
     * @param requestSerialNo 请求流水号
     * @param config 油站开票配置
     * @return 下载地址信息
     */
    InvoiceResponseDTO getInvoiceDownloadUrl(String invoiceNo, String requestSerialNo, StationInvoiceConfig config);
    
    /**
     * 查询发票
     *
     * @param invoiceNo 发票号码
     * @param requestSerialNo 请求流水号
     * @param config 油站开票配置
     * @return 发票信息
     */
    InvoiceResponseDTO queryInvoice(String invoiceNo, String requestSerialNo, StationInvoiceConfig config);
    
    /**
     * 申请红字确认单
     *
     * @param request 红字确认单申请参数
     * @param config 油站开票配置
     * @return 红字确认单响应
     */
    InvoiceResponseDTO applyRedConfirm(InvoiceRequestDTO request, StationInvoiceConfig config);
    
    /**
     * 开具红字发票
     *
     * @param request 红字发票请求参数
     * @param config 油站开票配置
     * @return 红字发票响应
     */
    InvoiceResponseDTO issueRedInvoice(InvoiceRequestDTO request, StationInvoiceConfig config);
    
    /**
     * 油站开票配置
     */
    class StationInvoiceConfig {
        private Long merchantId;
        private String stationName;
        private String taxpayerId;
        private String stationAddress;
        private String stationPhone;
        private String bankName;
        private String bankAccount;
        private Integer providerType;
        private String apiUrl;
        private String apiToken;
        private String privateKey;
        private String publicKey;
        private String username;
        private String account;
        
        // getters and setters
        public Long getMerchantId() { return merchantId; }
        public void setMerchantId(Long merchantId) { this.merchantId = merchantId; }
        
        public String getStationName() { return stationName; }
        public void setStationName(String stationName) { this.stationName = stationName; }
        
        public String getTaxpayerId() { return taxpayerId; }
        public void setTaxpayerId(String taxpayerId) { this.taxpayerId = taxpayerId; }
        
        public String getStationAddress() { return stationAddress; }
        public void setStationAddress(String stationAddress) { this.stationAddress = stationAddress; }
        
        public String getStationPhone() { return stationPhone; }
        public void setStationPhone(String stationPhone) { this.stationPhone = stationPhone; }
        
        public String getBankName() { return bankName; }
        public void setBankName(String bankName) { this.bankName = bankName; }
        
        public String getBankAccount() { return bankAccount; }
        public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
        
        public Integer getProviderType() { return providerType; }
        public void setProviderType(Integer providerType) { this.providerType = providerType; }
        
        public String getApiUrl() { return apiUrl; }
        public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }
        
        public String getApiToken() { return apiToken; }
        public void setApiToken(String apiToken) { this.apiToken = apiToken; }
        
        public String getPrivateKey() { return privateKey; }
        public void setPrivateKey(String privateKey) { this.privateKey = privateKey; }
        
        public String getPublicKey() { return publicKey; }
        public void setPublicKey(String publicKey) { this.publicKey = publicKey; }
        
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getAccount() { return account; }
        public void setAccount(String account) { this.account = account; }
    }
}