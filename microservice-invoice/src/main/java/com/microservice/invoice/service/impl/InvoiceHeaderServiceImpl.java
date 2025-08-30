package com.microservice.invoice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.microservice.invoice.entity.InvoiceHeader;
import com.microservice.invoice.mapper.InvoiceHeaderMapper;
import com.microservice.invoice.service.InvoiceHeaderService;
import com.microservice.invoice.vo.InvoiceHeaderCreateVO;
import com.microservice.invoice.vo.InvoiceHeaderListVO;
import com.microservice.invoice.vo.InvoiceHeaderUpdateVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 发票抬头服务实现类
 *
 * @author system
 * @since 2024-01-01
 */
@Slf4j
@Service
public class InvoiceHeaderServiceImpl extends ServiceImpl<InvoiceHeaderMapper, InvoiceHeader> implements InvoiceHeaderService {

    @Override
    public List<InvoiceHeaderListVO> getInvoiceHeadersByUserId(Long userId) {
        log.info("获取用户发票抬头列表，用户ID: {}", userId);
        
        List<InvoiceHeaderListVO> headers = baseMapper.selectInvoiceHeadersByUserId(userId);
        
        log.info("获取用户发票抬头列表成功，用户ID: {}, 数量: {}", userId, headers.size());
        return headers;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long createInvoiceHeader(InvoiceHeaderCreateVO createVO) {
        log.info("创建发票抬头，参数: {}", createVO);
        
        // 检查同一用户下是否已存在相同的纳税人识别号
        LambdaQueryWrapper<InvoiceHeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InvoiceHeader::getUserId, createVO.getUserId())
               .eq(InvoiceHeader::getTaxId, createVO.getTaxId())
               .eq(InvoiceHeader::getDeleted, 0);
        
        InvoiceHeader existing = this.getOne(wrapper);
        if (existing != null) {
            log.warn("用户已存在相同纳税人识别号的发票抬头，用户ID: {}, 纳税人识别号: {}", 
                    createVO.getUserId(), createVO.getTaxId());
            throw new RuntimeException("已存在相同纳税人识别号的发票抬头");
        }
        
        // 如果设置为默认抬头，先清除该用户的其他默认抬头
        if (Boolean.TRUE.equals(createVO.getSetAsDefault())) {
            baseMapper.clearDefaultInvoiceHeadersByUserId(createVO.getUserId());
        }
        
        // 创建发票抬头
        InvoiceHeader invoiceHeader = new InvoiceHeader();
        BeanUtils.copyProperties(createVO, invoiceHeader);
        
        // 设置默认值
        invoiceHeader.setIsDefault(Boolean.TRUE.equals(createVO.getSetAsDefault()) ? 1 : 0);
        
        this.save(invoiceHeader);
        
        log.info("创建发票抬头成功，ID: {}", invoiceHeader.getId());
        return invoiceHeader.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateInvoiceHeader(Long id, InvoiceHeaderUpdateVO updateVO) {
        log.info("更新发票抬头，ID: {}, 参数: {}", id, updateVO);
        
        // 检查发票抬头是否存在且属于当前用户
        InvoiceHeader existing = this.getById(id);
        if (existing == null || existing.getDeleted() == 1) {
            log.warn("发票抬头不存在或已删除，ID: {}", id);
            throw new RuntimeException("发票抬头不存在或已删除");
        }
        
        // 检查更新后的纳税人识别号是否与其他抬头重复（排除当前记录）
        LambdaQueryWrapper<InvoiceHeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InvoiceHeader::getUserId, existing.getUserId())
               .eq(InvoiceHeader::getTaxId, updateVO.getTaxId())
               .eq(InvoiceHeader::getDeleted, 0)
               .ne(InvoiceHeader::getId, id);
        
        InvoiceHeader duplicate = this.getOne(wrapper);
        if (duplicate != null) {
            log.warn("纳税人识别号已存在于其他发票抬头中，纳税人识别号: {}", updateVO.getTaxId());
            throw new RuntimeException("纳税人识别号已存在于其他发票抬头中");
        }
        
        // 更新发票抬头
        InvoiceHeader invoiceHeader = new InvoiceHeader();
        BeanUtils.copyProperties(updateVO, invoiceHeader);
        invoiceHeader.setId(id);
        
        this.updateById(invoiceHeader);
        
        log.info("更新发票抬头成功，ID: {}", id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteInvoiceHeader(Long id, Long userId) {
        log.info("删除发票抬头，ID: {}, 用户ID: {}", id, userId);
        
        // 检查发票抬头是否存在且属于当前用户
        LambdaQueryWrapper<InvoiceHeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InvoiceHeader::getId, id)
               .eq(InvoiceHeader::getUserId, userId)
               .eq(InvoiceHeader::getDeleted, 0);
        
        InvoiceHeader existing = this.getOne(wrapper);
        if (existing == null) {
            log.warn("发票抬头不存在、已删除或无权限，ID: {}, 用户ID: {}", id, userId);
            throw new RuntimeException("发票抬头不存在、已删除或无权限");
        }
        
        // 执行软删除，设置删除标志和删除时间
        LambdaUpdateWrapper<InvoiceHeader> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(InvoiceHeader::getId, id)
                    .eq(InvoiceHeader::getUserId, userId)
                    .eq(InvoiceHeader::getDeleted, 0) // 确保只删除未删除的记录
                    .set(InvoiceHeader::getDeleted, 1)
                    .set(InvoiceHeader::getDeletedTime, LocalDateTime.now());
        
        this.update(updateWrapper);
        
        log.info("删除发票抬头成功，ID: {}", id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setAsDefaultInvoiceHeader(Long id, Long userId) {
        log.info("设置默认发票抬头，ID: {}, 用户ID: {}", id, userId);
        
        // 检查发票抬头是否存在且属于当前用户
        LambdaQueryWrapper<InvoiceHeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InvoiceHeader::getId, id)
               .eq(InvoiceHeader::getUserId, userId)
               .eq(InvoiceHeader::getDeleted, 0);
        
        InvoiceHeader existing = this.getOne(wrapper);
        if (existing == null) {
            log.warn("发票抬头不存在、已删除或无权限，ID: {}, 用户ID: {}", id, userId);
            throw new RuntimeException("发票抬头不存在、已删除或无权限");
        }
        
        // 如果已经是默认抬头，直接返回
        if (existing.getIsDefault() == 1) {
            log.info("发票抬头已是默认抬头，ID: {}", id);
            return;
        }
        
        // 先清除该用户的所有默认抬头
        baseMapper.clearDefaultInvoiceHeadersByUserId(userId);
        
        // 设置当前抬头为默认
        baseMapper.setAsDefaultInvoiceHeader(id, userId);
        
        log.info("设置默认发票抬头成功，ID: {}", id);
    }

    @Override
    public InvoiceHeaderListVO getInvoiceHeaderById(Long id, Long userId) {
        log.info("获取发票抬头详情，ID: {}, 用户ID: {}", id, userId);
        
        // 检查发票抬头是否存在且属于当前用户
        LambdaQueryWrapper<InvoiceHeader> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InvoiceHeader::getId, id)
               .eq(InvoiceHeader::getUserId, userId)
               .eq(InvoiceHeader::getDeleted, 0);
        
        InvoiceHeader invoiceHeader = this.getOne(wrapper);
        if (invoiceHeader == null) {
            log.warn("发票抬头不存在、已删除或无权限，ID: {}, 用户ID: {}", id, userId);
            return null;
        }
        
        // 转换为VO
        InvoiceHeaderListVO vo = new InvoiceHeaderListVO();
        BeanUtils.copyProperties(invoiceHeader, vo);
        
        // 设置显示名称
        vo.setHeaderTypeName(invoiceHeader.getHeaderType() == 1 ? "个人" : "企业");
        vo.setIsDefaultName(invoiceHeader.getIsDefault() == 1 ? "默认" : "非默认");
        
        log.info("获取发票抬头详情成功，ID: {}", id);
        return vo;
    }
}