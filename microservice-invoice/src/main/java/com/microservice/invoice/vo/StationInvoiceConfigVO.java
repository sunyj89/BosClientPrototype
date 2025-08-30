package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 油站发票配置响应VO
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Data
@Schema(description = "油站发票配置响应VO")
public class StationInvoiceConfigVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "配置ID", example = "1")
    private Long id;

    @Schema(description = "商户ID", example = "100001")
    private Long merchantId;

    @Schema(description = "商户类型 1:单站 2:集团 3:第三方", example = "1")
    private Integer merchantType;

    @Schema(description = "油站名称", example = "中石化北京朝阳加油站")
    private String stationName;

    @Schema(description = "服务商类型(1: 百旺乐企)", example = "1")
    private Integer providerType;
    @Schema(description = "默认开票商户 1:单站 2:集团 3:第三方", example = "1")
    private Integer defaultInvoiceMerchant;

    @Schema(description = "服务商类型名称", example = "百旺乐企")
    private String providerTypeName;

    @Schema(description = "销方-纳税人识别号", example = "91110105MA01XXXX2X")
    private String taxpayerId;

    @Schema(description = "销方-开户银行", example = "中国工商银行北京分行")
    private String bankName;

    @Schema(description = "销方-银行账号", example = "1234567890123456")
    private String bankAccount;

    @Schema(description = "销方-地址", example = "北京市朝阳区xx路xx号")
    private String stationAddress;

    @Schema(description = "销方-电话", example = "010-12345678")
    private String stationPhone;

    @Schema(description = "收款人", example = "张三")
    private String payee;

    @Schema(description = "复核人", example = "李四")
    private String reviewer;

    @Schema(description = "开票人", example = "王五")
    private String drawer;

    @Schema(description = "纸质发票税盘号", example = "123456789012")
    private String paperInvoiceTaxDiskNo;

    @Schema(description = "电子发票税盘号", example = "123456789013")
    private String electronicInvoiceTaxDiskNo;

    @Schema(description = "分机号", example = "8001")
    private String extensionNo;

    @Schema(description = "开票员邮箱", example = "invoice@example.com")
    private String drawerEmail;

    @Schema(description = "开票有效期，单位：小时", example = "720")
    private Integer invoiceValidityPeriodInHours;

    @Schema(description = "开票有效期，单位：天", example = "30")
    private Integer invoiceValidityPeriodInDays;

    @Schema(description = "是否开启'消费记录'开票入口", example = "true")
    private Boolean consumptionRecordEntryEnabled;

    @Schema(description = "是否开启'支付完成'开票入口", example = "true")
    private Boolean paymentCompleteEntryEnabled;

    @Schema(description = "是否开启'无感支付'自动开票", example = "false")
    private Boolean senselessPaymentAutoInvoiceEnabled;

    @Schema(description = "是否提供'纸质发票'选项", example = "true")
    private Boolean paperInvoiceOptionEnabled;

    @Schema(description = "发票金额依据(1: 实付金额, 2: 原价金额)", example = "1")
    private Integer invoiceAmountBasis;

    @Schema(description = "发票金额依据名称", example = "实付金额")
    private String invoiceAmountBasisName;

    @Schema(description = "充值开票时使用的默认油品名称", example = "92号汽油")
    private String rechargeDefaultOil;

    @Schema(description = "服务商特定配置(JSON格式)", example = "{\"app_key\":\"xxx\",\"app_secret\":\"xxx\"}")
    private Map<String, Object> providerSpecificConfig;

    @Schema(description = "配置生效开始时间", example = "2025-01-15T00:00:00")
    private LocalDateTime startTime;

    @Schema(description = "配置生效结束时间(NULL代表永久有效)", example = "2025-12-31T23:59:59")
    private LocalDateTime endTime;

    @Schema(description = "配置状态(pending:未生效, active:生效中, expired:已失效)", example = "active")
    private String status;

    @Schema(description = "配置状态名称", example = "生效中")
    private String statusName;

    @Schema(description = "创建时间", example = "2025-01-15T10:00:00")
    private LocalDateTime createdTime;

    @Schema(description = "更新时间", example = "2025-01-15T10:00:00")
    private LocalDateTime updatedTime;

    @Schema(description = "创建者", example = "admin")
    private String createdBy;

    @Schema(description = "更新者", example = "admin")
    private String updatedBy;
}