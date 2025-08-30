package com.microservice.invoice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.microservice.invoice.entity.TaxRateConfig;
import com.microservice.invoice.mapper.TaxRateConfigMapper;
import com.microservice.invoice.service.TaxRateConfigService;
import com.microservice.invoice.vo.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 税率配置 Service 实现类
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@Service
public class TaxRateConfigServiceImpl extends ServiceImpl<TaxRateConfigMapper, TaxRateConfig> implements TaxRateConfigService {

    @Override
    public PageVO<TaxRateConfigListVO> list(Integer page, Integer pageSize, Long merchantId, String productCode, String spbm) {
        log.info("分页查询税率配置列表，页码: {}, 每页数量: {}, 商户ID: {}, 商品编码: {}, 税收商品编码: {}", 
                page, pageSize, merchantId, productCode, spbm);
        
        // 构建查询VO
        TaxRateConfigQueryVO queryVO = new TaxRateConfigQueryVO();
        queryVO.setMerchantId(merchantId);
        queryVO.setProductCode(productCode);
        queryVO.setSpbm(spbm);
        queryVO.setSortBy("id");
        queryVO.setSortOrder("desc"); // 默认按ID倒序排序
        
        Page<TaxRateConfigListVO> pageObj = new Page<>(page, pageSize);
        IPage<TaxRateConfigListVO> result = baseMapper.selectTaxRateConfigPage(pageObj, queryVO);
        
        // 构建分页VO
        PageVO<TaxRateConfigListVO> pageVO = PageVO.of(
            page,
            pageSize,
            result.getTotal(),
            result.getRecords()
        );
        
        log.info("分页查询税率配置列表完成，总记录数: {}", result.getTotal());
        return pageVO;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(TaxRateConfigCreateVO createVO) {
        log.info("创建税率配置，参数: {}", createVO);
        
        // 检查同一商户下同一油品代码是否已存在
        LambdaQueryWrapper<TaxRateConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaxRateConfig::getMerchantId, createVO.getMerchantId())
               .eq(TaxRateConfig::getProductCode, createVO.getProductCode())
               .eq(TaxRateConfig::getDeleted, 0);
        
        TaxRateConfig existing = this.getOne(wrapper);
        if (existing != null) {
            log.warn("同一商户下已存在相同油品代码的税率配置，商户ID: {}, 油品代码: {}", 
                    createVO.getMerchantId(), createVO.getProductCode());
            throw new RuntimeException("同一商户下已存在相同油品代码的税率配置");
        }
        
        TaxRateConfig taxRateConfig = new TaxRateConfig();
        BeanUtils.copyProperties(createVO, taxRateConfig);
        
        // 创建时间和更新时间会通过MyBatis-Plus自动填充
        this.save(taxRateConfig);
        
        log.info("创建税率配置成功，ID: {}", taxRateConfig.getId());
        return taxRateConfig.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, TaxRateConfigUpdateVO updateVO) {
        log.info("更新税率配置，ID: {}, 参数: {}", id, updateVO);
        
        // 检查记录是否存在且未删除
        LambdaQueryWrapper<TaxRateConfig> existWrapper = new LambdaQueryWrapper<>();
        existWrapper.eq(TaxRateConfig::getId, id)
                   .eq(TaxRateConfig::getDeleted, 0);
        
        TaxRateConfig existing = this.getOne(existWrapper);
        if (existing == null) {
            log.warn("税率配置不存在或已删除，ID: {}", id);
            throw new RuntimeException("税率配置不存在或已删除");
        }
        
        // 检查同一商户下同一油品代码是否已存在（排除当前记录）
        LambdaQueryWrapper<TaxRateConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaxRateConfig::getMerchantId, updateVO.getMerchantId())
               .eq(TaxRateConfig::getProductCode, updateVO.getProductCode())
               .eq(TaxRateConfig::getDeleted, 0)
               .ne(TaxRateConfig::getId, id);
        
        TaxRateConfig sameProduct = this.getOne(wrapper);
        if (sameProduct != null) {
            log.warn("同一商户下已存在相同油品代码的税率配置，商户ID: {}, 油品代码: {}", 
                    updateVO.getMerchantId(), updateVO.getProductCode());
            throw new RuntimeException("同一商户下已存在相同油品代码的税率配置");
        }
        
        TaxRateConfig taxRateConfig = new TaxRateConfig();
        BeanUtils.copyProperties(updateVO, taxRateConfig);
        taxRateConfig.setId(id);
        
        // 更新时间会通过MyBatis-Plus自动填充
        this.updateById(taxRateConfig);
        
        log.info("更新税率配置成功，ID: {}", id);
    }

    @Override
    public TaxRateConfigListVO detail(Long id) {
        log.info("获取税率配置详情，ID: {}", id);
        
        LambdaQueryWrapper<TaxRateConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TaxRateConfig::getId, id)
               .eq(TaxRateConfig::getDeleted, 0);
        
        TaxRateConfig taxRateConfig = this.getOne(wrapper);
        if (taxRateConfig == null) {
            log.warn("税率配置不存在，ID: {}", id);
            return null;
        }
        
        TaxRateConfigListVO vo = new TaxRateConfigListVO();
        BeanUtils.copyProperties(taxRateConfig, vo);
        
        log.info("获取税率配置详情成功，ID: {}", id);
        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        log.info("删除税率配置，ID: {}", id);
        
        // 检查记录是否存在且未删除
        LambdaQueryWrapper<TaxRateConfig> existWrapper = new LambdaQueryWrapper<>();
        existWrapper.eq(TaxRateConfig::getId, id)
                   .eq(TaxRateConfig::getDeleted, 0);
        
        TaxRateConfig existing = this.getOne(existWrapper);
        if (existing == null) {
            log.warn("税率配置不存在或已删除，ID: {}", id);
            throw new RuntimeException("税率配置不存在或已删除");
        }
        
        // 软删除：设置删除标志和删除时间
        LambdaUpdateWrapper<TaxRateConfig> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(TaxRateConfig::getId, id)
                    .eq(TaxRateConfig::getDeleted, 0) // 确保只删除未删除的记录
                    .set(TaxRateConfig::getDeleted, 1)
                    .set(TaxRateConfig::getDeletedTime, LocalDateTime.now());
        
        this.update(updateWrapper);
        
        log.info("删除税率配置成功，ID: {}", id);
    }
}