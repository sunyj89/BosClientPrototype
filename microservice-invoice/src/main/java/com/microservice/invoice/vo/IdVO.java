package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 通用ID响应VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "通用ID响应")
public class IdVO {
    
    @Schema(description = "主键ID", example = "123")
    private Long id;
}