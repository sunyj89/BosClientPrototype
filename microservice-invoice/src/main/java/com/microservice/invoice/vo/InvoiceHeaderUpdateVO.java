package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

/**
 * 发票抬头更新VO
 *
 * @author system
 * @since 2024-01-01
 */
@Data
@Schema(description = "发票抬头更新VO")
public class InvoiceHeaderUpdateVO {

    @Schema(description = "发票抬头名称", example = "张三", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "发票抬头名称不能为空")
    @Size(max = 200, message = "发票抬头名称长度不能超过200个字符")
    private String headerName;

    @Schema(description = "纳税人识别号", example = "110101199001011234", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "纳税人识别号不能为空")
    @Size(max = 50, message = "纳税人识别号长度不能超过50个字符")
    private String taxId;

    @Schema(description = "抬头类型", example = "1", allowableValues = {"1", "2"}, requiredMode = Schema.RequiredMode.REQUIRED)
    @NotNull(message = "抬头类型不能为空")
    @Min(value = 1, message = "抬头类型只能是1（个人）或2（企业）")
    @Max(value = 2, message = "抬头类型只能是1（个人）或2（企业）")
    private Integer headerType;

    @Schema(description = "手机号码", example = "13800138001")
    @Size(max = 20, message = "手机号码长度不能超过20个字符")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号码格式不正确")
    private String phone;

    @Schema(description = "邮箱地址", example = "zhangsan@example.com")
    @Size(max = 100, message = "邮箱地址长度不能超过100个字符")
    @Email(message = "邮箱地址格式不正确")
    private String email;

    @Schema(description = "地址", example = "北京市朝阳区测试街道1号")
    @Size(max = 200, message = "地址长度不能超过200个字符")
    private String address;

    @Schema(description = "开户银行", example = "中国银行北京分行")
    @Size(max = 100, message = "开户银行长度不能超过100个字符")
    private String bankName;

    @Schema(description = "银行账号", example = "1234567890123456")
    @Size(max = 50, message = "银行账号长度不能超过50个字符")
    private String bankAccount;
}