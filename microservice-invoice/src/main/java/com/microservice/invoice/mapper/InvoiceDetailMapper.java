package com.microservice.invoice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.microservice.invoice.entity.InvoiceDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 发票明细Mapper接口
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Mapper
public interface InvoiceDetailMapper extends BaseMapper<InvoiceDetail> {
}