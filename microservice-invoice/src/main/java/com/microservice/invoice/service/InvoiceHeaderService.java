package com.microservice.invoice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.microservice.invoice.entity.InvoiceHeader;
import com.microservice.invoice.vo.InvoiceHeaderCreateVO;
import com.microservice.invoice.vo.InvoiceHeaderListVO;
import com.microservice.invoice.vo.InvoiceHeaderUpdateVO;

import java.util.List;

/**
 * 发票抬头服务接口
 *
 * @author system
 * @since 2024-01-01
 */
public interface InvoiceHeaderService extends IService<InvoiceHeader> {

    /**
     * 根据用户ID获取发票抬头列表
     *
     * @param userId 用户ID
     * @return 发票抬头列表
     */
    List<InvoiceHeaderListVO> getInvoiceHeadersByUserId(Long userId);

    /**
     * 创建发票抬头
     *
     * @param createVO 创建VO
     * @return 发票抬头ID
     */
    Long createInvoiceHeader(InvoiceHeaderCreateVO createVO);

    /**
     * 更新发票抬头
     *
     * @param id 发票抬头ID
     * @param updateVO 更新VO
     */
    void updateInvoiceHeader(Long id, InvoiceHeaderUpdateVO updateVO);

    /**
     * 删除发票抬头
     *
     * @param id 发票抬头ID
     * @param userId 用户ID（用于权限校验）
     */
    void deleteInvoiceHeader(Long id, Long userId);

    /**
     * 设置为默认抬头
     *
     * @param id 发票抬头ID
     * @param userId 用户ID（用于权限校验）
     */
    void setAsDefaultInvoiceHeader(Long id, Long userId);

    /**
     * 根据ID获取发票抬头详情
     *
     * @param id 发票抬头ID
     * @param userId 用户ID（用于权限校验）
     * @return 发票抬头详情
     */
    InvoiceHeaderListVO getInvoiceHeaderById(Long id, Long userId);
}