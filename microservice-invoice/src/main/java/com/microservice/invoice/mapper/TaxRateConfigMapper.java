package com.microservice.invoice.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.microservice.invoice.entity.TaxRateConfig;
import com.microservice.invoice.vo.TaxRateConfigListVO;
import com.microservice.invoice.vo.TaxRateConfigQueryVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 税率管理 Mapper 接口
 *
 * @author system
 * @since 2024-01-01
 */
@Mapper
public interface TaxRateConfigMapper extends BaseMapper<TaxRateConfig> {

    /**
     * 分页查询税率配置列表
     *
     * @param page  分页对象
     * @param query 查询条件
     * @return 税率配置列表
     */
    IPage<TaxRateConfigListVO> selectTaxRateConfigPage(Page<TaxRateConfigListVO> page, @Param("query") TaxRateConfigQueryVO query);

    /**
     * 根据商户ID和油品代码查询税率配置
     *
     * @param merchantId   商户ID
     * @param productCode 油品代码
     * @return 税率配置
     */
    TaxRateConfig getTaxRateConfigByStationAndProduct(@Param("merchantId") Long merchantId, @Param("productCode") String productCode);

    /**
     * 根据商户ID查询所有税率配置
     *
     * @param merchantId 商户ID
     * @return 税率配置列表
     */
    List<TaxRateConfig> getTaxRateConfigsByStationId(@Param("merchantId") Long merchantId);

    /**
     * 查询未删除的最新一条税率配置（按更新时间倒序）
     */
    default TaxRateConfig selectLatestActiveByStationAndProduct(Long merchantId, String productCode) {
        return this.selectOne(new LambdaQueryWrapper<TaxRateConfig>()
                .eq(TaxRateConfig::getMerchantId, merchantId)
                .eq(TaxRateConfig::getProductCode, productCode)
                .eq(TaxRateConfig::getDeleted, 0)
                .orderByDesc(TaxRateConfig::getUpdatedTime)
                .last("limit 1"));
    }
}