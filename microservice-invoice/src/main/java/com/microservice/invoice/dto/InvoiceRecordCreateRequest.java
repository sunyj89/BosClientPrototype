package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;

/**
 * 开票记录创建请求DTO
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
@Schema(description = "开票记录创建请求")
public class InvoiceRecordCreateRequest {

    @Schema(description = "请求参数")
    private Params params;

    @Data
    @Schema(description = "请求参数")
    public static class Params {
        
        @NotBlank(message = "订单号不能为空")
        @Schema(description = "订单号", required = true, example = "INV202501200011")
        private String order_code;
        
        @Schema(description = "批量关联订单号", example = "BATCH202501200001")
        private String batch_relate_order_code;
        
        @Schema(description = "是否批量开票 0:否 1:是", example = "1")
        private Integer is_batch = 0;
        
        @Schema(description = "商户ID", example = "2001")
        private Long station_id;

        @Schema(description = "商户类型 1:单站 2:集团 3:第三方", example = "1")
        private Integer merchant_type = 1;
        
        @Schema(description = "商品类型 0:非油品 1:油品 2:充值卡", example = "1")
        private Integer product_type;
        
        @Schema(description = "平台编号", example = "wx")
        private String platform_code;
    }
}