package com.microservice.invoice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.vo.InvoiceRecordListVO;
import com.microservice.invoice.vo.InvoiceRecordPageQueryVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 开票记录Mapper接口
 *
 * @author system
 * @date 2024-01-01
 */
@Mapper
public interface InvoiceRecordMapper extends BaseMapper<InvoiceRecord> {

    /**
     * 分页查询开票记录列表
     *
     * @param page     分页对象
     * @param queryVO  查询条件
     * @return 开票记录列表
     */
    IPage<InvoiceRecordListVO> selectInvoiceRecordPage(Page<InvoiceRecordListVO> page, @Param("queryVO") InvoiceRecordPageQueryVO queryVO);
} 