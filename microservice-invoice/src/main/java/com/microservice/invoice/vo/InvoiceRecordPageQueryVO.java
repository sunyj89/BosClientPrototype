package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 开票记录分页查询参数VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@Schema(description = "开票记录分页查询参数VO")
public class InvoiceRecordPageQueryVO {

    @Schema(description = "当前页码", example = "1")
    @Min(value = 1, message = "页码必须大于0")
    private Integer page = 1;

    @Schema(description = "每页数量", example = "10")
    @Min(value = 1, message = "每页数量必须大于0")
    private Integer pageSize = 10;

    @Schema(description = "用户ID", example = "1001")
    private Long userId;

    @Schema(description = "订单编号", example = "INV202401010001")
    private String orderCode;

    @Schema(description = "发票号码", example = "25997000000170129316")
    private String invoiceNo;

    @Schema(description = "购买方电话", example = "13800138000")
    private String buyerPhone;

    @Schema(description = "创建开始时间", example = "2024-01-01")
    private LocalDate createTimeStart;

    @Schema(description = "创建结束时间", example = "2024-12-31")
    private LocalDate createTimeEnd;

    @Schema(description = "开票开始日期", example = "2024-01-01")
    private LocalDate invoiceDateStart;

    @Schema(description = "开票结束日期", example = "2024-12-31")
    private LocalDate invoiceDateEnd;

    @Schema(description = "发票状态", example = "02", allowableValues = {"00", "01", "02", "03"})
    private String invoiceStatus;

    @Schema(description = "商户ID", example = "1001")
    private Long merchantId;

    @Schema(description = "排序字段", example = "createdTime", allowableValues = {"orderCode", "userId", "merchantId", "buyerName", "totalAmount", "totalAmountWithTax", "invoiceStatus", "invoiceDate", "createdTime", "updatedTime"})
    private String sortBy = "createdTime";

    @Schema(description = "排序方向", example = "desc", allowableValues = {"asc", "desc"})
    private String sortOrder = "desc";
}