package com.microservice.invoice.controller;

import com.microservice.common.result.Result;
import com.microservice.invoice.dto.StationInvoiceConfigCreateDTO;
import com.microservice.invoice.dto.StationInvoiceConfigQueryDTO;
import com.microservice.invoice.dto.StationInvoiceConfigUpdateDTO;
import com.microservice.invoice.service.StationInvoiceConfigService;
import com.microservice.invoice.vo.PageVO;
import com.microservice.invoice.vo.StationInvoiceConfigVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 油站发票配置 Controller
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/merchants/{merchantId}/invoice-configs")
@RequiredArgsConstructor
@Tag(name = "油站发票配置管理", description = "油站发票配置管理相关接口")
public class StationInvoiceConfigController {

    private final StationInvoiceConfigService stationInvoiceConfigService;

    @GetMapping
    @Operation(summary = "获取发票配置列表", description = "分页获取指定油站的发票配置列表，可根据状态筛选")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "400", description = "参数错误"),
        @ApiResponse(responseCode = "500", description = "系统异常")
    })
    public Result<PageVO<StationInvoiceConfigVO>> getConfigList(
            @Parameter(description = "商户ID", required = true) @PathVariable Long merchantId,
            @Parameter(description = "查询条件") @ModelAttribute StationInvoiceConfigQueryDTO queryDTO) {
        log.info("获取发票配置列表, merchantId: {}, queryDTO: {}", merchantId, queryDTO);
        PageVO<StationInvoiceConfigVO> result = stationInvoiceConfigService.getConfigList(merchantId, queryDTO);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取发票配置详情", description = "获取单个发票配置的完整信息")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "404", description = "配置不存在"),
        @ApiResponse(responseCode = "500", description = "系统异常")
    })
    public Result<StationInvoiceConfigVO> getConfigDetail(
            @Parameter(description = "商户ID", required = true) @PathVariable Long merchantId,
            @Parameter(description = "配置ID", required = true) @PathVariable Long id) {
        log.info("获取发票配置详情, merchantId: {}, configId: {}", merchantId, id);
        StationInvoiceConfigVO result = stationInvoiceConfigService.getConfigDetail(merchantId, id);
        return Result.success(result);
    }

    @PostMapping
    @Operation(summary = "创建发票配置", description = "为指定油站创建一个新的发票配置")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "创建成功"),
        @ApiResponse(responseCode = "400", description = "参数错误或时间冲突"),
        @ApiResponse(responseCode = "500", description = "系统异常")
    })
    public Result<StationInvoiceConfigVO> createConfig(
            @Parameter(description = "商户ID", required = true) @PathVariable Long merchantId,
            @Parameter(description = "创建配置信息", required = true) @RequestBody @Validated StationInvoiceConfigCreateDTO createDTO) {
        log.info("创建发票配置, merchantId: {}, createDTO: {}", merchantId, createDTO);
        StationInvoiceConfigVO result = stationInvoiceConfigService.createConfig(merchantId, createDTO);
        return Result.success(result);
    }

    @PutMapping("/{id}")
    @Operation(summary = "编辑发票配置", description = "更新一个已有的发票配置")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "更新成功"),
        @ApiResponse(responseCode = "400", description = "参数错误或时间冲突"),
        @ApiResponse(responseCode = "404", description = "配置不存在"),
        @ApiResponse(responseCode = "500", description = "系统异常")
    })
    public Result<StationInvoiceConfigVO> updateConfig(
            @Parameter(description = "商户ID", required = true) @PathVariable Long merchantId,
            @Parameter(description = "配置ID", required = true) @PathVariable Long id,
            @Parameter(description = "更新配置信息", required = true) @RequestBody @Validated StationInvoiceConfigUpdateDTO updateDTO) {
        log.info("更新发票配置, merchantId: {}, configId: {}, updateDTO: {}", merchantId, id, updateDTO);
        StationInvoiceConfigVO result = stationInvoiceConfigService.updateConfig(merchantId, id, updateDTO);
        return Result.success(result);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除发票配置", description = "删除一个发票配置（软删除）")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "删除成功"),
        @ApiResponse(responseCode = "400", description = "生效中的配置不能删除"),
        @ApiResponse(responseCode = "404", description = "配置不存在"),
        @ApiResponse(responseCode = "500", description = "系统异常")
    })
    public Result<Void> deleteConfig(
            @Parameter(description = "商户ID", required = true) @PathVariable Long merchantId,
            @Parameter(description = "配置ID", required = true) @PathVariable Long id) {
        log.info("删除发票配置, merchantId: {}, configId: {}", merchantId, id);
        stationInvoiceConfigService.deleteConfig(merchantId, id);
        return Result.success();
    }

    @GetMapping("/active")
    @Operation(summary = "获取当前生效的配置", description = "获取指定油站当前生效的发票配置")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "获取成功"),
        @ApiResponse(responseCode = "404", description = "无生效配置"),
        @ApiResponse(responseCode = "500", description = "系统异常")
    })
    public Result<StationInvoiceConfigVO> getActiveConfig(
            @Parameter(description = "商户ID", required = true) @PathVariable Long merchantId) {
        log.info("获取当前生效配置, merchantId: {}", merchantId);
        StationInvoiceConfigVO result = stationInvoiceConfigService.getActiveConfig(merchantId);
        return Result.success(result);
    }
}