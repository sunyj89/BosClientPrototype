package com.microservice.invoice.controller;

import com.microservice.common.result.Result;
import com.microservice.invoice.dto.InvoiceRequestDTO;
import com.microservice.invoice.dto.InvoiceRecordCreateRequest;
import com.microservice.invoice.dto.InvoiceQueryDTO;
import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.mapper.InvoiceRecordMapper;
import com.microservice.invoice.dto.InvoiceResponseDTO;
import com.microservice.invoice.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 统一开票控制器
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/invoice")
@RequiredArgsConstructor
@Tag(name = "统一开票接口", description = "统一开票相关接口")
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    private final InvoiceRecordMapper invoiceRecordMapper;
    
    /**
     * 统一开票接口
     *
     * @param request 开票请求参数
     * @return 开票响应结果
     */
    @PostMapping("/issue")
    @Operation(summary = "开具发票", description = "根据油站配置的开票服务商进行开票，支持标准格式和业务系统格式，系统自动转换")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true,
        content = @Content(
            schema = @Schema(implementation = InvoiceRequestDTO.class),
            examples = {
                @ExampleObject(name = "批量开票-柴油和汽油示例(业务系统格式)", value = "{\n  \"merchantId\": 2001,\n  \"invoiceFlag\": \"0\",\n  \"invoiceType\": \"02\",\n  \"platformCode\": \"wx\",\n  \"buyerName\": \"江西省交投化石能源有限公司虚拟单位\",\n  \"buyerTaxNo\": \"9X0001GGMACM2L8N6B\",\n  \"buyerPhone\": \"17665466542\",\n  \"email\": \"1628287133@qq.com\",\n  \"isBatch\": 1,\n  \"orderCodes\": [\"ORDER_DIESEL_001\", \"ORDER_GASOLINE_001\"],\n  \"masterOrderCode\": \"ORDER_DIESEL_001\",\n  \"oilInfo\": [\n    {\n      \"orderCode\": \"ORDER_DIESEL_001\",\n      \"item\": {\n        \"oilType\": 0,\n        \"goodsType\": 1,\n        \"name\": \"车用柴油0#\",\n        \"num\": 50.000,\n        \"unitPrice\": 7.85,\n        \"price\": 392.50\n      }\n    },\n    {\n      \"orderCode\": \"ORDER_GASOLINE_001\",\n      \"item\": {\n        \"oilType\": 92,\n        \"goodsType\": 1,\n        \"name\": \"车用汽油92#\",\n        \"num\": 30.000,\n        \"unitPrice\": 8.12,\n        \"price\": 243.60\n      }\n    }\n  ]\n}"),
                @ExampleObject(name = "标准格式-单个开票示例", value = "{\n  \"merchantId\": 2001,\n  \"userId\": 12345,\n  \"invoiceFlag\": \"0\",\n  \"invoiceType\": \"02\",\n  \"platformCode\": \"wx\",\n  \"buyerName\": \"江西省交投化石能源有限公司虚拟单位\",\n  \"buyerTaxNo\": \"9X0001GGMACM2L8N6B\",\n  \"buyerPhone\": \"17665466542\",\n  \"email\": \"1628287133@qq.com\",\n  \"buyerAddress\": \"北京市朝阳区XX路XX号\",\n  \"buyerBankName\": \"中国银行北京分行\",\n  \"buyerBankAccount\": \"123456789012345678\",\n  \"drawer\": \"李四\",\n  \"payee\": \"王五\",\n  \"reviewer\": \"赵六\",\n  \"remark\": \"测试备注\",\n  \"details\": [\n    {\n      \"productShortName\": \"成品油\",\n      \"itemName\": \"车用汽油92#\",\n      \"goodsName\": \"*成品油*车用汽油92#\",\n      \"specification\": \"\",\n      \"unit\": \"升\",\n      \"quantity\": 30.00,\n      \"unitPrice\": 8.12,\n      \"taxRate\": 0.13,\n      \"productCode\": \"92\",\n      \"taxClassificationCode\": \"1070101010100000000\",\n      \"preferentialPolicyFlag\": \"0\"\n    }\n  ]\n}")
            }
        )
    )
    public Result<InvoiceResponseDTO> issueInvoice(@Valid @RequestBody InvoiceRequestDTO request) {
        log.info("收到开票请求，merchantId：{}", request.getMerchantId());
        try {
            // 统一转换业务数据为标准格式（如果存在业务数据）
            transformBusinessDataToStandardFormat(request);
            
            InvoiceResponseDTO response = invoiceService.issueInvoice(request);
            return Result.success(response);
        } catch (Exception e) {
            log.error("开票失败", e);
            return Result.error("开票失败：" + e.getMessage());
        }
    }
    
    /**
     * 将业务系统数据转换为标准开票格式
     * 如果存在业务数据(oilInfo或retailInfo)，则转换为标准details格式
     * 如果已经是标准格式(details已存在)，则跳过转换
     */
    private void transformBusinessDataToStandardFormat(InvoiceRequestDTO request) {
        // 如果已经有标准格式的details，并且业务数据为空，则跳过转换
        if ((request.getDetails() != null && !request.getDetails().isEmpty()) &&
            (request.getOilInfo() == null || request.getOilInfo().isEmpty()) &&
            (request.getRetailInfo() == null || request.getRetailInfo().getItem() == null || request.getRetailInfo().getItem().isEmpty())) {
            return;
        }

        java.util.ArrayList<InvoiceRequestDTO.InvoiceDetailDTO> details = new java.util.ArrayList<>();

        // 判断开票类型并处理相应明细
        boolean hasOilItems = request.getOilInfo() != null && 
            request.getOilInfo().stream().anyMatch(oi -> oi != null && oi.getItem() != null);
        
        boolean hasRetailItems = request.getRetailInfo() != null && 
            request.getRetailInfo().getItem() != null && 
            !request.getRetailInfo().getItem().isEmpty();

        if (hasOilItems) {
            // 油品场景
            request.setProductType("1");
            for (InvoiceRequestDTO.OilInfo oi : request.getOilInfo()) {
                if (oi == null || oi.getItem() == null) continue;
                InvoiceRequestDTO.OilInfo.OilItem it = oi.getItem();
                InvoiceRequestDTO.InvoiceDetailDTO d = new InvoiceRequestDTO.InvoiceDetailDTO();
                d.setProductShortName("成品油");
                d.setItemName(it.getName());
                d.setGoodsName("*成品油*" + it.getName());
                d.setSpecification("");
                d.setUnit("升");
                d.setQuantity(it.getNum());
                d.setUnitPrice(it.getUnitPrice());
                d.setTaxRate(new java.math.BigDecimal("0.13")); // 默认税率，将通过productCode查询实际税率
                d.setProductCode(String.valueOf(it.getOilType()));
                // 根据油品类型设置税收分类编码
                if (it.getOilType() != null) {
                    if (it.getOilType() == 0) {
                        // 柴油
                        d.setTaxClassificationCode("1070101030100000000");
                    } else if (it.getOilType() == 92 || it.getOilType() == 95 || it.getOilType() == 98) {
                        // 汽油
                        d.setTaxClassificationCode("1070101010100000000");
                    } else {
                        d.setTaxClassificationCode(""); // 其他油品在服务端查询
                    }
                } else {
                    d.setTaxClassificationCode(""); // 将在服务端按productCode回填
                }
                d.setPreferentialPolicyFlag("0");
                d.setOriginalDetailNo("");
                details.add(d);
            }
        } else if (hasRetailItems) {
            // 非油场景（便利店/积分/洗车/充值卡等）
            request.setProductType("0");
            for (InvoiceRequestDTO.RetailInfo.RetailItem it : request.getRetailInfo().getItem()) {
                if (it == null) continue;
                InvoiceRequestDTO.InvoiceDetailDTO d = new InvoiceRequestDTO.InvoiceDetailDTO();
                
                // 根据retail_type判断具体类型
                String shortName = "非油商品";
                String fullName = "*非油商品*" + it.getName();
                if (it.getRetailType() != null) {
                    switch (it.getRetailType()) {
                        case 1: // 便利店商品
                            shortName = "便利店商品";
                            fullName = "*便利店商品*" + it.getName();
                            break;
                        case 2: // 积分兑换
                            shortName = "积分兑换商品";
                            fullName = "*积分兑换商品*" + it.getName();
                            break;
                        case 3: // 洗车服务
                            shortName = "洗车服务";
                            fullName = "*洗车服务*" + it.getName();
                            break;
                        case 4: // 充值卡
                            shortName = "充值卡";
                            fullName = "*充值卡*" + it.getName();
                            request.setProductType("2"); // 充值卡类型
                            break;
                    }
                }
                
                d.setProductShortName(shortName);
                d.setItemName(it.getName());
                d.setGoodsName(fullName);
                d.setSpecification("");
                d.setUnit("件");
                d.setQuantity(it.getNum());
                d.setUnitPrice(it.getUnitPrice());
                d.setTaxRate(new java.math.BigDecimal("0.13")); // 默认税率，可根据配置调整
                d.setProductCode(null);
                d.setTaxClassificationCode("1070215020000000000");
                d.setPreferentialPolicyFlag("0");
                d.setOriginalDetailNo("");
                details.add(d);
            }
        }

        // 只有在有业务数据转换时才更新details
        if (!details.isEmpty()) {
            request.setDetails(details);
            
            // 清理业务数据字段，避免重复处理
            request.setOilInfo(null);
            request.setRetailInfo(null);
        }
    }
    
    /**
     * 获取发票下载地址
     *
     * @param request 查询请求参数
     * @return 下载地址信息
     */
    @PostMapping("/download-url")
    @Operation(summary = "获取发票下载地址", description = "根据发票号码或订单编码获取发票下载地址，二者至少提供一个")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true,
        content = @Content(
            schema = @Schema(implementation = InvoiceQueryDTO.class),
            examples = {
                @ExampleObject(
                    name = "通过发票号码查询",
                    value = "{\n  \"invoiceNo\": \"20250126000001\",\n  \"merchantId\": 2001\n}"
                ),
                @ExampleObject(
                    name = "通过订单编码查询",
                    value = "{\n  \"orderCode\": \"ORDER_DIESEL_001\",\n  \"merchantId\": 2001\n}"
                )
            }
        )
    )
    public Result<InvoiceResponseDTO> getInvoiceDownloadUrl(@Valid @RequestBody InvoiceQueryDTO request) {
        log.info("获取发票下载地址，发票号码：{}，订单编码：{}，merchantId：{}", 
                request.getInvoiceNo(), request.getOrderCode(), request.getMerchantId());
        try {
            InvoiceResponseDTO response;
            if (request.getInvoiceNo() != null && !request.getInvoiceNo().trim().isEmpty()) {
                // 优先使用发票号码查询
                response = invoiceService.getInvoiceDownloadUrl(request.getInvoiceNo(), request.getMerchantId());
            } else {
                // 使用订单编码查询
                response = invoiceService.getInvoiceDownloadUrlByOrderCode(request.getOrderCode(), request.getMerchantId());
            }
            return Result.success(response);
        } catch (Exception e) {
            log.error("获取发票下载地址失败", e);
            return Result.error("获取发票下载地址失败：" + e.getMessage());
        }
    }
    
    /**
     * 查询发票
     *
     * @param request 查询请求参数
     * @return 发票信息
     */
    @PostMapping("/query")
    @Operation(summary = "查询发票", description = "根据发票号码或订单编码查询发票信息，二者至少提供一个")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true,
        content = @Content(
            schema = @Schema(implementation = InvoiceQueryDTO.class),
            examples = {
                @ExampleObject(
                    name = "通过发票号码查询",
                    value = "{\n  \"invoiceNo\": \"20250126000001\",\n  \"merchantId\": 2001\n}"
                ),
                @ExampleObject(
                    name = "通过订单编码查询",
                    value = "{\n  \"orderCode\": \"ORDER_DIESEL_001\",\n  \"merchantId\": 2001\n}"
                )
            }
        )
    )
    public Result<InvoiceResponseDTO> queryInvoice(@Valid @RequestBody InvoiceQueryDTO request) {
        log.info("查询发票，发票号码：{}，订单编码：{}，merchantId：{}", 
                request.getInvoiceNo(), request.getOrderCode(), request.getMerchantId());
        try {
            InvoiceResponseDTO response;
            if (request.getInvoiceNo() != null && !request.getInvoiceNo().trim().isEmpty()) {
                // 优先使用发票号码查询
                response = invoiceService.queryInvoice(request.getInvoiceNo(), request.getMerchantId());
            } else {
                // 使用订单编码查询
                response = invoiceService.queryInvoiceByOrderCode(request.getOrderCode(), request.getMerchantId());
            }
            return Result.success(response);
        } catch (Exception e) {
            log.error("查询发票失败", e);
            return Result.error("查询发票失败：" + e.getMessage());
        }
    }
    
    /**
     * 申请红字确认单
     *
     * @param request 红字确认单申请参数
     * @return 红字确认单响应
     */
    @PostMapping("/red-confirm")
    @Operation(summary = "申请红字确认单", description = "申请红字确认单")
    public Result<InvoiceResponseDTO> applyRedConfirm(@Valid @RequestBody InvoiceRequestDTO request) {
        log.info("申请红字确认单，merchantId：{}", request.getMerchantId());
        try {
            InvoiceResponseDTO response = invoiceService.applyRedConfirm(request);
            return Result.success(response);
        } catch (Exception e) {
            log.error("申请红字确认单失败", e);
            return Result.error("申请红字确认单失败：" + e.getMessage());
        }
    }
    
    /**
     * 开具红字发票
     *
     * @param request 红字发票请求参数
     * @return 红字发票响应
     */
    @PostMapping("/red-invoice")
    @Operation(summary = "开具红字发票", description = "开具红字发票")
    public Result<InvoiceResponseDTO> issueRedInvoice(@Valid @RequestBody InvoiceRequestDTO request) {
        log.info("开具红字发票，merchantId：{}", request.getMerchantId());
        try {
            InvoiceResponseDTO response = invoiceService.issueRedInvoice(request);
            return Result.success(response);
        } catch (Exception e) {
            log.error("开具红字发票失败", e);
            return Result.error("开具红字发票失败：" + e.getMessage());
        }
    }

    /**
     * 创建开票记录（业务端调用，不直接开票）
     */
    @PostMapping("/record/create")
    @Operation(summary = "创建开票记录", description = "业务端创建开票记录，支持批量开票关联逻辑")
    public Result<String> createInvoiceRecord(@Valid @RequestBody InvoiceRecordCreateRequest request) {
        try {
            InvoiceRecordCreateRequest.Params params = request.getParams();
            if (params == null) {
                return Result.error("缺少必要参数");
            }

            // 查询已有记录
            InvoiceRecord existingRecord = invoiceRecordMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<InvoiceRecord>()
                    .eq(InvoiceRecord::getOrderCode, params.getOrder_code())
            );

            // 处理批量关联订单号
            String batchRelateOrderCode = params.getBatch_relate_order_code();
            if (batchRelateOrderCode == null || batchRelateOrderCode.isEmpty()) {
                batchRelateOrderCode = params.getOrder_code();
            }

            // 查询关联的批量订单
            java.util.List<InvoiceRecord> relatedOrders = invoiceRecordMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<InvoiceRecord>()
                    .eq(InvoiceRecord::getBatchRelateOrderCode, batchRelateOrderCode)
                    .eq(InvoiceRecord::getDeleted, 0)
            );

            // 批量开票逻辑处理
            if (params.getIs_batch() == null || params.getIs_batch() == 0) {
                // 非批量开票，清理其他关联
                if (relatedOrders.size() > 1) {
                    for (InvoiceRecord record : relatedOrders) {
                        if (!record.getOrderCode().equals(batchRelateOrderCode)) {
                            record.setBatchRelateOrderCode(record.getOrderCode());
                            invoiceRecordMapper.updateById(record);
                        }
                    }
                }
            }

            // 创建或更新记录
            InvoiceRecord record = existingRecord != null ? existingRecord : new InvoiceRecord();
            record.setOrderCode(params.getOrder_code());
            record.setBatchRelateOrderCode(batchRelateOrderCode);
            record.setIsBatch(params.getIs_batch() != null ? params.getIs_batch() : 0);
            record.setMerchantId(params.getStation_id() != null ? params.getStation_id() : 2001L);
            record.setMerchantType(params.getMerchant_type() != null ? params.getMerchant_type() : 1);
            record.setProductType(params.getProduct_type());
            record.setPlatformCode(params.getPlatform_code());
            record.setInvoiceStatus("00"); // 待开票
            record.setDeleted(0);

            if (existingRecord != null) {
                record.setUpdatedTime(java.time.LocalDateTime.now());
                invoiceRecordMapper.updateById(record);
            } else {
                record.setCreatedTime(java.time.LocalDateTime.now());
                record.setUpdatedTime(java.time.LocalDateTime.now());
                invoiceRecordMapper.insert(record);
            }

            return Result.success("操作成功");
        } catch (Exception e) {
            log.error("创建开票记录失败", e);
            return Result.error("创建开票记录失败：" + e.getMessage());
        }
    }


}