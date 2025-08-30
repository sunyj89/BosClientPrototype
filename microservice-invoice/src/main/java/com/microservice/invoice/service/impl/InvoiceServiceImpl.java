package com.microservice.invoice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.microservice.invoice.dto.InvoiceRequestDTO;
import com.microservice.invoice.dto.InvoiceResponseDTO;
import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.entity.InvoiceDetail;
import com.microservice.invoice.entity.StationInvoiceConfig;
import com.microservice.invoice.factory.InvoiceProviderFactory;
import com.microservice.invoice.mapper.InvoiceRecordMapper;
import com.microservice.invoice.mapper.InvoiceDetailMapper;
import com.microservice.invoice.mapper.StationInvoiceConfigMapper;
import com.microservice.invoice.mapper.TaxRateConfigMapper;
import com.microservice.invoice.entity.TaxRateConfig;
import com.microservice.invoice.provider.InvoiceProvider;
import com.microservice.invoice.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 统一开票服务实现
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {
    
    private final StationInvoiceConfigMapper stationInvoiceConfigMapper;
    private final InvoiceRecordMapper invoiceRecordMapper;
    private final InvoiceDetailMapper invoiceDetailMapper;
    private final InvoiceProviderFactory invoiceProviderFactory;
    private final TaxRateConfigMapper taxRateConfigMapper;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InvoiceResponseDTO issueInvoice(InvoiceRequestDTO request) {
        log.info("开始处理开票请求，merchantId：{}，是否批量：{}", request.getMerchantId(), request.getIsBatch());

        // 0. 检查重复开票
        checkDuplicateInvoice(request);
        
        // 判断是否为批量开票
        if (request.getIsBatch() != null && request.getIsBatch() == 1 && request.getOrderCodes() != null && !request.getOrderCodes().isEmpty()) {
            return processBatchInvoice(request);
        } else {
            return processSingleInvoice(request);
        }
    }
    
    /**
     * 处理批量开票
     */
    private InvoiceResponseDTO processBatchInvoice(InvoiceRequestDTO request) {
        log.info("开始处理批量开票请求，订单数量：{}", request.getOrderCodes().size());
        
        List<String> orderCodes = request.getOrderCodes();
        String masterOrderCode = request.getMasterOrderCode();
        if (masterOrderCode == null || masterOrderCode.isEmpty()) {
            masterOrderCode = orderCodes.get(0); // 使用第一个订单号作为主订单号
        }
        
        // 1. 先解除主订单的旧关联关系（如果存在）
        unbindOldSubOrders(masterOrderCode);
        
        // 2. 处理明细合并，将所有订单的明细拼接到主请求中
        mergeInvoiceDetails(request);
        
        // 3. 为所有订单号创建发票记录（包括主订单）
        for (String orderCode : orderCodes) {
            try {
                // 所有订单都创建独立的发票记录
                saveBatchOrderInvoiceRecord(request, orderCode, masterOrderCode);
            } catch (Exception e) {
                log.error("保存订单{}发票记录失败", orderCode, e);
            }
        }
        
        // 4. 使用主订单号进行开票，包含所有订单的明细
        request.setOrderCodes(List.of(masterOrderCode)); // 设置为主订单号
        request.setMasterOrderCode(masterOrderCode);
        
        // 5. 调用单个开票流程（只调用一次百旺接口）
        InvoiceResponseDTO response = processSingleInvoice(request, masterOrderCode);
        
        // 6. 如果开票成功，更新所有子订单的发票记录
        if (response.getCode() == 0) {
            updateBatchOrdersInvoiceInfo(orderCodes, response.getInvoiceNo(), masterOrderCode);
            response.setMessage("批量开票成功，共处理" + orderCodes.size() + "个订单，发票号：" + response.getInvoiceNo());
        }
        
        return response;
    }
    
    /**
     * 创建单个订单的请求
     */
    private InvoiceRequestDTO createSingleOrderRequest(InvoiceRequestDTO batchRequest, String orderCode) {
        InvoiceRequestDTO singleRequest = new InvoiceRequestDTO();
        
        // 复制基本信息
        singleRequest.setMerchantId(batchRequest.getMerchantId());
        singleRequest.setUserId(batchRequest.getUserId());
        singleRequest.setInvoiceFlag(batchRequest.getInvoiceFlag());
        singleRequest.setInvoiceType(batchRequest.getInvoiceType());
        singleRequest.setProductType(batchRequest.getProductType());
        singleRequest.setPlatformCode(batchRequest.getPlatformCode());
        singleRequest.setGroupId(batchRequest.getGroupId());
        
        // 设置为单个订单，不是批量
        singleRequest.setIsBatch(1); // 仍然标记为批量的一部分
        List<String> singleOrderList = new ArrayList<>();
        singleOrderList.add(orderCode);
        singleRequest.setOrderCodes(singleOrderList);
        
        // 复制购买方信息
        singleRequest.setBuyerName(batchRequest.getBuyerName());
        singleRequest.setBuyerTaxNo(batchRequest.getBuyerTaxNo());
        singleRequest.setBuyerAddress(batchRequest.getBuyerAddress());
        singleRequest.setBuyerPhone(batchRequest.getBuyerPhone());
        singleRequest.setEmail(batchRequest.getEmail());
        singleRequest.setBuyerBankName(batchRequest.getBuyerBankName());
        singleRequest.setBuyerBankAccount(batchRequest.getBuyerBankAccount());
        singleRequest.setBuyerAgent(batchRequest.getBuyerAgent());
        singleRequest.setAgentIdNo(batchRequest.getAgentIdNo());
        singleRequest.setAgentPhone(batchRequest.getAgentPhone());
        singleRequest.setDrawer(batchRequest.getDrawer());
        singleRequest.setPayee(batchRequest.getPayee());
        singleRequest.setReviewer(batchRequest.getReviewer());
        singleRequest.setRemark(batchRequest.getRemark());
        
        // 复制红字发票相关信息
        singleRequest.setOriginalInvoiceNo(batchRequest.getOriginalInvoiceNo());
        singleRequest.setRedConfirmNo(batchRequest.getRedConfirmNo());
        singleRequest.setRedConfirmUuid(batchRequest.getRedConfirmUuid());
        singleRequest.setOriginalInvoiceDate(batchRequest.getOriginalInvoiceDate());
        singleRequest.setReverseReasonCode(batchRequest.getReverseReasonCode());
        
        // 复制发票明细（批量开票时，明细已经是合并后的所有订单明细）
        singleRequest.setDetails(batchRequest.getDetails());
        
        // 复制兼容旧系统的字段
        singleRequest.setOilInfo(batchRequest.getOilInfo());
        singleRequest.setRetailInfo(batchRequest.getRetailInfo());
        
        return singleRequest;
    }
    
    /**
     * 处理单个订单开票
     */
    private InvoiceResponseDTO processSingleInvoice(InvoiceRequestDTO request) {
        return processSingleInvoice(request, null);
    }
    
    /**
     * 处理单个订单开票
     */
    private InvoiceResponseDTO processSingleInvoice(InvoiceRequestDTO request, String masterOrderCode) {
        // 0.1 明细合并处理：支持油品+非油品同时提交
        mergeInvoiceDetails(request);

        // 1. 获取商户配置（根据 merchant_id 查询生效中的未删除配置）
        StationInvoiceConfig baseConfig = stationInvoiceConfigMapper.selectActiveByStationId(request.getMerchantId());
        if (baseConfig == null || baseConfig.getDeleted()) {
            throw new RuntimeException("油站未配置开票信息或已停用");
        }

        // 1.1 根据默认开票商户与传入的groupId确定实际开票主体
        Long targetMerchantId = request.getMerchantId();
        Integer targetMerchantType = 1;
        if (baseConfig.getDefaultInvoiceMerchant() != null && baseConfig.getDefaultInvoiceMerchant() == 2
                && request.getGroupId() != null) {
            targetMerchantId = request.getGroupId();
            targetMerchantType = 2;
        } else if (baseConfig.getDefaultInvoiceMerchant() != null && baseConfig.getDefaultInvoiceMerchant() == 1) {
            targetMerchantType = 1;
        }

        StationInvoiceConfig stationConfig = stationInvoiceConfigMapper.selectActiveByStationId(targetMerchantId);
        if (stationConfig == null || stationConfig.getDeleted()) {
            throw new RuntimeException("未找到开票主体的生效配置");
        }
        
        // 2. 补充税率和商品信息（根据productCode查询税率配置）
        enrichInvoiceDetailsWithTaxConfig(request, stationConfig.getMerchantId());
        
        // 3. 保存开票记录
        InvoiceRecord record = saveInvoiceRecord(request, stationConfig);
        record.setMerchantId(targetMerchantId);
        record.setMerchantType(targetMerchantType);
        
        // 3.1 处理批量开票逻辑
        handleBatchInvoiceLogic(request, record, masterOrderCode);
        
        invoiceRecordMapper.updateById(record);
        
        // 4. 保存发票明细
        saveInvoiceDetails(record.getId(), request.getDetails());
        
        try {
            // 5. 根据服务商类型获取对应的开票服务
            InvoiceProvider provider = invoiceProviderFactory.getProvider(stationConfig.getProviderType());
            
            // 6. 构建服务商配置
            InvoiceProvider.StationInvoiceConfig config = buildProviderConfig(stationConfig);
            
            // 7. 调用开票服务
            InvoiceResponseDTO response = provider.issueInvoice(request, config);
            
            // 8. 更新开票结果
            if (response.getCode() == 0) {
                record.setInvoiceNo(response.getInvoiceNo());
                record.setInvoiceDate(LocalDate.now());
                record.setInvoiceStatus("02"); // 开票成功
                record.setPdfUrl(response.getPdfUrl());
                record.setOfdUrl(response.getOfdUrl());
                record.setXmlUrl(response.getXmlUrl());
                record.setEwmUrl(response.getQrCodeUrl());
            } else {
                record.setInvoiceStatus("03"); // 开票失败
                record.setErrorMsg(response.getMessage());
            }
            
            record.setUpdatedTime(LocalDateTime.now());
            invoiceRecordMapper.updateById(record);
            
            // 9. 补充响应信息
            response.setRequestSerialNo(record.getOrderCode());
            
            return response;
            
        } catch (Exception e) {
            log.error("开票失败", e);
            // 更新开票状态为失败
            record.setInvoiceStatus("03");
            record.setErrorMsg(e.getMessage());
            record.setUpdatedTime(LocalDateTime.now());
            invoiceRecordMapper.updateById(record);
            
            InvoiceResponseDTO response = new InvoiceResponseDTO();
            response.setCode(-1);
            response.setMessage("开票失败：" + e.getMessage());
            return response;
        }
    }

    /**
     * 合并发票明细
     * - 非油：同名商品聚合（name、税率、单价一致时合并数量与金额）
     * - 油品：不合并，一个订单对应一个数据
     */
    private void mergeInvoiceDetails(InvoiceRequestDTO request) {
        java.util.List<InvoiceRequestDTO.InvoiceDetailDTO> merged = new java.util.ArrayList<>();

        boolean hasOil = request.getOilInfo() != null && request.getOilInfo().stream().anyMatch(oi -> oi != null && oi.getItem() != null);
        boolean hasRetail = request.getRetailInfo() != null && request.getRetailInfo().getItem() != null && !request.getRetailInfo().getItem().isEmpty();

        // 先合并已有的标准明细
        if (request.getDetails() != null && !request.getDetails().isEmpty()) {
            merged.addAll(request.getDetails());
        }

        if (hasOil) {
            // 油品不合并，每个订单对应一个明细
            for (InvoiceRequestDTO.OilInfo oi : request.getOilInfo()) {
                if (oi == null || oi.getItem() == null) { continue; }
                var it = oi.getItem();
                String productCode = it.getOilType() == null ? null : String.valueOf(it.getOilType());
                
                InvoiceRequestDTO.InvoiceDetailDTO d = new InvoiceRequestDTO.InvoiceDetailDTO();
                d.setProductCode(productCode);
                d.setProductShortName("成品油");
                d.setItemName(it.getName());
                d.setGoodsName("*成品油*" + it.getName());
                d.setSpecification("");
                d.setUnit("升");
                d.setQuantity(it.getNum() == null ? java.math.BigDecimal.ZERO : it.getNum());
                d.setUnitPrice(it.getUnitPrice());
                d.setTaxRate(new java.math.BigDecimal("0.13"));
                d.setTaxClassificationCode("");
                d.setPreferentialPolicyFlag("0");
                d.setOriginalDetailNo("");
                merged.add(d);
            }
        }

        if (hasRetail) {
            java.util.Map<String, InvoiceRequestDTO.InvoiceDetailDTO> retailMap = new java.util.LinkedHashMap<>();
            // 将已有明细中非油商品（无productCode或单位非升）先计入map（按name+unitPrice聚合）
            for (InvoiceRequestDTO.InvoiceDetailDTO d0 : merged) {
                if (d0.getProductCode() == null && d0.getUnitPrice() != null) {
                    String key0 = (d0.getItemName() == null ? d0.getGoodsName() : d0.getItemName()) + "|" + d0.getUnitPrice().toPlainString();
                    retailMap.put(key0, d0);
                }
            }
            for (InvoiceRequestDTO.RetailInfo.RetailItem it : request.getRetailInfo().getItem()) {
                if (it == null) { continue; }
                String key = (it.getName() == null ? "" : it.getName()) + "|" + (it.getUnitPrice() == null ? "" : it.getUnitPrice().toPlainString());
                InvoiceRequestDTO.InvoiceDetailDTO d = retailMap.get(key);
                if (d == null) {
                    d = new InvoiceRequestDTO.InvoiceDetailDTO();
                    d.setProductShortName("非油商品");
                    d.setItemName(it.getName());
                    d.setGoodsName("*非油商品*" + it.getName());
                    d.setSpecification("");
                    d.setUnit("件");
                    d.setQuantity(it.getNum() == null ? java.math.BigDecimal.ONE : it.getNum());
                    d.setUnitPrice(it.getUnitPrice());
                    d.setTaxRate(new java.math.BigDecimal("0.13"));
                    d.setProductCode(null);
                    d.setTaxClassificationCode("1070215020000000000");
                    d.setPreferentialPolicyFlag("0");
                    d.setOriginalDetailNo("");
                    retailMap.put(key, d);
                } else {
                    d.setQuantity(d.getQuantity().add(it.getNum() == null ? java.math.BigDecimal.ONE : it.getNum()));
                }
            }
            // 合并回结果：先移除原零售条目，再添加聚合后的
            java.util.Set<String> retailKeys = retailMap.keySet();
            java.util.List<InvoiceRequestDTO.InvoiceDetailDTO> others = new java.util.ArrayList<>();
            for (InvoiceRequestDTO.InvoiceDetailDTO d0 : merged) {
                String key0 = (d0.getProductCode() == null && d0.getUnitPrice() != null) ? ((d0.getItemName() == null ? d0.getGoodsName() : d0.getItemName()) + "|" + d0.getUnitPrice().toPlainString()) : null;
                if (key0 == null || !retailKeys.contains(key0)) {
                    others.add(d0);
                }
            }
            others.addAll(retailMap.values());
            merged = others;
        }

        if (!merged.isEmpty()) {
            request.setDetails(merged);
            request.setOilInfo(null);
            request.setRetailInfo(null);
        }
    }
    
    @Override
    public InvoiceResponseDTO getInvoiceDownloadUrl(String invoiceNo, Long merchantId) {
        log.info("获取发票下载地址，发票号码：{}，merchantId：{}", invoiceNo, merchantId);
        
        // 1. 获取商户配置（根据 merchant_id 查询生效中的未删除配置）
        StationInvoiceConfig stationConfig = stationInvoiceConfigMapper.selectActiveByStationId(merchantId);
        if (stationConfig == null) {
            throw new RuntimeException("油站未配置开票信息");
        }
        
        // 2. 查询开票记录
        InvoiceRecord record = invoiceRecordMapper.selectOne(
                new LambdaQueryWrapper<InvoiceRecord>().eq(InvoiceRecord::getInvoiceNo, invoiceNo)
        );
        if (record == null) {
            throw new RuntimeException("发票记录不存在");
        }
        
        // 3. 调用服务商接口
        InvoiceProvider provider = invoiceProviderFactory.getProvider(stationConfig.getProviderType());
        InvoiceProvider.StationInvoiceConfig config = buildProviderConfig(stationConfig);
        
        return provider.getInvoiceDownloadUrl(invoiceNo, record.getOrderCode(), config);
    }
    
    @Override
    public InvoiceResponseDTO queryInvoice(String invoiceNo, Long merchantId) {
        log.info("查询发票，发票号码：{}，merchantId：{}", invoiceNo, merchantId);
        
        // 1. 获取商户配置（根据 merchant_id 查询生效中的未删除配置）
        StationInvoiceConfig stationConfig = stationInvoiceConfigMapper.selectActiveByStationId(merchantId);
        if (stationConfig == null) {
            throw new RuntimeException("油站未配置开票信息");
        }
        
        // 2. 查询开票记录
        InvoiceRecord record = invoiceRecordMapper.selectOne(
                new LambdaQueryWrapper<InvoiceRecord>().eq(InvoiceRecord::getInvoiceNo, invoiceNo)
        );
        String requestSerialNo = record != null ? record.getOrderCode() : "";
        
        // 3. 调用服务商接口
        InvoiceProvider provider = invoiceProviderFactory.getProvider(stationConfig.getProviderType());
        InvoiceProvider.StationInvoiceConfig config = buildProviderConfig(stationConfig);
        
        InvoiceResponseDTO response = provider.queryInvoice(invoiceNo, requestSerialNo, config);
        
        // 4. 查询发票明细（如需要可填充到response中）
        if (response.getCode() == 0 && record != null) {
            @SuppressWarnings("unused")
            List<InvoiceDetail> details = invoiceDetailMapper.selectList(
                    new LambdaQueryWrapper<InvoiceDetail>().eq(InvoiceDetail::getInvoiceRecordId, record.getId())
            );
            // 可以将明细信息填充到response中
        }
        
        return response;
    }
    
    @Override
    public InvoiceResponseDTO getInvoiceDownloadUrlByOrderCode(String orderCode, Long merchantId) {
        log.info("根据订单编码获取发票下载地址，订单编码：{}，merchantId：{}", orderCode, merchantId);
        
        // 1. 根据订单编码查询开票记录
        InvoiceRecord record = invoiceRecordMapper.selectOne(
                new LambdaQueryWrapper<InvoiceRecord>()
                    .eq(InvoiceRecord::getOrderCode, orderCode)
                    .eq(InvoiceRecord::getMerchantId, merchantId)
                    .eq(InvoiceRecord::getDeleted, 0)
        );
        
        if (record == null) {
            throw new RuntimeException("订单对应的发票记录不存在");
        }
        
        if (!"02".equals(record.getInvoiceStatus())) {
            throw new RuntimeException("发票尚未开具成功");
        }
        
        if (record.getInvoiceNo() == null || record.getInvoiceNo().isEmpty()) {
            throw new RuntimeException("发票号码不存在");
        }
        
        // 2. 调用原有方法
        return getInvoiceDownloadUrl(record.getInvoiceNo(), merchantId);
    }
    
    @Override
    public InvoiceResponseDTO queryInvoiceByOrderCode(String orderCode, Long merchantId) {
        log.info("根据订单编码查询发票，订单编码：{}，merchantId：{}", orderCode, merchantId);
        
        // 1. 根据订单编码查询开票记录
        InvoiceRecord record = invoiceRecordMapper.selectOne(
                new LambdaQueryWrapper<InvoiceRecord>()
                    .eq(InvoiceRecord::getOrderCode, orderCode)
                    .eq(InvoiceRecord::getMerchantId, merchantId)
                    .eq(InvoiceRecord::getDeleted, 0)
        );
        
        if (record == null) {
            throw new RuntimeException("订单对应的发票记录不存在");
        }
        
        if (!"02".equals(record.getInvoiceStatus())) {
            // 如果还未开票成功，返回当前状态
            InvoiceResponseDTO response = new InvoiceResponseDTO();
            response.setCode(1);
            response.setMessage("发票尚未开具成功");
            response.setInvoiceStatus(record.getInvoiceStatus());
            response.setOrderCode(orderCode);
            return response;
        }
        
        if (record.getInvoiceNo() == null || record.getInvoiceNo().isEmpty()) {
            throw new RuntimeException("发票号码不存在");
        }
        
        // 2. 调用原有方法
        return queryInvoice(record.getInvoiceNo(), merchantId);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InvoiceResponseDTO applyRedConfirm(InvoiceRequestDTO request) {
        log.info("申请红字确认单，merchantId：{}，原发票号码：{}", request.getMerchantId(), request.getOriginalInvoiceNo());
        
        // 1. 获取商户配置（根据 merchant_id 查询生效中的未删除配置）
        StationInvoiceConfig stationConfig = stationInvoiceConfigMapper.selectActiveByStationId(request.getMerchantId());
        if (stationConfig == null) {
            throw new RuntimeException("油站未配置开票信息");
        }
        
        // 2. 调用服务商接口
        InvoiceProvider provider = invoiceProviderFactory.getProvider(stationConfig.getProviderType());
        InvoiceProvider.StationInvoiceConfig config = buildProviderConfig(stationConfig);
        
        return provider.applyRedConfirm(request, config);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public InvoiceResponseDTO issueRedInvoice(InvoiceRequestDTO request) {
        log.info("开具红字发票，merchantId：{}", request.getMerchantId());
        
        // 设置为红字发票
        request.setInvoiceFlag("1");
        
        // 复用蓝字发票流程
        return issueInvoice(request);
    }
    
    /**
     * 保存开票记录
     */
    private InvoiceRecord saveInvoiceRecord(InvoiceRequestDTO request, StationInvoiceConfig stationConfig) {
        // 设置订单号
        String orderCode;
        if (request.getOrderCodes() != null && !request.getOrderCodes().isEmpty()) {
            // 批量开票时，使用传入的单个订单号
            orderCode = request.getOrderCodes().get(0);
        } else {
            // 单个开票时，生成请求流水号
            orderCode = UUID.randomUUID().toString().replace("-", "");
        }
        
        // 先查询是否存在记录
        InvoiceRecord existingRecord = invoiceRecordMapper.selectOne(
            new LambdaQueryWrapper<InvoiceRecord>()
                .eq(InvoiceRecord::getOrderCode, orderCode)
                .eq(InvoiceRecord::getDeleted, 0)
        );
        
        InvoiceRecord record;
        boolean isUpdate = false;
        
        if (existingRecord != null) {
            // 如果记录存在，检查状态
            if ("02".equals(existingRecord.getInvoiceStatus())) {
                // 如果已经开票成功，不允许重复操作
                throw new RuntimeException("订单 " + orderCode + " 已开票成功，不能重复开票");
            }
            // 使用现有记录进行更新
            record = existingRecord;
            isUpdate = true;
            log.info("订单 {} 已存在，进行更新操作", orderCode);
        } else {
            // 创建新记录
            record = new InvoiceRecord();
            record.setOrderCode(orderCode);
            record.setCreatedTime(LocalDateTime.now());
        }
        
        // 基本信息
        record.setMerchantId(request.getMerchantId());
        record.setUserId(request.getUserId());
        record.setInvoiceType(request.getInvoiceType());
        record.setInvoiceStatus("01"); // 开票中
        record.setInvoiceFlag(request.getInvoiceFlag());
        
        // 设置平台编号
        if (request.getPlatformCode() != null) {
            record.setPlatformCode(request.getPlatformCode());
        }
        
        // 设置产品类型
        if (request.getProductType() != null) {
            record.setProductType(Integer.valueOf(request.getProductType()));
        }
        
        // 购买方信息
        record.setBuyerTaxId(request.getBuyerTaxNo());
        record.setBuyerName(request.getBuyerName());
        record.setBuyerAddress(request.getBuyerAddress());
        record.setBuyerPhone(request.getBuyerPhone());
        record.setEmail(request.getEmail());
        record.setBuyerBankName(request.getBuyerBankName());
        record.setBuyerBankAccount(request.getBuyerBankAccount());
        record.setBuyerAgentName(request.getBuyerAgent());
        record.setBuyerAgentIdNumber(request.getAgentIdNo());
        record.setBuyerAgentPhone(request.getAgentPhone());
        record.setBuyerType("N"); // 非自然人
        
        // 销售方信息
        record.setSellerAddress(stationConfig.getStationAddress());
        record.setSellerPhone(stationConfig.getStationPhone());
        record.setSellerBankName(stationConfig.getBankName());
        record.setSellerBankAccount(stationConfig.getBankAccount());
        
        // 计算金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        
        for (InvoiceRequestDTO.InvoiceDetailDTO detail : request.getDetails()) {
            BigDecimal amount = detail.getUnitPrice().multiply(detail.getQuantity());
            BigDecimal taxAmount = amount.multiply(detail.getTaxRate())
                    .divide(BigDecimal.ONE.add(detail.getTaxRate()), 2, RoundingMode.HALF_UP);
            BigDecimal amountWithoutTax = amount.subtract(taxAmount);
            
            totalAmount = totalAmount.add(amountWithoutTax);
            totalTax = totalTax.add(taxAmount);
        }
        
        record.setTotalAmount(totalAmount);
        record.setTotalTax(totalTax);
        record.setTotalAmountWithTax(totalAmount.add(totalTax));
        
        // 其他信息
        record.setDrawerName(request.getDrawer());
        record.setPayeeName(request.getPayee());
        record.setReviewerName(request.getReviewer());
        record.setRemark(request.getRemark());
        
        // 红字发票信息
        if ("1".equals(request.getInvoiceFlag())) {
            record.setCorrespondingBlueInvoiceNo(request.getOriginalInvoiceNo());
            record.setRedConfirmationInfoNo(request.getRedConfirmNo());
            record.setRedConfirmationUuid(request.getRedConfirmUuid());
        }
        
        record.setUpdatedTime(LocalDateTime.now());
        record.setDeleted(0);
        
        // 根据是否存在记录执行插入或更新
        if (isUpdate) {
            invoiceRecordMapper.updateById(record);
        } else {
            invoiceRecordMapper.insert(record);
        }
        
        return record;
    }
    
    /**
     * 保存发票明细
     */
    private void saveInvoiceDetails(Long invoiceRecordId, List<InvoiceRequestDTO.InvoiceDetailDTO> details) {
        // 先删除已存在的明细（用于更新场景）
        invoiceDetailMapper.delete(
            new LambdaQueryWrapper<InvoiceDetail>()
                .eq(InvoiceDetail::getInvoiceRecordId, invoiceRecordId)
        );
        
        int index = 1;
        
        for (InvoiceRequestDTO.InvoiceDetailDTO dto : details) {
            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoiceRecordId(invoiceRecordId);
            detail.setDetailNo(String.valueOf(index++));
            detail.setGoodsServiceName(dto.getProductShortName());
            detail.setItemName(dto.getItemName());
            detail.setGoodsOrServiceFullName(dto.getGoodsName());
            detail.setSpecification(dto.getSpecification());
            detail.setUnit(dto.getUnit());
            detail.setQuantity(dto.getQuantity());
            detail.setUnitPrice(dto.getUnitPrice());
            
            // 计算金额
            BigDecimal amount = dto.getUnitPrice().multiply(dto.getQuantity());
            BigDecimal taxAmount = amount.multiply(dto.getTaxRate())
                    .divide(BigDecimal.ONE.add(dto.getTaxRate()), 2, RoundingMode.HALF_UP);
            BigDecimal amountWithoutTax = amount.subtract(taxAmount);
            
            detail.setAmount(amountWithoutTax);
            detail.setTaxRate(dto.getTaxRate().multiply(new BigDecimal(100)).setScale(0, RoundingMode.HALF_UP).toString() + "%");
            detail.setTaxAmount(taxAmount);
            detail.setAmountWithTax(amount);
            detail.setGoodsServiceTaxCode(dto.getTaxClassificationCode());
            detail.setPreferentialPolicyFlag(dto.getPreferentialPolicyFlag());
            detail.setInvoiceLineNature("00"); // 正常行
            detail.setCreatedTime(LocalDateTime.now());
            detail.setUpdatedTime(LocalDateTime.now());
            detail.setDeleted(0);
            
            invoiceDetailMapper.insert(detail);
        }
    }
    
    /**
     * 构建服务商配置
     */
    private InvoiceProvider.StationInvoiceConfig buildProviderConfig(StationInvoiceConfig stationConfig) {
        InvoiceProvider.StationInvoiceConfig config = new InvoiceProvider.StationInvoiceConfig();
        config.setMerchantId(stationConfig.getMerchantId());
        config.setStationName(stationConfig.getStationName());
        config.setTaxpayerId(stationConfig.getTaxpayerId());
        config.setStationAddress(stationConfig.getStationAddress());
        config.setStationPhone(stationConfig.getStationPhone());
        config.setBankName(stationConfig.getBankName());
        config.setBankAccount(stationConfig.getBankAccount());
        config.setProviderType(stationConfig.getProviderType());
        // 提供商私有配置（如百旺乐企所需的密钥、账号等）
        if (stationConfig.getProviderSpecificConfig() != null) {
            Object url = stationConfig.getProviderSpecificConfig().get("url");
            Object privateKey = stationConfig.getProviderSpecificConfig().get("privateKey");
            Object publicKey = stationConfig.getProviderSpecificConfig().get("publicKey");
            Object userName = stationConfig.getProviderSpecificConfig().get("userName");
            Object account = stationConfig.getProviderSpecificConfig().get("account");

            config.setApiUrl(url == null ? null : String.valueOf(url));
            config.setPrivateKey(privateKey == null ? null : String.valueOf(privateKey));
            config.setPublicKey(publicKey == null ? null : String.valueOf(publicKey));
            config.setUsername(userName == null ? null : String.valueOf(userName));
            config.setAccount(account == null ? null : String.valueOf(account));
        }
        
        return config;
    }
    
    /**
     * 根据productCode查询税率配置，补充税率和商品信息
     */
    private void enrichInvoiceDetailsWithTaxConfig(InvoiceRequestDTO request, Long stationId) {
        if (request.getDetails() == null || request.getDetails().isEmpty()) {
            return;
        }
        
        log.info("开始补充发票明细的税率配置信息，油站ID：{}", stationId);
        
        for (InvoiceRequestDTO.InvoiceDetailDTO detail : request.getDetails()) {
            String productCode = detail.getProductCode();
            
            // 只有当productCode不为空时才查询税率配置
            if (productCode != null && !productCode.trim().isEmpty()) {
                try {
                    // 尝试不同的产品代码格式查询
                    TaxRateConfig taxConfig = taxRateConfigMapper.selectLatestActiveByStationAndProduct(stationId, productCode);
                    
                    // 如果没找到，尝试添加#号后缀
                    if (taxConfig == null && productCode.matches("\\d+")) {
                        taxConfig = taxRateConfigMapper.selectLatestActiveByStationAndProduct(stationId, productCode + "#");
                    }
                    
                    if (taxConfig != null) {
                        log.info("找到产品编码 {} 的税率配置：税率={}, 商品名称={}, 税收分类编码={}", 
                                productCode, taxConfig.getTaxRate(), taxConfig.getProductName(), taxConfig.getSpbm());
                        
                        // 更新税率（如果明细中未设置或为0）
                        if (detail.getTaxRate() == null || detail.getTaxRate().compareTo(BigDecimal.ZERO) == 0) {
                            detail.setTaxRate(taxConfig.getTaxRate());
                        }
                        
                        // 更新商品名称信息（如果明细中未设置）
                        if (detail.getProductShortName() == null || detail.getProductShortName().trim().isEmpty()) {
                            detail.setProductShortName(taxConfig.getProductName());
                        }
                        
                        if (detail.getItemName() == null || detail.getItemName().trim().isEmpty()) {
                            detail.setItemName(taxConfig.getProductName());
                        }
                        
                        // 构建标准商品名称格式（如果未设置）
                        if (detail.getGoodsName() == null || detail.getGoodsName().trim().isEmpty()) {
                            detail.setGoodsName("*" + taxConfig.getProductName() + "*" + taxConfig.getProductName());
                        }
                        
                        // 更新税收分类编码（如果明细中未设置）
                        if (detail.getTaxClassificationCode() == null || detail.getTaxClassificationCode().trim().isEmpty()) {
                            detail.setTaxClassificationCode(taxConfig.getSpbm());
                        }
                        
                        // 设置默认单位（如果未设置）
                        if (detail.getUnit() == null || detail.getUnit().trim().isEmpty()) {
                            // 根据产品类型设置默认单位
                            if ("1".equals(request.getProductType())) {
                                detail.setUnit("升"); // 油品默认单位
                            } else {
                                detail.setUnit("件"); // 非油品默认单位
                            }
                        }
                    } else {
                        log.warn("未找到产品编码 {} 在油站 {} 的税率配置", productCode, stationId);
                    }
                } catch (Exception e) {
                    log.error("查询产品编码 {} 的税率配置失败", productCode, e);
                }
            }
            
            // 设置默认优惠政策标志（如果未设置）
            if (detail.getPreferentialPolicyFlag() == null) {
                detail.setPreferentialPolicyFlag("0"); // 默认不享受优惠政策
            }
            
            // 设置默认原蓝字发票明细序号（如果未设置）
            if (detail.getOriginalDetailNo() == null) {
                detail.setOriginalDetailNo("");
            }
        }
    }
    
    /**
     * 检查重复开票
     */
    private void checkDuplicateInvoice(InvoiceRequestDTO request) {
        // 如果是批量开票，检查所有订单号
        if (request.getIsBatch() != null && request.getIsBatch() == 1 && request.getOrderCodes() != null) {
            for (String orderCode : request.getOrderCodes()) {
                checkSingleOrderDuplicate(orderCode);
            }
        }
    }
    
    /**
     * 检查单个订单是否重复开票
     */
    private void checkSingleOrderDuplicate(String orderCode) {
        InvoiceRecord existingRecord = invoiceRecordMapper.selectOne(
            new LambdaQueryWrapper<InvoiceRecord>()
                .eq(InvoiceRecord::getOrderCode, orderCode)
                .eq(InvoiceRecord::getDeleted, 0)
                .eq(InvoiceRecord::getInvoiceStatus, "02") // 只检查已开票成功的
        );
        
        if (existingRecord != null) {
            throw new RuntimeException("订单 " + orderCode + " 已开票成功，请勿重复开票");
        }
    }
    
    /**
     * 处理批量开票逻辑
     */
    private void handleBatchInvoiceLogic(InvoiceRequestDTO request, InvoiceRecord record, String masterOrderCode) {
        // 设置批量开票标志
        record.setIsBatch(request.getIsBatch() != null ? request.getIsBatch() : 0);
        
        if (request.getIsBatch() != null && request.getIsBatch() == 1) {
            // 批量开票
            if (masterOrderCode == null || masterOrderCode.isEmpty()) {
                // 如果没有指定主订单号，使用当前订单号作为主订单号
                masterOrderCode = record.getOrderCode();
            }
            
            record.setBatchRelateOrderCode(masterOrderCode);
            
        } else {
            // 非批量开票，检查是否需要清理之前的批量关系
            cleanupBatchRelationships(record.getOrderCode());
            
            record.setBatchRelateOrderCode(record.getOrderCode());
        }
        
    }
    
    /**
     * 更新相关订单的批量开票信息
     */
    private void updateRelatedOrdersBatchInfo(List<String> orderCodes, String masterOrderCode) {
        for (String orderCode : orderCodes) {
            // 查询已存在的记录
            List<InvoiceRecord> existingRecords = invoiceRecordMapper.selectList(
                new LambdaQueryWrapper<InvoiceRecord>()
                    .eq(InvoiceRecord::getOrderCode, orderCode)
                    .eq(InvoiceRecord::getDeleted, 0)
                    .in(InvoiceRecord::getInvoiceStatus, "00", "03") // 待开票或开票失败
            );
            
            for (InvoiceRecord record : existingRecords) {
                // 更新批量开票信息
                record.setBatchRelateOrderCode(masterOrderCode);
                record.setIsBatch(1);
                record.setUpdatedTime(LocalDateTime.now());
                invoiceRecordMapper.updateById(record);
            }
        }
    }
    
    /**
     * 清理批量开票关系
     */
    private void cleanupBatchRelationships(String orderCode) {
        // 查询该订单之前的批量关系
        InvoiceRecord currentRecord = invoiceRecordMapper.selectOne(
            new LambdaQueryWrapper<InvoiceRecord>()
                .eq(InvoiceRecord::getOrderCode, orderCode)
                .eq(InvoiceRecord::getDeleted, 0)
                .orderByDesc(InvoiceRecord::getId)
                .last("LIMIT 1")
        );
        
        if (currentRecord != null && currentRecord.getBatchRelateOrderCode() != null) {
            String oldBatchMasterCode = currentRecord.getBatchRelateOrderCode();
            
            // 如果当前订单是批量主订单，需要清理所有子订单的关系
            if (orderCode.equals(oldBatchMasterCode)) {
                List<InvoiceRecord> relatedRecords = invoiceRecordMapper.selectList(
                    new LambdaQueryWrapper<InvoiceRecord>()
                        .eq(InvoiceRecord::getBatchRelateOrderCode, oldBatchMasterCode)
                        .eq(InvoiceRecord::getDeleted, 0)
                );
                
                for (InvoiceRecord record : relatedRecords) {
                    record.setBatchRelateOrderCode(record.getOrderCode());
                    record.setIsBatch(0);
                    record.setUpdatedTime(LocalDateTime.now());
                    invoiceRecordMapper.updateById(record);
                }
            } else {
                // 只清理当前订单的批量关系
                currentRecord.setBatchRelateOrderCode(currentRecord.getOrderCode());
                currentRecord.setIsBatch(0);
                currentRecord.setUpdatedTime(LocalDateTime.now());
                invoiceRecordMapper.updateById(currentRecord);
            }
        }
    }
    
    
    
    /**
     * 解除旧的子订单关联关系
     */
    private void unbindOldSubOrders(String masterOrderCode) {
        // 查找所有关联到此主订单的子订单（未开票成功的）
        List<InvoiceRecord> oldSubOrders = invoiceRecordMapper.selectList(
            new LambdaQueryWrapper<InvoiceRecord>()
                .eq(InvoiceRecord::getBatchRelateOrderCode, masterOrderCode)
                .ne(InvoiceRecord::getOrderCode, masterOrderCode)
                .in(InvoiceRecord::getInvoiceStatus, "00", "03") // 待开票、开票失败
                .eq(InvoiceRecord::getDeleted, 0)
        );
        
        // 解除关联关系
        for (InvoiceRecord record : oldSubOrders) {
            record.setBatchRelateOrderCode("");
            record.setIsBatch(0);
            record.setUpdatedTime(LocalDateTime.now());
            invoiceRecordMapper.updateById(record);
            log.info("解除子订单 {} 与主订单 {} 的关联关系", record.getOrderCode(), masterOrderCode);
        }
    }
    
    /**
     * 保存批量开票中各订单的发票记录
     */
    private void saveBatchOrderInvoiceRecord(InvoiceRequestDTO request, String orderCode, String masterOrderCode) {
        // 检查是否已存在记录
        InvoiceRecord existingRecord = invoiceRecordMapper.selectOne(
            new LambdaQueryWrapper<InvoiceRecord>()
                .eq(InvoiceRecord::getOrderCode, orderCode)
                .eq(InvoiceRecord::getDeleted, 0)
        );
        
        if (existingRecord != null && "02".equals(existingRecord.getInvoiceStatus())) {
            // 如果已经开票成功，抛出异常
            throw new RuntimeException("订单 " + orderCode + " 已开票成功，不能重复开票");
        }
        
        // 创建或更新子订单的发票记录
        InvoiceRecord record;
        if (existingRecord != null) {
            // 使用现有记录
            record = existingRecord;
            record.setInvoiceStatus("01"); // 重置为开票中
            record.setErrorMsg(null); // 清空错误信息
            log.info("更新订单 {} 的发票记录", orderCode);
        } else {
            // 创建新记录
            record = new InvoiceRecord();
            record.setOrderCode(orderCode);
            record.setCreatedTime(LocalDateTime.now());
            log.info("创建订单 {} 的发票记录", orderCode);
        }
        
        // 更新基本信息
        record.setMerchantId(request.getMerchantId());
        record.setUserId(request.getUserId());
        record.setInvoiceType(request.getInvoiceType());
        record.setInvoiceFlag(request.getInvoiceFlag());
        record.setIsBatch(1); // 批量开票标志
        record.setBatchRelateOrderCode(masterOrderCode); // 关联主订单
        
        // 设置购买方信息
        record.setBuyerTaxId(request.getBuyerTaxNo());
        record.setBuyerName(request.getBuyerName());
        record.setBuyerAddress(request.getBuyerAddress());
        record.setBuyerPhone(request.getBuyerPhone());
        record.setEmail(request.getEmail());
        record.setBuyerBankName(request.getBuyerBankName());
        record.setBuyerBankAccount(request.getBuyerBankAccount());
        record.setBuyerType("N"); // 非自然人
        
        // 设置其他信息
        record.setPlatformCode(request.getPlatformCode());
        record.setProductType(request.getProductType() != null ? Integer.valueOf(request.getProductType()) : 0);
        // 设置备注，区分主订单和子订单
        if (orderCode.equals(masterOrderCode)) {
            record.setRemark("批量开票主订单");
        } else {
            record.setRemark("批量开票子订单，主订单号：" + masterOrderCode);
        }
        
        // 计算该订单的金额（从oilInfo中查找）
        BigDecimal orderAmount = BigDecimal.ZERO;
        if (request.getOilInfo() != null) {
            for (InvoiceRequestDTO.OilInfo oilInfo : request.getOilInfo()) {
                if (orderCode.equals(oilInfo.getOrderCode()) && oilInfo.getItem() != null) {
                    BigDecimal price = oilInfo.getItem().getPrice();
                    if (price != null) {
                        orderAmount = orderAmount.add(price);
                    }
                }
            }
        }
        
        // 按照百旺的计算逻辑
        // 这里的 orderAmount 是含税金额（来自 oilInfo.item.price）
        BigDecimal taxRate = new BigDecimal("0.13");
        
        // 从含税金额反推不含税金额
        // je = hsje / (1 + slv)
        BigDecimal je = orderAmount.divide(BigDecimal.ONE.add(taxRate), 2, RoundingMode.HALF_UP);
        
        // se = hsje - je
        BigDecimal se = orderAmount.subtract(je);
        
        record.setTotalAmount(je);         // 不含税金额
        record.setTotalTax(se);           // 税额
        record.setTotalAmountWithTax(orderAmount);  // 含税金额
        record.setUpdatedTime(LocalDateTime.now());
        record.setDeleted(0);
        
        if (existingRecord != null) {
            // 更新现有记录
            invoiceRecordMapper.updateById(record);
        } else {
            // 插入新记录
            invoiceRecordMapper.insert(record);
        }
    }
    
    /**
     * 更新批量开票中所有订单的发票信息
     */
    private void updateBatchOrdersInvoiceInfo(List<String> orderCodes, String invoiceNo, String masterOrderCode) {
        for (String orderCode : orderCodes) {
            // 更新所有订单的发票信息（包括主订单）
            InvoiceRecord record = invoiceRecordMapper.selectOne(
                new LambdaQueryWrapper<InvoiceRecord>()
                    .eq(InvoiceRecord::getOrderCode, orderCode)
                    .eq(InvoiceRecord::getBatchRelateOrderCode, masterOrderCode)
                    .eq(InvoiceRecord::getDeleted, 0)
                    .orderByDesc(InvoiceRecord::getId)
                    .last("LIMIT 1")
            );
            
            if (record != null) {
                record.setInvoiceNo(invoiceNo);
                record.setInvoiceDate(LocalDate.now());
                record.setInvoiceStatus("02"); // 开票成功
                record.setUpdatedTime(LocalDateTime.now());
                invoiceRecordMapper.updateById(record);
            }
        }
    }
    
}