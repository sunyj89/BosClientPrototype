package com.microservice.invoice.controller;

import com.microservice.common.result.Result;
import com.microservice.invoice.service.InvoiceHeaderService;
import com.microservice.invoice.vo.IdVO;
import com.microservice.invoice.vo.InvoiceHeaderCreateVO;
import com.microservice.invoice.vo.InvoiceHeaderListVO;
import com.microservice.invoice.vo.InvoiceHeaderUpdateVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 发票抬头管理控制器
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/invoice-headers")
@RequiredArgsConstructor
@Tag(name = "发票抬头管理", description = "发票抬头管理相关接口，提供给小程序调用")
public class InvoiceHeaderController {

    private final InvoiceHeaderService invoiceHeaderService;

    @GetMapping
    @Operation(summary = "获取用户发票抬头列表", description = "根据用户ID获取该用户的所有发票抬头，按默认状态和创建时间倒序排列")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "查询成功"),
            @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Result<List<InvoiceHeaderListVO>> list(
            @Parameter(description = "用户ID", required = true, example = "1001") 
            @RequestParam Long userId) {
        try {
            List<InvoiceHeaderListVO> headers = invoiceHeaderService.getInvoiceHeadersByUserId(userId);
            return Result.success(headers);
        } catch (Exception e) {
            log.error("获取用户发票抬头列表失败", e);
            return Result.error(150001, "获取发票抬头列表失败：" + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "新增发票抬头", description = "创建新的发票抬头，可设置为默认抬头")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "创建成功"),
            @ApiResponse(responseCode = "400", description = "参数错误"),
            @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Result<IdVO> create(@Valid @RequestBody InvoiceHeaderCreateVO createVO) {
        try {
            Long id = invoiceHeaderService.createInvoiceHeader(createVO);
            return Result.success(new IdVO(id));
        } catch (Exception e) {
            log.error("创建发票抬头失败", e);
            return Result.error(150101, "创建发票抬头失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新发票抬头", description = "根据ID更新发票抬头信息")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "更新成功"),
            @ApiResponse(responseCode = "400", description = "参数错误"),
            @ApiResponse(responseCode = "404", description = "发票抬头不存在"),
            @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Result<Void> update(
            @Parameter(description = "发票抬头ID", required = true) @PathVariable Long id,
            @Valid @RequestBody InvoiceHeaderUpdateVO updateVO) {
        try {
            invoiceHeaderService.updateInvoiceHeader(id, updateVO);
            return Result.success(null);
        } catch (Exception e) {
            log.error("更新发票抬头失败", e);
            return Result.error(150201, "更新发票抬头失败：" + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除发票抬头", description = "根据ID删除发票抬头（软删除）")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "删除成功"),
            @ApiResponse(responseCode = "404", description = "发票抬头不存在"),
            @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Result<Void> delete(
            @Parameter(description = "发票抬头ID", required = true) @PathVariable Long id,
            @Parameter(description = "用户ID", required = true, example = "1001") @RequestParam Long userId) {
        try {
            invoiceHeaderService.deleteInvoiceHeader(id, userId);
            return Result.success(null);
        } catch (Exception e) {
            log.error("删除发票抬头失败", e);
            return Result.error(150301, "删除发票抬头失败：" + e.getMessage());
        }
    }

    @PutMapping("/{id}/set-default")
    @Operation(summary = "设置为默认抬头", description = "将指定的发票抬头设置为默认，同时将用户的其他抬头设置为非默认")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "设置成功"),
            @ApiResponse(responseCode = "404", description = "发票抬头不存在"),
            @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Result<Void> setAsDefault(
            @Parameter(description = "发票抬头ID", required = true) @PathVariable Long id,
            @Parameter(description = "用户ID", required = true, example = "1001") @RequestParam Long userId) {
        try {
            invoiceHeaderService.setAsDefaultInvoiceHeader(id, userId);
            return Result.success(null);
        } catch (Exception e) {
            log.error("设置默认发票抬头失败", e);
            return Result.error(150501, "设置默认发票抬头失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取发票抬头详情", description = "根据ID获取发票抬头详细信息")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "查询成功"),
            @ApiResponse(responseCode = "404", description = "发票抬头不存在"),
            @ApiResponse(responseCode = "500", description = "服务器内部错误")
    })
    public Result<InvoiceHeaderListVO> detail(
            @Parameter(description = "发票抬头ID", required = true) @PathVariable Long id,
            @Parameter(description = "用户ID", required = true, example = "1001") @RequestParam Long userId) {
        try {
            InvoiceHeaderListVO header = invoiceHeaderService.getInvoiceHeaderById(id, userId);
            if (header == null) {
                return Result.error(404001, "发票抬头不存在");
            }
            return Result.success(header);
        } catch (Exception e) {
            log.error("获取发票抬头详情失败", e);
            return Result.error(150001, "获取发票抬头详情失败：" + e.getMessage());
        }
    }
}