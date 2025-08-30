package com.microservice.invoice.service;

import com.microservice.invoice.dto.StationInvoiceConfigCreateDTO;
import com.microservice.invoice.dto.StationInvoiceConfigQueryDTO;
import com.microservice.invoice.dto.StationInvoiceConfigUpdateDTO;
import com.microservice.invoice.vo.PageVO;
import com.microservice.invoice.vo.StationInvoiceConfigVO;

/**
 * 油站发票配置 Service 接口
 *
 * @author yangyang
 * @date 2025-01-15
 */
public interface StationInvoiceConfigService {

    /**
     * 分页获取油站发票配置列表
     *
     * @param merchantId 商户ID
     * @param queryDTO 查询条件
     * @return 配置列表
     */
    PageVO<StationInvoiceConfigVO> getConfigList(Long merchantId, StationInvoiceConfigQueryDTO queryDTO);

    /**
     * 获取发票配置详情
     *
     * @param merchantId 商户ID
     * @param id 配置ID
     * @return 配置详情
     */
    StationInvoiceConfigVO getConfigDetail(Long merchantId, Long id);

    /**
     * 创建发票配置
     *
     * @param merchantId 商户ID
     * @param createDTO 创建DTO
     * @return 创建结果
     */
    StationInvoiceConfigVO createConfig(Long merchantId, StationInvoiceConfigCreateDTO createDTO);

    /**
     * 更新发票配置
     *
     * @param merchantId 商户ID
     * @param id 配置ID
     * @param updateDTO 更新DTO
     * @return 更新结果
     */
    StationInvoiceConfigVO updateConfig(Long merchantId, Long id, StationInvoiceConfigUpdateDTO updateDTO);

    /**
     * 删除发票配置
     *
     * @param merchantId 商户ID
     * @param id 配置ID
     */
    void deleteConfig(Long merchantId, Long id);

    /**
     * 获取当前生效的配置
     *
     * @param merchantId 商户ID
     * @return 生效的配置
     */
    StationInvoiceConfigVO getActiveConfig(Long merchantId);
}