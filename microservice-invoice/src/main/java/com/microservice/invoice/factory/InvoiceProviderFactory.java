package com.microservice.invoice.factory;

import com.microservice.invoice.provider.InvoiceProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 开票服务提供者工厂
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Component
@RequiredArgsConstructor
public class InvoiceProviderFactory {
    
    private final List<InvoiceProvider> invoiceProviders;
    
    private final Map<Integer, InvoiceProvider> providerMap = new ConcurrentHashMap<>();
    
    /**
     * 获取开票服务提供者
     *
     * @param providerType 服务商类型
     * @return 开票服务提供者
     */
    public InvoiceProvider getProvider(Integer providerType) {
        if (providerType == null) {
            throw new IllegalArgumentException("开票服务商类型不能为空");
        }
        
        // 初始化服务商映射
        if (providerMap.isEmpty() && invoiceProviders != null) {
            for (InvoiceProvider provider : invoiceProviders) {
                providerMap.put(provider.getProviderType(), provider);
            }
        }
        
        InvoiceProvider provider = providerMap.get(providerType);
        if (provider == null) {
            throw new UnsupportedOperationException("不支持的开票服务商类型：" + providerType);
        }
        
        return provider;
    }
}