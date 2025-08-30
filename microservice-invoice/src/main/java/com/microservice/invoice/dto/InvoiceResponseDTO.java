package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 开票响应DTO
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
@Schema(description = "开票响应结果")
public class InvoiceResponseDTO {
    
    @Schema(description = "响应代码 0:成功 其他:失败", example = "0")
    private Integer code;
    
    @Schema(description = "响应消息", example = "成功")
    private String message;
    
    @Schema(description = "发票请求流水号", example = "1234567899874563211234521214785")
    private String requestSerialNo;
    
    @Schema(description = "订单编码", example = "ORDER_DIESEL_001")
    private String orderCode;
    
    @Schema(description = "发票号码", example = "25997000000170129316")
    private String invoiceNo;
    
    @Schema(description = "开票日期", example = "2025-04-28 15:54:15")
    private String invoiceDate;
    
    @Schema(description = "发票代码", example = "")
    private String invoiceCode;
    
    @Schema(description = "发票状态 00:正常", example = "00")
    private String invoiceStatus;
    
    @Schema(description = "PDF下载地址", example = "http://example.com/pdf/xxx.pdf")
    private String pdfUrl;
    
    @Schema(description = "OFD下载地址", example = "http://example.com/ofd/xxx.ofd")
    private String ofdUrl;
    
    @Schema(description = "XML下载地址", example = "http://example.com/xml/xxx.xml")
    private String xmlUrl;
    
    @Schema(description = "二维码地址", example = "http://example.com/qr/xxx.png")
    private String qrCodeUrl;
    
    @Schema(description = "合计金额", example = "88.50")
    private BigDecimal totalAmount;
    
    @Schema(description = "合计税额", example = "11.50")
    private BigDecimal totalTax;
    
    @Schema(description = "价税合计", example = "100.00")
    private BigDecimal totalWithTax;
    
    @Schema(description = "红字确认单编号", example = "99000025048000220562")
    private String redConfirmNo;
    
    @Schema(description = "红字确认单UUID", example = "6ab9f900c9e340568eab3221d45151a8")
    private String redConfirmUuid;
    
    @Schema(description = "红字确认单状态代码", example = "01")
    private String redConfirmStatus;
    
    @Schema(description = "购买方名称", example = "测试公司")
    private String buyerName;
    
    @Schema(description = "购买方纳税人识别号", example = "91110000000000000X")
    private String buyerTaxNo;
    
    @Schema(description = "销售方名称", example = "江西省交投化石能源有限公司")
    private String sellerName;
    
    @Schema(description = "销售方纳税人识别号", example = "91360108MACM2L8N6K")
    private String sellerTaxNo;
    
    @Schema(description = "发票明细列表")
    private List<InvoiceDetailVO> details;
    
    /**
     * 发票明细VO
     */
    @Data
    @Schema(description = "发票明细信息")
    public static class InvoiceDetailVO {
        
        @Schema(description = "序号", example = "1")
        private String serialNo;
        
        @Schema(description = "商品名称", example = "*专项化学用品*悦泰海龙柴油车尾气处理液20Kg")
        private String goodsName;
        
        @Schema(description = "规格型号", example = "20Kg")
        private String specification;
        
        @Schema(description = "单位", example = "瓶")
        private String unit;
        
        @Schema(description = "数量", example = "1.00")
        private String quantity;
        
        @Schema(description = "单价", example = "88.50")
        private String unitPrice;
        
        @Schema(description = "金额", example = "88.50")
        private String amount;
        
        @Schema(description = "税率", example = "0.13")
        private String taxRate;
        
        @Schema(description = "税额", example = "11.50")
        private String taxAmount;
        
        @Schema(description = "商品编码", example = "1070215020000000000")
        private String goodsCode;
    }
}