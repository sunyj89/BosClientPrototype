package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 税率配置查询条件VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@Schema(description = "税率配置查询条件VO")
public class TaxRateConfigQueryVO {

    @Schema(description = "商户ID", example = "1001")
    private Long merchantId;

    @Schema(description = "油品名称", example = "92号汽油")
    private String productName;

    @Schema(description = "油号", example = "92#")
    private String productCode;

    @Schema(description = "单位", example = "升")
    private String unit;

    @Schema(description = "税收商品编码", example = "1010101010000000000")
    private String spbm;

    @Schema(description = "最小税率", example = "0.1000")
    private BigDecimal taxRateMin;

    @Schema(description = "最大税率", example = "0.2000")
    private BigDecimal taxRateMax;

    @Schema(description = "创建开始时间")
    private LocalDateTime startTime;

    @Schema(description = "创建结束时间")
    private LocalDateTime endTime;

    @Schema(description = "排序字段", example = "createdTime", allowableValues = {"merchantId", "productName", "productCode", "taxRate", "unit", "spbm", "createdTime", "updatedTime"})
    private String sortBy;

    @Schema(description = "排序方向", example = "desc", allowableValues = {"asc", "desc"})
    private String sortOrder = "desc";
}