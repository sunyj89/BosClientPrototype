package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 油站发票配置创建DTO
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Data
@Schema(description = "油站发票配置创建DTO")
public class StationInvoiceConfigCreateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "油站名称(冗余字段，方便查询)", example = "中石化北京朝阳加油站")
    private String stationName;

    @NotNull(message = "服务商类型不能为空")
    @Schema(description = "服务商类型(1: 百旺乐企)", example = "1", required = true)
    private Integer providerType;

    @NotBlank(message = "纳税人识别号不能为空")
    @Schema(description = "销方-纳税人识别号", example = "91110105MA01XXXX2X", required = true)
    private String taxpayerId;

    @Schema(description = "销方-开户银行", example = "中国工商银行北京分行")
    private String bankName;

    @Schema(description = "销方-银行账号", example = "1234567890123456")
    private String bankAccount;

    @Schema(description = "销方-地址", example = "北京市朝阳区xx路xx号")
    private String stationAddress;

    @Pattern(regexp = "^[0-9-+()]*$", message = "电话格式不正确")
    @Schema(description = "销方-电话", example = "010-12345678")
    private String stationPhone;

    @Schema(description = "收款人", example = "张三")
    private String payee;

    @Schema(description = "复核人", example = "李四")
    private String reviewer;

    @NotBlank(message = "开票人不能为空")
    @Schema(description = "开票人", example = "王五", required = true)
    private String drawer;

    @Schema(description = "纸质发票税盘号", example = "123456789012")
    private String paperInvoiceTaxDiskNo;

    @Schema(description = "电子发票税盘号", example = "123456789013")
    private String electronicInvoiceTaxDiskNo;

    @Schema(description = "分机号", example = "8001")
    private String extensionNo;

    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "邮箱格式不正确")
    @Schema(description = "开票员邮箱", example = "invoice@example.com")
    private String drawerEmail;

    @Positive(message = "开票有效期必须大于0")
    @Schema(description = "开票有效期，单位：小时", example = "720")
    private Integer invoiceValidityPeriodInHours = 720;

    @NotNull(message = "消费记录开票入口设置不能为空")
    @Schema(description = "是否开启'消费记录'开票入口", example = "true", required = true)
    private Boolean consumptionRecordEntryEnabled = true;

    @NotNull(message = "支付完成开票入口设置不能为空")
    @Schema(description = "是否开启'支付完成'开票入口", example = "true", required = true)
    private Boolean paymentCompleteEntryEnabled = true;

    @NotNull(message = "无感支付自动开票设置不能为空")
    @Schema(description = "是否开启'无感支付'自动开票", example = "false", required = true)
    private Boolean senselessPaymentAutoInvoiceEnabled = false;

    @NotNull(message = "纸质发票选项设置不能为空")
    @Schema(description = "是否提供'纸质发票'选项", example = "true", required = true)
    private Boolean paperInvoiceOptionEnabled = true;

    @NotNull(message = "发票金额依据不能为空")
    @Schema(description = "发票金额依据(1: 实付金额, 2: 原价金额)", example = "1", required = true)
    private Integer invoiceAmountBasis = 1;

    @Schema(description = "充值开票时使用的默认油品名称", example = "92号汽油")
    private String rechargeDefaultOil;

    @Schema(description = "服务商特定配置(JSON格式)", example = "{\"app_key\":\"xxx\",\"app_secret\":\"xxx\"}")
    private Map<String, Object> providerSpecificConfig;

    @NotNull(message = "生效开始时间不能为空")
    @Schema(description = "配置生效开始时间", example = "2025-01-15T00:00:00", required = true)
    private LocalDateTime startTime;

    @Schema(description = "配置生效结束时间(NULL代表永久有效)", example = "2025-12-31T23:59:59")
    private LocalDateTime endTime;
}