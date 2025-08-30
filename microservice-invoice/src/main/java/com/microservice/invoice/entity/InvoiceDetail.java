package com.microservice.invoice.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 发票明细实体类
 *
 * @author system
 * @date 2024-01-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("invoice_detail")
public class InvoiceDetail {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 开票记录ID
     */
    @TableField("invoice_record_id")
    private Long invoiceRecordId;

    /**
     * 对应蓝字发票明细序号
     */
    @TableField("corresponding_blue_detail_no")
    private String correspondingBlueDetailNo;

    /**
     * 明细序号
     */
    @TableField("detail_no")
    private String detailNo;

    /**
     * 商品服务简称
     */
    @TableField("goods_service_name")
    private String goodsServiceName;

    /**
     * 项目名称
     */
    @TableField("item_name")
    private String itemName;

    /**
     * 货物或应税劳务、服务名称
     */
    @TableField("goods_or_service_full_name")
    private String goodsOrServiceFullName;

    /**
     * 规格型号
     */
    @TableField("specification")
    private String specification;

    /**
     * 单位
     */
    @TableField("unit")
    private String unit;

    /**
     * 数量
     */
    @TableField("quantity")
    private BigDecimal quantity;

    /**
     * 单价
     */
    @TableField("unit_price")
    private BigDecimal unitPrice;

    /**
     * 金额
     */
    @TableField("amount")
    private BigDecimal amount;

    /**
     * 增值税税率/征收率
     */
    @TableField("tax_rate")
    private String taxRate;

    /**
     * 税额
     */
    @TableField("tax_amount")
    private BigDecimal taxAmount;

    /**
     * 含税金额
     */
    @TableField("amount_with_tax")
    private BigDecimal amountWithTax;

    /**
     * 差额征税扣除额
     */
    @TableField("deduction_amount")
    private BigDecimal deductionAmount;

    /**
     * 商品和服务税收分类合并编码
     */
    @TableField("goods_service_tax_code")
    private String goodsServiceTaxCode;

    /**
     * 发票行性质 00：正常行 01：折扣行 02：被折扣行
     */
    @TableField("invoice_line_nature")
    private String invoiceLineNature;

    /**
     * 优惠政策标识
     */
    @TableField("preferential_policy_flag")
    private String preferentialPolicyFlag;

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