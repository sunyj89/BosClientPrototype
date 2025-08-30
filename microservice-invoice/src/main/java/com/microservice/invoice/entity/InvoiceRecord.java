package com.microservice.invoice.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 开票记录实体类
 *
 * @author system
 * @date 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("invoice_record")
public class InvoiceRecord {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 发票请求流水号(内部订单编号)
     */
    @TableField("order_code")
    private String orderCode;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 商户ID
     */
    @TableField("merchant_id")
    private Long merchantId;

    /**
     * 商户类型 1:单站 2:集团 3:第三方
     */
    @TableField("merchant_type")
    private Integer merchantType;

    /**
     * 蓝字发票标志 0：蓝字发票 1：红字发票
     */
    @TableField("invoice_flag")
    private String invoiceFlag;

    /**
     * 平台编号
     */
    @TableField("platform_code")
    private String platformCode;

    /**
     * 批量关联订单号（批量开票时的主订单号）
     */
    @TableField("batch_relate_order_code")
    private String batchRelateOrderCode;

    /**
     * 是否批量开票 0:否 1:是
     */
    @TableField("is_batch")
    private Integer isBatch;

    /**
     * 商品类型 0:非油品 1:油品 2:充值卡
     */
    @TableField("product_type")
    private Integer productType;

    /**
     * 发票票种 01：数电专 02：数电普
     */
    @TableField("invoice_type")
    private String invoiceType;

    /**
     * 购买方自然人标志 Y：购买方是自然人 N：购买方非自然人
     */
    @TableField("buyer_type")
    private String buyerType;

    /**
     * 特定要素
     */
    @TableField("special_elements")
    private String specialElements;

    /**
     * 区域代码
     */
    @TableField("region_code")
    private String regionCode;

    /**
     * 差额征税类型代码
     */
    @TableField("tax_deduction_type_code")
    private String taxDeductionTypeCode;

    /**
     * 收购发票类型代码
     */
    @TableField("purchase_invoice_type_code")
    private String purchaseInvoiceTypeCode;

    /**
     * 出口业务适用政策代码
     */
    @TableField("export_business_policy_code")
    private String exportBusinessPolicyCode;

    /**
     * 增值税即征即退代码
     */
    @TableField("vat_instant_refund_code")
    private String vatInstantRefundCode;

    /**
     * 销售方地址
     */
    @TableField("seller_address")
    private String sellerAddress;

    /**
     * 销售方电话
     */
    @TableField("seller_phone")
    private String sellerPhone;

    /**
     * 销售方开户行
     */
    @TableField("seller_bank_name")
    private String sellerBankName;

    /**
     * 销售方账号
     */
    @TableField("seller_bank_account")
    private String sellerBankAccount;

    /**
     * 购买方统一社会信用代码/纳税人识别号/身份证件号码
     */
    @TableField("buyer_tax_id")
    private String buyerTaxId;

    /**
     * 购买方名称
     */
    @TableField("buyer_name")
    private String buyerName;

    /**
     * 购买方地址
     */
    @TableField("buyer_address")
    private String buyerAddress;

    /**
     * 购买方电话
     */
    @TableField("buyer_phone")
    private String buyerPhone;

    /**
     * 购买方邮箱
     */
    @TableField("email")
    private String email;

    /**
     * 购买方开户行
     */
    @TableField("buyer_bank_name")
    private String buyerBankName;

    /**
     * 购买方账号
     */
    @TableField("buyer_bank_account")
    private String buyerBankAccount;

    /**
     * 购买方经办人姓名
     */
    @TableField("buyer_agent_name")
    private String buyerAgentName;

    /**
     * 经办人身份证件号码
     */
    @TableField("buyer_agent_id_number")
    private String buyerAgentIdNumber;

    /**
     * 经办人联系电话
     */
    @TableField("buyer_agent_phone")
    private String buyerAgentPhone;

    /**
     * 合计金额
     */
    @TableField("total_amount")
    private BigDecimal totalAmount;

    /**
     * 合计税额
     */
    @TableField("total_tax")
    private BigDecimal totalTax;

