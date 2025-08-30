package com.microservice.invoice.service;

import com.microservice.invoice.dto.InvoiceRequestDTO;
import com.microservice.invoice.dto.InvoiceResponseDTO;
import com.microservice.invoice.entity.InvoiceDetail;
import com.microservice.invoice.entity.InvoiceRecord;
import com.microservice.invoice.entity.StationInvoiceConfig;
import com.microservice.invoice.factory.InvoiceProviderFactory;
import com.microservice.invoice.mapper.InvoiceDetailMapper;
import com.microservice.invoice.mapper.InvoiceRecordMapper;
import com.microservice.invoice.mapper.StationInvoiceConfigMapper;
import com.microservice.invoice.provider.InvoiceProvider;
import com.microservice.invoice.provider.baiwang.BaiwangInvoiceProvider;
import com.microservice.invoice.service.impl.InvoiceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * 开票服务测试类
 *
 * @author yangyang
 * @date 2025-01-18
 */
@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {
    
    @Mock
    private InvoiceRecordMapper invoiceRecordMapper;
    
    @Mock
    private InvoiceDetailMapper invoiceDetailMapper;
    
    @Mock
    private StationInvoiceConfigMapper stationInvoiceConfigMapper;
    
    @Mock
    private InvoiceProviderFactory invoiceProviderFactory;
    
    @Mock
    private BaiwangInvoiceProvider baiwangInvoiceProvider;
    
    @InjectMocks
    private InvoiceServiceImpl invoiceService;
    
    private InvoiceRequestDTO requestDTO;
    private StationInvoiceConfig stationConfig;
    
    @BeforeEach
    void setUp() {
        // 准备测试数据
        requestDTO = new InvoiceRequestDTO();
        requestDTO.setMerchantId(2001L);
        requestDTO.setBuyerTaxNo("9X0001GGMACM2L8N6B");
        requestDTO.setBuyerName("江西省交投化石能源有限公司虚拟单位");
        requestDTO.setDrawer("测试");
        requestDTO.setInvoiceFlag("0"); // 蓝字发票
        requestDTO.setInvoiceType("02"); // 数电普票
        requestDTO.setProductType("0"); // 非油品
        
        // 创建发票明细
        List<InvoiceRequestDTO.InvoiceDetailDTO> details = new ArrayList<>();
        InvoiceRequestDTO.InvoiceDetailDTO detail = new InvoiceRequestDTO.InvoiceDetailDTO();
        detail.setProductShortName("专项化学用品");
        detail.setItemName("悦泰海龙柴油车尾气处理液20Kg");
        detail.setGoodsName("*专项化学用品*悦泰海龙柴油车尾气处理液20Kg");
        detail.setUnit("瓶");
        detail.setQuantity(new BigDecimal("1.00"));
        detail.setUnitPrice(new BigDecimal("88.50"));
        detail.setTaxRate(new BigDecimal("0.13"));
        detail.setTaxClassificationCode("1070215020000000000");
        details.add(detail);
        requestDTO.setDetails(details);
        
        // 创建站点配置
        stationConfig = new StationInvoiceConfig();
        stationConfig.setId(2001L);
        stationConfig.setMerchantId(2001L);
        stationConfig.setStationName("测试站点");
        stationConfig.setStationAddress("测试地址");
        stationConfig.setStationPhone("13800138000");
        stationConfig.setBankName("测试银行");
        stationConfig.setBankAccount("1234567890");
        stationConfig.setProviderType(1); // 百旺乐企
        stationConfig.setDeleted(false);
    }
    
    @Test
    void testIssueInvoice() {
        // 模拟站点配置查询
        when(stationInvoiceConfigMapper.selectActiveByStationId(2001L)).thenReturn(stationConfig);
        
        // 模拟工厂返回百旺提供者
        when(invoiceProviderFactory.getProvider(1)).thenReturn(baiwangInvoiceProvider);
        
        // 模拟百旺接口返回成功
        InvoiceResponseDTO mockResponse = new InvoiceResponseDTO();
        mockResponse.setCode(0);
        mockResponse.setMessage("成功");
        mockResponse.setInvoiceNo("00000001");
        mockResponse.setPdfUrl("http://example.com/pdf");
        when(baiwangInvoiceProvider.issueInvoice(any(InvoiceRequestDTO.class), any(InvoiceProvider.StationInvoiceConfig.class)))
            .thenReturn(mockResponse);
        
        // 测试开具发票
        InvoiceResponseDTO result = invoiceService.issueInvoice(requestDTO);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.getCode());
        assertEquals("成功", result.getMessage());
        assertEquals("00000001", result.getInvoiceNo());
        
        // 验证方法调用
        verify(invoiceRecordMapper, times(1)).insert((InvoiceRecord) any());
        verify(invoiceDetailMapper, times(1)).insert((InvoiceDetail) any());
        verify(invoiceRecordMapper, times(2)).updateById((InvoiceRecord) any());
    }
    
    @Test
    void testGetInvoiceDownloadUrl() {
        // 模拟站点配置查询
        when(stationInvoiceConfigMapper.selectActiveByStationId(2001L)).thenReturn(stationConfig);
        
        // 模拟发票记录查询
        InvoiceRecord mockRecord = new InvoiceRecord();
        mockRecord.setOrderCode("ORDER001");
        when(invoiceRecordMapper.selectOne(any())).thenReturn(mockRecord);
        
        // 模拟工厂返回百旺提供者
        when(invoiceProviderFactory.getProvider(1)).thenReturn(baiwangInvoiceProvider);
        
        // 模拟百旺接口返回
        InvoiceResponseDTO mockResponse = new InvoiceResponseDTO();
        mockResponse.setCode(0);
        mockResponse.setPdfUrl("http://example.com/pdf");
        mockResponse.setOfdUrl("http://example.com/ofd");
        when(baiwangInvoiceProvider.getInvoiceDownloadUrl(anyString(), anyString(), any()))
            .thenReturn(mockResponse);
        
        // 测试获取下载地址
        InvoiceResponseDTO result = invoiceService.getInvoiceDownloadUrl("00000001", 2001L);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.getCode());
        assertNotNull(result.getPdfUrl());
        assertNotNull(result.getOfdUrl());
    }
    
    @Test
    void testQueryInvoice() {
        // 模拟站点配置查询
        when(stationInvoiceConfigMapper.selectActiveByStationId(2001L)).thenReturn(stationConfig);
        
        // 模拟工厂返回百旺提供者
        when(invoiceProviderFactory.getProvider(1)).thenReturn(baiwangInvoiceProvider);
        
        // 模拟百旺接口返回
        InvoiceResponseDTO mockResponse = new InvoiceResponseDTO();
        mockResponse.setCode(0);
        mockResponse.setInvoiceNo("00000001");
        mockResponse.setInvoiceStatus("00"); // 正常
        when(baiwangInvoiceProvider.queryInvoice(anyString(), anyString(), any()))
            .thenReturn(mockResponse);
        
        // 测试查询发票
        InvoiceResponseDTO result = invoiceService.queryInvoice("00000001", 2001L);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.getCode());
        assertEquals("00000001", result.getInvoiceNo());
        assertEquals("00", result.getInvoiceStatus());
    }
    
    @Test
    void testIssueRedInvoice() {
        // 准备红字发票请求
        requestDTO.setInvoiceFlag("1"); // 红字发票
        requestDTO.setOriginalInvoiceNo("00000001");
        requestDTO.setRedConfirmNo("99000025048000220562");
        requestDTO.setRedConfirmUuid("6ab9f900c9e340568eab3221d45151a8");
        
        // 模拟站点配置查询
        when(stationInvoiceConfigMapper.selectActiveByStationId(2001L)).thenReturn(stationConfig);
        
        // 模拟工厂返回百旺提供者
        when(invoiceProviderFactory.getProvider(1)).thenReturn(baiwangInvoiceProvider);
        
        // 模拟百旺接口返回成功
        InvoiceResponseDTO mockResponse = new InvoiceResponseDTO();
        mockResponse.setCode(0);
        mockResponse.setMessage("成功");
        mockResponse.setInvoiceNo("00000002");
        when(baiwangInvoiceProvider.issueInvoice(any(InvoiceRequestDTO.class), any()))
            .thenReturn(mockResponse);
        
        // 测试开具红字发票
        InvoiceResponseDTO result = invoiceService.issueRedInvoice(requestDTO);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.getCode());
        assertEquals("1", requestDTO.getInvoiceFlag()); // 确认设置为红字发票
    }
}