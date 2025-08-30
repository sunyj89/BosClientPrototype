package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 发票抬头列表VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@Schema(description = "发票抬头列表VO")
public class InvoiceHeaderListVO {

    @Schema(description = "主键ID", example = "1")
    private Long id;

    @Schema(description = "用户ID", example = "1001")
    private Long userId;

    @Schema(description = "发票抬头名称", example = "张三")
    private String headerName;

    @Schema(description = "纳税人识别号", example = "110101199001011234")
    private String taxId;

    @Schema(description = "抬头类型", example = "1", allowableValues = {"1", "2"})
    private Integer headerType;

    @Schema(description = "抬头类型名称", example = "个人")
    private String headerTypeName;

    @Schema(description = "手机号码", example = "13800138001")
    private String phone;

    @Schema(description = "邮箱地址", example = "zhangsan@example.com")
    private String email;

    @Schema(description = "地址", example = "北京市朝阳区测试街道1号")
    private String address;

    @Schema(description = "开户银行", example = "中国银行北京分行")
    private String bankName;

    @Schema(description = "银行账号", example = "1234567890123456")
    private String bankAccount;

    @Schema(description = "是否默认抬头", example = "1", allowableValues = {"0", "1"})
    private Integer isDefault;

    @Schema(description = "是否默认抬头名称", example = "默认")
    private String isDefaultName;

    @Schema(description = "创建时间", example = "2024-01-01 12:00:00")
    private LocalDateTime createdTime;

    @Schema(description = "更新时间", example = "2024-01-01 12:00:00")
    private LocalDateTime updatedTime;

    @Schema(description = "创建者", example = "system")
    private String createdBy;

    @Schema(description = "更新者", example = "system")
    private String updatedBy;
}