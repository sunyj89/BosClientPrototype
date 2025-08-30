package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;
import java.util.List;

/**
 * 单张发票查询响应数据
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class InvoiceQueryResponse {
    /**
     * 错误信息
     */
    private String cwxx;
    
    /**
     * 发票代码
     */
    private String fpdm;
    
    /**
     * 发票号码
     */
    private String fphm;
    
    /**
     * 数电发票号码
     */
    private String sdfphm;
    
    /**
     * 开票日期
     */
    private String kprq;
    
    /**
     * 发票状态 00:正常
     */
    private String fpzt;
    
    /**
     * 发票类型代码 82:数电普通发票
     */
    private String fplxdm;
    
    /**
     * 销货单位识别号
     */
    private String xhdwsbh;
    
    /**
     * 销货单位名称
     */
    private String xhdwmc;
    
    /**
     * 销货单位地址电话
     */
    private String xhdwdzdh;
    
    /**
     * 销货单位银行账号
     */
    private String xhdwyhzh;
    
    /**
     * 购货单位识别号
     */
    private String ghdwsbh;
    
    /**
     * 购货单位名称
     */
    private String ghdwmc;
    
    /**
     * 购货单位地址电话
     */
    private String ghdwdzdh;
    
    /**
     * 购货单位银行账号
     */
    private String ghdwyhzh;
    
    /**
     * 合计金额
     */
    private String hjje;
    
    /**
     * 合计税额
     */
    private String hjse;
    
    /**
     * 价税合计
     */
    private String jshj;
    
    /**
     * 备注
     */
    private String bz;
    
    /**
     * 收款人
     */
    private String skr;
    
    /**
     * 复核人
     */
    private String fhr;
    
    /**
     * 开票人
     */
    private String kpr;
    
    /**
     * PDF文件URL
     */
    private String pdfurl;
    
    /**
     * OFD文件URL
     */
    private String ofdurl;
    
    /**
     * 二维码URL
     */
    private String ewmurl;
    
    /**
     * XML文件URL
     */
    private String xmlurl;
    
    /**
     * 发票请求流水号
     */
    private String fpqqlsh;
    
    /**
     * 验签结果
     */
    private String yqjg;
    
    /**
     * 发票明细项目
     */
    private List<InvoiceItem> fyxm;
    
    /**
     * 发票明细项
     */
    @Data
    public static class InvoiceItem {
        /**
         * 发票行性质 0:正常行
         */
        private String fphxz;
        
        /**
         * 商品名称
         */
        private String spmc;
        
        /**
         * 规格型号
         */
        private String ggxh;
        
        /**
         * 单位
         */
        private String dw;
        
        /**
         * 商品数量
         */
        private String spsl;
        
        /**
         * 单价
         */
        private String dj;
        
        /**
         * 金额
         */
        private String je;
        
        /**
         * 税率
         */
        private String sl;
        
        /**
         * 税额
         */
        private String se;
        
        /**
         * 含税标志 0:不含税
         */
        private String hsbz;
        
        /**
         * 商品编码
         */
        private String spbm;
        
        /**
         * 优惠政策标识
         */
        private String yhzcbs;
        
        /**
         * 零税率标识
         */
        private String lslbs;
        
        /**
         * 增值税特殊管理
         */
        private String zzstsgl;
        
        /**
         * 序号
         */
        private String xh;
    }
}