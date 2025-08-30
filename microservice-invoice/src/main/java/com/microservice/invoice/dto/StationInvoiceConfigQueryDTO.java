package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 油站发票配置查询DTO
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Data
@Schema(description = "油站发票配置查询DTO")
public class StationInvoiceConfigQueryDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "状态筛选(pending:未生效, active:生效中, expired:已失效)", example = "active")
    private String status;

    @Schema(description = "页码", example = "1")
    private Integer page = 1;

    @Schema(description = "每页数量", example = "10")
    private Integer limit = 10;
}