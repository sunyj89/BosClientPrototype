package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 税率配置新增VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@Schema(description = "税率配置新增VO")
public class TaxRateConfigCreateVO {

    @Schema(description = "商户ID", example = "1001", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "商户ID不能为空")
    private Long merchantId;

    @Schema(description = "油品名称", example = "92号汽油", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "油品名称不能为空")
    @Size(max = 100, message = "油品名称长度不能超过100个字符")
    private String productName;

    @Schema(description = "油号", example = "92#", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "油号不能为空")
    @Size(max = 50, message = "油号长度不能超过50个字符")
    private String productCode;

    @Schema(description = "税率", example = "0.1300", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "税率不能为空")
    @DecimalMin(value = "0.0000", message = "税率不能小于0")
    @DecimalMax(value = "1.0000", message = "税率不能大于1")
    @Digits(integer = 1, fraction = 4, message = "税率格式不正确，最多1位整数，4位小数")
    private BigDecimal taxRate;

    @Schema(description = "单位", example = "升", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "单位不能为空")
    @Size(max = 20, message = "单位长度不能超过20个字符")
    private String unit;

    @Schema(description = "税收商品编码", example = "1010101010000000000", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "税收商品编码不能为空")
    @Size(max = 50, message = "税收商品编码长度不能超过50个字符")
    private String spbm;
}