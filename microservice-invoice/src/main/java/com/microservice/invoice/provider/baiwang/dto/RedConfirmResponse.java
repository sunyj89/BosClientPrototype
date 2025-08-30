package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 数字化电子红字确认单申请响应数据
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class RedConfirmResponse {
    /**
     * 红字发票信息确认单编号
     */
    private String hzfpxxqrdbh;
    
    /**
     * UUID
     */
    private String uuid;
    
    /**
     * 红字确认信息状态代码 01:申请中
     */
    private String hzqrxxztDm;
}