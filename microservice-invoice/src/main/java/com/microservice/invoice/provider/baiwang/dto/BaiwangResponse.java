package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 百旺API响应包装类
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class BaiwangResponse {
    /**
     * 响应代码 0:成功
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String msg;
    
    /**
     * 响应数据
     */
    private Object data;
}