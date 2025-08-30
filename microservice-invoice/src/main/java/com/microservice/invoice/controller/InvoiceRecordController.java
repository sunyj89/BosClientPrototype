package com.microservice.invoice.controller;

import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.service.InvoiceRecordService;
import com.microservice.invoice.vo.InvoiceRecordListVO;
import com.microservice.invoice.vo.InvoiceRecordPageQueryVO;
import com.microservice.common.result.Result;
import com.microservice.invoice.vo.PageVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * 开票记录Controller
 *
 * @author system
 * @date 2024-01-01
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/invoice-records")
@RequiredArgsConstructor
@Tag(name = "开票记录管理", description = "开票记录管理相关接口")
public class InvoiceRecordController {

    private final InvoiceRecordService invoiceRecordService;

    @GetMapping
    @Operation(summary = "分页查询开票记录列表", description = "根据条件分页查询开票记录列表，默认查询最近3个月的数据")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "查询成功", content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "500", description = "服务器内部错误", content = @Content(mediaType = "application/json"))
    })
    public Result<PageVO<InvoiceRecordListVO>> list(
            @Parameter(description = "当前页码", example = "1")
            @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量", example = "10") 
            @RequestParam(defaultValue = "10") Integer pageSize,
            @Parameter(description = "用户ID", example = "1001")
            @RequestParam(required = false) Long userId,
            @Parameter(description = "订单编号", example = "INV202401010001")
            @RequestParam(required = false) String orderCode,
            @Parameter(description = "发票号码", example = "25997000000170129316")
            @RequestParam(required = false) String invoiceNo,
            @Parameter(description = "购买方电话", example = "13800138000")
            @RequestParam(required = false) String buyerPhone,
            @Parameter(description = "创建开始时间", example = "2024-01-01")
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createTimeStart,
            @Parameter(description = "创建结束时间", example = "2024-12-31")
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate createTimeEnd,
            @Parameter(description = "开票开始日期", example = "2024-01-01")
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate invoiceDateStart,
            @Parameter(description = "开票结束日期", example = "2024-12-31")
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate invoiceDateEnd,
            @Parameter(description = "发票状态", example = "02")
            @RequestParam(required = false) String invoiceStatus,
            @Parameter(description = "站点ID", example = "1001")
            @RequestParam(required = false) Long stationId,
            @Parameter(description = "排序字段", example = "createdTime")
            @RequestParam(defaultValue = "createdTime") String sortBy,
            @Parameter(description = "排序方向", example = "desc")
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        try {
            // 构建查询VO
            InvoiceRecordPageQueryVO queryVO = new InvoiceRecordPageQueryVO();
            queryVO.setPage(page);
            queryVO.setPageSize(pageSize);
            queryVO.setUserId(userId);
            queryVO.setOrderCode(orderCode);
            queryVO.setInvoiceNo(invoiceNo);
            queryVO.setBuyerPhone(buyerPhone);
            queryVO.setCreateTimeStart(createTimeStart);
            queryVO.setCreateTimeEnd(createTimeEnd);
            queryVO.setInvoiceDateStart(invoiceDateStart);
            queryVO.setInvoiceDateEnd(invoiceDateEnd);
            queryVO.setInvoiceStatus(invoiceStatus);
            queryVO.setMerchantId(stationId);
            queryVO.setSortBy(sortBy);
            queryVO.setSortOrder(sortOrder);
            
            PageVO<InvoiceRecordListVO> result = invoiceRecordService.getInvoiceRecordPage(queryVO);
            log.info("分页查询开票记录列表成功，总记录数：{}", result.getTotal());
            return Result.success(result);
        } catch (Exception e) {
            log.error("分页查询开票记录列表失败", e);
            return Result.error(500001, "查询开票记录列表失败：" + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询开票记录详情", description = "根据主键ID查询开票记录详情")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "查询成功", content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "开票记录不存在", content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "500", description = "服务器内部错误", content = @Content(mediaType = "application/json"))
    })
    public Result<InvoiceRecord> getInvoiceRecordById(
            @Parameter(description = "开票记录ID", example = "1")
            @PathVariable Long id) {
        
        try {
            log.info("根据ID查询开票记录详情，ID：{}", id);
            
            if (id == null) {
                log.warn("开票记录ID为空");
                return Result.error(400001, "开票记录ID不能为空");
            }
            
            InvoiceRecord record = invoiceRecordService.getInvoiceRecordById(id);
            if (record == null) {
                log.warn("开票记录不存在，ID：{}", id);
                return Result.error(404001, "开票记录不存在");
            }
            
            log.info("根据ID查询开票记录详情成功，ID：{}", id);
            return Result.success(record);
        } catch (Exception e) {
            log.error("根据ID查询开票记录详情失败，ID：{}", id, e);
            return Result.error(500001, "获取开票记录详情失败：" + e.getMessage());
        }
    }
}