package com.microservice.invoice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.mapper.InvoiceRecordMapper;
import com.microservice.invoice.service.InvoiceRecordService;
import com.microservice.invoice.vo.InvoiceRecordListVO;
import com.microservice.invoice.vo.InvoiceRecordPageQueryVO;
import com.microservice.invoice.vo.PageVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 开票记录Service实现类
 *
 * @author system
 * @date 2024-01-01
 */
@Slf4j
@Service
public class InvoiceRecordServiceImpl extends ServiceImpl<InvoiceRecordMapper, InvoiceRecord> implements InvoiceRecordService {

    @Override
    public PageVO<InvoiceRecordListVO> getInvoiceRecordPage(InvoiceRecordPageQueryVO queryVO) {
        log.info("分页查询开票记录列表，查询条件：{}", queryVO);
        
        // 创建分页对象
        Page<InvoiceRecordListVO> page = new Page<>(queryVO.getPage(), queryVO.getPageSize());
        
        // 执行分页查询
        IPage<InvoiceRecordListVO> result = baseMapper.selectInvoiceRecordPage(page, queryVO);
        
        // 构建分页VO
        PageVO<InvoiceRecordListVO> pageVO = PageVO.of(
            queryVO.getPage(),
            queryVO.getPageSize(),
            result.getTotal(),
            result.getRecords()
        );
        
        log.info("分页查询开票记录列表完成，总记录数：{}", result.getTotal());
        return pageVO;
    }

    @Override
    public InvoiceRecord getInvoiceRecordById(Long id) {
        log.info("根据ID获取开票记录详情，ID：{}", id);
        
        if (id == null) {
            log.warn("开票记录ID为空");
            return null;
        }
        
        InvoiceRecord record = getById(id);
        log.info("根据ID获取开票记录详情完成，结果：{}", record != null ? "成功" : "未找到");
        return record;
    }
} 