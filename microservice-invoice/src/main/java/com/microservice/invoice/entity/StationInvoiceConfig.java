package com.microservice.invoice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 油站发票配置表
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName(value = "station_invoice_configs", autoResultMap = true)
public class StationInvoiceConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 自增主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 商户ID
     */
    private Long merchantId;

    /**
     * 商户类型 1:单站 2:集团 3:第三方
     */
    private Integer merchantType;

    /**
     * 油站名称(冗余字段，方便查询)
     */
    private String stationName;

    /**
     * 服务商类型(1: 百旺乐企)
     */
    private Integer providerType;

    /**
     * 默认开票商户 1:单站 2:集团 3:第三方
     */
    private Integer defaultInvoiceMerchant;

    /**
     * 销方-纳税人识别号
     */
    private String taxpayerId;

    /**
     * 销方-开户银行
     */
    private String bankName;

    /**
     * 销方-银行账号
     */
    private String bankAccount;

    /**
     * 销方-地址
     */
    private String stationAddress;

    /**
     * 销方-电话
     */
    private String stationPhone;

    /**
     * 收款人
     */
    private String payee;

    /**
     * 复核人
     */
    private String reviewer;

    /**
     * 开票人
     */
    private String drawer;

    /**
     * 纸质发票税盘号
     */
    private String paperInvoiceTaxDiskNo;

    /**
     * 电子发票税盘号
     */
    private String electronicInvoiceTaxDiskNo;

    /**
     * 分机号
     */
    private String extensionNo;

    /**
     * 开票员邮箱
     */
    private String drawerEmail;

    /**
     * 开票有效期，单位：小时
     */
    private Integer invoiceValidityPeriodInHours;

    /**
     * 是否开启"消费记录"开票入口
     */
    private Boolean consumptionRecordEntryEnabled;

    /**
     * 是否开启"支付完成"开票入口
     */
    private Boolean paymentCompleteEntryEnabled;

    /**
     * 是否开启"无感支付"自动开票
     */
    private Boolean senselessPaymentAutoInvoiceEnabled;

    /**
     * 是否提供"纸质发票"选项
     */
    private Boolean paperInvoiceOptionEnabled;

    /**
     * 发票金额依据(1: 实付金额, 2: 原价金额)
     */
    private Integer invoiceAmountBasis;

    /**
     * 充值开票时使用的默认油品名称
     */
    private String rechargeDefaultOil;

    /**
     * 服务商特定配置(JSON格式)
     */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> providerSpecificConfig;

    /**
     * 配置生效开始时间
     */
    private LocalDateTime startTime;

    /**
     * 配置生效结束时间(NULL代表永久有效)
     */
    private LocalDateTime endTime;

    /**
     * 创建时间
     */
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    private LocalDateTime updatedTime;

    /**
     * 删除时间
     */
    private LocalDateTime deletedTime;

    /**
     * 创建者
     */
    private String createdBy;

    /**
     * 更新者
     */
    private String updatedBy;

    /**
     * 是否删除
     */
    private Boolean deleted;
}