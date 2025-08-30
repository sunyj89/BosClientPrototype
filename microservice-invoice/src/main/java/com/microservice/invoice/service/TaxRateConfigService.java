package com.microservice.invoice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.microservice.invoice.entity.TaxRateConfig;
import com.microservice.invoice.vo.*;

/**
 * 税率配置 Service 接口
 *
 * @author system
 * @since 2024-01-01
 */
public interface TaxRateConfigService extends IService<TaxRateConfig> {

    /**
     * 分页查询税率配置列表
     *
     * @param page        当前页码
     * @param pageSize    每页数量
     * @param merchantId   商户ID
     * @param productCode 商品编码
     * @param spbm        税收商品编码
     * @return 分页结果
     */
    PageVO<TaxRateConfigListVO> list(Integer page, Integer pageSize, Long merchantId, String productCode, String spbm);

    /**
     * 创建税率配置
     *
     * @param createVO 创建VO
     * @return 新创建的ID
     */
    Long create(TaxRateConfigCreateVO createVO);

    /**
     * 更新税率配置
     *
     * @param id       主键ID
     * @param updateVO 更新VO
     */
    void update(Long id, TaxRateConfigUpdateVO updateVO);

    /**
     * 根据ID查询税率配置详情
     *
     * @param id 主键ID
     * @return 税率配置详情
     */
    TaxRateConfigListVO detail(Long id);

    /**
     * 删除税率配置
     *
     * @param id 主键ID
     */
    void delete(Long id);
}