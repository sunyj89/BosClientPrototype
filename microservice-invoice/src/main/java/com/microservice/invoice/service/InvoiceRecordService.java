package com.microservice.invoice.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.vo.InvoiceRecordListVO;
import com.microservice.invoice.vo.InvoiceRecordPageQueryVO;
import com.microservice.invoice.vo.PageVO;

/**
 * 开票记录Service接口
 *
 * @author system
 * @date 2024-01-01
 */
public interface InvoiceRecordService extends IService<InvoiceRecord> {

    /**
     * 分页查询开票记录列表
     *
     * @param queryVO  查询条件
     * @return 分页结果
     */
    PageVO<InvoiceRecordListVO> getInvoiceRecordPage(InvoiceRecordPageQueryVO queryVO);

    /**
     * 根据ID获取开票记录详情
     *
     * @param id 开票记录ID
     * @return 开票记录详情
     */
    InvoiceRecord getInvoiceRecordById(Long id);
} 