    /**
     * 价税合计
     */
    @TableField("total_amount_with_tax")
    private BigDecimal totalAmountWithTax;

    /**
     * 收款银行名称
     */
    @TableField("collection_bank_name")
    private String collectionBankName;

    /**
     * 收款银行账号
     */
    @TableField("collection_bank_account")
    private String collectionBankAccount;

    /**
     * 结算方式
     */
    @TableField("settlement_method")
    private String settlementMethod;

    /**
     * 应税行为发生地
     */
    @TableField("tax_behavior_location")
    private String taxBehaviorLocation;

    /**
     * 开票人
     */
    @TableField("drawer_name")
    private String drawerName;

    /**
     * 开票人证件号码
     */
    @TableField("drawer_id_number")
    private String drawerIdNumber;

    /**
     * 开票人证件类型
     */
    @TableField("drawer_id_type")
    private String drawerIdType;

    /**
     * 对应蓝字发票号码
     */
    @TableField("corresponding_blue_invoice_no")
    private String correspondingBlueInvoiceNo;

    /**
     * 红字确认信息单编号
     */
    @TableField("red_confirmation_info_no")
    private String redConfirmationInfoNo;

    /**
     * 红字确认单uuid
     */
    @TableField("red_confirmation_uuid")
    private String redConfirmationUuid;

    /**
     * 备注
     */
    @TableField("remark")
    private String remark;

    /**
     * 服务器地址
     */
    @TableField("server_ip")
    private String serverIp;

    /**
     * mac地址
     */
    @TableField("mac_address")
    private String macAddress;

    /**
     * CPU序列号
     */
    @TableField("cpu_id")
    private String cpuId;

    /**
     * 主板序列号
     */
    @TableField("motherboard_serial")
    private String motherboardSerial;

    /**
     * 是否展示销售方银行账号标签 Y:展示 N:不展示
     */
    @TableField("show_seller_bank_flag")
    private String showSellerBankFlag;

    /**
     * 是否展示购买方银行账号标签 Y:展示 N:不展示
     */
    @TableField("show_buyer_bank_flag")
    private String showBuyerBankFlag;

    /**
     * 收款人姓名
     */
    @TableField("payee_name")
    private String payeeName;

    /**
     * 复核人姓名
     */
    @TableField("reviewer_name")
    private String reviewerName;

    /**
     * 发票状态 00：待开票 01：开票中 02：开票成功 03：开票失败
     */
    @TableField("invoice_status")
    private String invoiceStatus;

    /**
     * 发票号码
     */
    @TableField("invoice_no")
    private String invoiceNo;

    /**
     * 发票代码
     */
    @TableField("invoice_code")
    private String invoiceCode;

    /**
     * 开票日期
     */
    @TableField("invoice_date")
    private LocalDate invoiceDate;

    /**
     * 错误信息
     */
    @TableField("error_msg")
    private String errorMsg;

    /**
     * 重试次数
     */
    @TableField("retry_count")
    private Integer retryCount;

    /**
     * PDF文件访问地址
     */
    @TableField("pdf_url")
    private String pdfUrl;

    /**
     * 数据来源
     */
    @TableField("sjly")
    private String sjly;

    /**
     * OFD文件访问地址
     */
    @TableField("ofd_url")
    private String ofdUrl;

    /**
     * 二维码访问地址
     */
    @TableField("ewm_url")
    private String ewmUrl;

    /**
     * XML文件访问地址
     */
    @TableField("xml_url")
    private String xmlUrl;

    /**
     * 创建时间
     */
    @TableField(value = "created_time", fill = FieldFill.INSERT)
    private LocalDateTime createdTime;

    /**
     * 更新时间
     */
    @TableField(value = "updated_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedTime;

    /**
     * 删除时间
     */
    @TableField("deleted_time")
    private LocalDateTime deletedTime;

    /**
     * 创建者
     */
    @TableField("created_by")
    private String createdBy;

    /**
     * 更新者
     */
    @TableField("updated_by")
    private String updatedBy;

    /**
     * 是否删除
     */
    @TableField("deleted")
    @TableLogic
    private Integer deleted;
}