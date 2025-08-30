package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;

/**
 * 百旺API请求包装类
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class BaiwangRequest {
    /**
     * 接口方法名
     */
    private String method;
    
    /**
     * 请求数据
     */
    private Object object;
}