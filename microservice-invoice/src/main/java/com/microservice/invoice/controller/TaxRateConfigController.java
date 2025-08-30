package com.microservice.invoice.controller;

import com.microservice.common.result.Result;
import com.microservice.invoice.service.TaxRateConfigService;
import com.microservice.invoice.vo.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 税率配置管理接口
 * 提供税率配置的增删改查、分页、详情等API
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/tax-rate-configs")
@RequiredArgsConstructor
@Tag(name = "税率配置管理", description = "税率配置管理相关接口")
public class TaxRateConfigController {

    private final TaxRateConfigService taxRateConfigService;

    @Operation(summary = "税率配置分页查询", description = "根据查询条件分页获取税率配置列表，默认按ID倒序排序")
    @GetMapping
    public Result<PageVO<TaxRateConfigListVO>> list(
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量", example = "10") @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "商户ID") @RequestParam(required = false) Long merchantId,
            @Parameter(description = "商品编码") @RequestParam(required = false) String productCode,
            @Parameter(description = "税收商品编码") @RequestParam(required = false) String spbm
    ) {
        log.info("分页查询税率配置列表，页码: {}, 每页数量: {}, 商户ID: {}, 商品编码: {}, 税收商品编码: {}", 
                page, pageSize, merchantId, productCode, spbm);
        
        PageVO<TaxRateConfigListVO> result = taxRateConfigService.list(page, pageSize, merchantId, productCode, spbm);
        log.info("分页查询税率配置列表成功，总记录数: {}", result.getTotal());
        return Result.success(result);
    }

    @Operation(summary = "创建税率配置", description = "新增税率配置，创建时间和更新时间自动生成")
    @PostMapping
    public Result<IdVO> create(@Valid @RequestBody TaxRateConfigCreateVO createVO) {
        log.info("创建税率配置，参数: {}", createVO);
        
        try {
            Long id = taxRateConfigService.create(createVO);
            log.info("创建税率配置成功，ID: {}", id);
            return Result.success(new IdVO(id));
        } catch (Exception e) {
            log.error("创建税率配置失败", e);
            return Result.error(500001, "创建税率配置失败：" + e.getMessage());
        }
    }

    @Operation(summary = "更新税率配置", description = "编辑税率配置，更新时间自动生成")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "成功")
    })
    @PutMapping("/{id}")
    public Result<Void> update(
            @Parameter(description = "税率配置ID", example = "1") @PathVariable @NotNull Long id,
            @Valid @RequestBody TaxRateConfigUpdateVO updateVO) {
        log.info("更新税率配置，ID: {}, 参数: {}", id, updateVO);
        
        try {
            taxRateConfigService.update(id, updateVO);
            log.info("更新税率配置成功，ID: {}", id);
            return Result.success(null);
        } catch (Exception e) {
            log.error("更新税率配置失败，ID: {}", id, e);
            return Result.error(500001, "更新税率配置失败：" + e.getMessage());
        }
    }

    @Operation(summary = "税率配置详情", description = "根据ID获取税率配置详情")
    @GetMapping("/{id}")
    public Result<TaxRateConfigListVO> detail(
            @Parameter(description = "税率配置ID", example = "1") @PathVariable @NotNull Long id) {
        log.info("获取税率配置详情，ID: {}", id);
        
        try {
            TaxRateConfigListVO taxRateConfig = taxRateConfigService.detail(id);
            if (taxRateConfig == null) {
                log.warn("税率配置不存在，ID: {}", id);
                return Result.error(404001, "税率配置不存在");
            }
            
            log.info("获取税率配置详情成功，ID: {}", id);
            return Result.success(taxRateConfig);
        } catch (Exception e) {
            log.error("获取税率配置详情失败，ID: {}", id, e);
            return Result.error(500001, "获取税率配置详情失败：" + e.getMessage());
        }
    }

    @Operation(summary = "删除税率配置", description = "根据ID删除税率配置，删除时间自动生成")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @Parameter(description = "税率配置ID", example = "1") @PathVariable @NotNull Long id) {
        log.info("删除税率配置，ID: {}", id);
        
        try {
            taxRateConfigService.delete(id);
            log.info("删除税率配置成功，ID: {}", id);
            return Result.success(null);
        } catch (Exception e) {
            log.error("删除税率配置失败，ID: {}", id, e);
            return Result.error(500001, "删除税率配置失败：" + e.getMessage());
        }
    }
}