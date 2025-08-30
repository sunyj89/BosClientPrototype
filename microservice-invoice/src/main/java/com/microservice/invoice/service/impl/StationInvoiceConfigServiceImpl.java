package com.microservice.invoice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.microservice.common.exception.BusinessException;
import com.microservice.invoice.dto.StationInvoiceConfigCreateDTO;
import com.microservice.invoice.dto.StationInvoiceConfigQueryDTO;
import com.microservice.invoice.dto.StationInvoiceConfigUpdateDTO;
import com.microservice.invoice.entity.StationInvoiceConfig;
import com.microservice.invoice.enums.InvoiceAmountBasisEnum;
import com.microservice.invoice.enums.InvoiceConfigStatusEnum;
import com.microservice.invoice.enums.InvoiceProviderTypeEnum;
import com.microservice.invoice.mapper.StationInvoiceConfigMapper;
import com.microservice.invoice.service.StationInvoiceConfigService;
import com.microservice.invoice.vo.PageVO;
import com.microservice.invoice.vo.StationInvoiceConfigVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 油站发票配置 Service 实现类
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StationInvoiceConfigServiceImpl implements StationInvoiceConfigService {

    private final StationInvoiceConfigMapper stationInvoiceConfigMapper;

    @Override
    public PageVO<StationInvoiceConfigVO> getConfigList(Long merchantId, StationInvoiceConfigQueryDTO queryDTO) {
        LocalDateTime currentTime = LocalDateTime.now();
        
        // 使用自定义查询方法获取数据
        List<StationInvoiceConfig> configs = stationInvoiceConfigMapper.getConfigsByStatus(
            merchantId, queryDTO.getStatus(), currentTime);
        
        // 手动分页
        int page = queryDTO.getPage();
        int limit = queryDTO.getLimit();
        int start = (page - 1) * limit;
        int end = Math.min(start + limit, configs.size());
        
        List<StationInvoiceConfig> pageData = configs.subList(start, end);
        List<StationInvoiceConfigVO> voList = pageData.stream()
            .map(config -> convertToVO(config, currentTime))
            .collect(Collectors.toList());
        
        return PageVO.of(page, limit, (long) configs.size(), voList);
    }

    @Override
    public StationInvoiceConfigVO getConfigDetail(Long merchantId, Long id) {
        StationInvoiceConfig config = stationInvoiceConfigMapper.selectOne(
            new LambdaQueryWrapper<StationInvoiceConfig>()
                .eq(StationInvoiceConfig::getId, id)
                .eq(StationInvoiceConfig::getMerchantId, merchantId)
                .eq(StationInvoiceConfig::getDeleted, false)
        );
        
        if (config == null) {
            throw new BusinessException("发票配置不存在");
        }
        
        return convertToVO(config, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StationInvoiceConfigVO createConfig(Long merchantId, StationInvoiceConfigCreateDTO createDTO) {
        // 验证开始时间
        if (createDTO.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BusinessException("生效开始时间不能早于当前时间");
        }
        
        // 验证结束时间
        if (createDTO.getEndTime() != null && !createDTO.getEndTime().isAfter(createDTO.getStartTime())) {
            throw new BusinessException("生效结束时间必须晚于开始时间");
        }
        
        // 检查时间冲突
        LocalDateTime endTime = createDTO.getEndTime() != null ? createDTO.getEndTime() : LocalDateTime.MAX;
        int conflicts = stationInvoiceConfigMapper.countTimeConflicts(
            merchantId, createDTO.getStartTime(), endTime, null);
        
        if (conflicts > 0) {
            throw new BusinessException("配置时间范围与已有配置存在冲突");
        }
        
        // 创建配置
        StationInvoiceConfig config = new StationInvoiceConfig();
        BeanUtils.copyProperties(createDTO, config);
        config.setMerchantId(merchantId);
        config.setDeleted(false);
        config.setCreatedTime(LocalDateTime.now());
        config.setUpdatedTime(LocalDateTime.now());
        
        stationInvoiceConfigMapper.insert(config);
        
        return convertToVO(config, LocalDateTime.now());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StationInvoiceConfigVO updateConfig(Long merchantId, Long id, StationInvoiceConfigUpdateDTO updateDTO) {
        StationInvoiceConfig config = stationInvoiceConfigMapper.selectOne(
            new LambdaQueryWrapper<StationInvoiceConfig>()
                .eq(StationInvoiceConfig::getId, id)
                .eq(StationInvoiceConfig::getMerchantId, merchantId)
                .eq(StationInvoiceConfig::getDeleted, false)
        );
        
        if (config == null) {
            throw new BusinessException("发票配置不存在");
        }
        
        LocalDateTime currentTime = LocalDateTime.now();
        String status = getConfigStatus(config, currentTime);
        
        // 检查是否可以修改开始时间
        if (updateDTO.getStartTime() != null && !updateDTO.getStartTime().equals(config.getStartTime())) {
            if (!"pending".equals(status)) {
                throw new BusinessException("只有未生效的配置才能修改开始时间");
            }
            if (updateDTO.getStartTime().isBefore(currentTime)) {
                throw new BusinessException("生效开始时间不能早于当前时间");
            }
        }
        
        // 使用更新后的时间或原时间
        LocalDateTime startTime = updateDTO.getStartTime() != null ? updateDTO.getStartTime() : config.getStartTime();
        LocalDateTime endTime = updateDTO.getEndTime() != null ? updateDTO.getEndTime() : config.getEndTime();
        
        // 验证结束时间
        if (endTime != null && !endTime.isAfter(startTime)) {
            throw new BusinessException("生效结束时间必须晚于开始时间");
        }
        
        // 检查时间冲突
        LocalDateTime checkEndTime = endTime != null ? endTime : LocalDateTime.MAX;
        int conflicts = stationInvoiceConfigMapper.countTimeConflicts(
            merchantId, startTime, checkEndTime, id);
        
        if (conflicts > 0) {
            throw new BusinessException("配置时间范围与已有配置存在冲突");
        }
        
        // 更新配置
        BeanUtils.copyProperties(updateDTO, config, "id", "merchantId", "createdTime", "createdBy");
        config.setUpdatedTime(LocalDateTime.now());
        
        stationInvoiceConfigMapper.updateById(config);
        
        return convertToVO(config, currentTime);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteConfig(Long merchantId, Long id) {
        StationInvoiceConfig config = stationInvoiceConfigMapper.selectOne(
            new LambdaQueryWrapper<StationInvoiceConfig>()
                .eq(StationInvoiceConfig::getId, id)
                .eq(StationInvoiceConfig::getMerchantId, merchantId)
                .eq(StationInvoiceConfig::getDeleted, false)
        );
        
        if (config == null) {
            throw new BusinessException("发票配置不存在");
        }
        
        LocalDateTime currentTime = LocalDateTime.now();
        String status = getConfigStatus(config, currentTime);
        
        if ("active".equals(status)) {
            throw new BusinessException("生效中的配置不能删除，请先设置失效时间");
        }
        
        // 软删除
        config.setDeleted(true);
        config.setDeletedTime(currentTime);
        config.setUpdatedTime(currentTime);
        
        stationInvoiceConfigMapper.updateById(config);
    }

    @Override
    public StationInvoiceConfigVO getActiveConfig(Long merchantId) {
        LocalDateTime currentTime = LocalDateTime.now();
        StationInvoiceConfig config = stationInvoiceConfigMapper.getActiveConfig(merchantId, currentTime);
        
        if (config == null) {
            return null;
        }
        
        return convertToVO(config, currentTime);
    }

    /**
     * 转换实体为VO
     */
    private StationInvoiceConfigVO convertToVO(StationInvoiceConfig config, LocalDateTime currentTime) {
        StationInvoiceConfigVO vo = new StationInvoiceConfigVO();
        BeanUtils.copyProperties(config, vo);
        
        // 计算天数
        if (config.getInvoiceValidityPeriodInHours() != null) {
            vo.setInvoiceValidityPeriodInDays(config.getInvoiceValidityPeriodInHours() / 24);
        }
        
        // 设置状态
        String status = getConfigStatus(config, currentTime);
        vo.setStatus(status);
        vo.setStatusName(InvoiceConfigStatusEnum.getByCode(status).getDesc());
        
        // 设置枚举名称
        vo.setProviderTypeName(InvoiceProviderTypeEnum.getByCode(config.getProviderType()).getDesc());
        vo.setInvoiceAmountBasisName(InvoiceAmountBasisEnum.getByCode(config.getInvoiceAmountBasis()).getDesc());
        
        return vo;
    }

    /**
     * 获取配置状态
     */
    private String getConfigStatus(StationInvoiceConfig config, LocalDateTime currentTime) {
        if (currentTime.isBefore(config.getStartTime())) {
            return "pending";
        } else if (config.getEndTime() == null || currentTime.isBefore(config.getEndTime())) {
            return "active";
        } else {
            return "expired";
        }
    }
}