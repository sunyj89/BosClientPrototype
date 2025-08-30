package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 税率配置列表查询VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@Schema(description = "税率配置列表查询VO")
public class TaxRateConfigListVO {

    @Schema(description = "主键ID", example = "1")
    private Long id;

    @Schema(description = "商户ID", example = "1001")
    private Long merchantId;

    @Schema(description = "油品名称", example = "92号汽油")
    private String productName;

    @Schema(description = "油号", example = "92#")
    private String productCode;

    @Schema(description = "税率", example = "0.1300")
    private BigDecimal taxRate;

    @Schema(description = "单位", example = "升")
    private String unit;

    @Schema(description = "税收商品编码", example = "1010101010000000000")
    private String spbm;

    @Schema(description = "创建时间")
    private LocalDateTime createdTime;

    @Schema(description = "更新时间")
    private LocalDateTime updatedTime;

    @Schema(description = "创建者", example = "system")
    private String createdBy;

    @Schema(description = "更新者", example = "system")
    private String updatedBy;
}