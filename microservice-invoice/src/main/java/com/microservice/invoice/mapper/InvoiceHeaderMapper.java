package com.microservice.invoice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.microservice.invoice.entity.InvoiceHeader;
import com.microservice.invoice.vo.InvoiceHeaderListVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 发票抬头Mapper接口
 *
 * @author system
 * @since 2024-01-01
 */
@Mapper
public interface InvoiceHeaderMapper extends BaseMapper<InvoiceHeader> {

    /**
     * 根据用户ID查询发票抬头列表
     *
     * @param userId 用户ID
     * @return 发票抬头列表
     */
    List<InvoiceHeaderListVO> selectInvoiceHeadersByUserId(@Param("userId") Long userId);

    /**
     * 根据用户ID获取默认发票抬头
     *
     * @param userId 用户ID
     * @return 默认发票抬头
     */
    InvoiceHeaderListVO selectDefaultInvoiceHeaderByUserId(@Param("userId") Long userId);

    /**
     * 将用户的所有发票抬头设置为非默认
     *
     * @param userId 用户ID
     * @return 更新数量
     */
    int clearDefaultInvoiceHeadersByUserId(@Param("userId") Long userId);

    /**
     * 设置指定发票抬头为默认
     *
     * @param id 发票抬头ID
     * @param userId 用户ID
     * @return 更新数量
     */
    int setAsDefaultInvoiceHeader(@Param("id") Long id, @Param("userId") Long userId);
}