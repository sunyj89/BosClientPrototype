package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;
import java.util.List;

/**
 * 数字化电子红字确认单申请请求参数
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class RedConfirmRequest {
    /**
     * 录入方身份 0:销方 1:购方
     */
    private String lrfsf;
    
    /**
     * 销售方纳税人识别号
     */
    private String xsfnsrsbh;
    
    /**
     * 销售方名称
     */
    private String xsfmc;
    
    /**
     * 购买方纳税人识别号
     */
    private String gmfnsrsbh;
    
    /**
     * 购买方名称
     */
    private String gmfmc;
    
    /**
     * 蓝字发票代码
     */
    private String lzfpdm;
    
    /**
     * 蓝字发票号码
     */
    private String lzfphm;
    
    /**
     * 是否作废发票标志 Y:是 N:否
     */
    private String sfzzfpbz;
    
    /**
     * 蓝字开票日期
     */
    private String lzkprq;
    
    /**
     * 蓝字合计金额
     */
    private String lzhjje;
    
    /**
     * 蓝字合计税额
     */
    private String lzhjse;
    
    /**
     * 蓝字发票票种代码 01:数电专 02:数电普
     */
    private String lzfppzDm;
    
    /**
     * 蓝字发票特定要素类型代码
     */
    private String lzfpTdyslxDm;
    
    /**
     * 红字撤销金额
     */
    private String hzcxje;
    
    /**
     * 红字撤销税额
     */
    private String hzcxse;
    
    /**
     * 冲红原因代码 01:开票有误 02:销货退回 03:服务中止 04:销售折让
     */
    private String chyyDm;
    
    /**
     * 红字确认单明细列表
     */
    private List<HzqrdmxItem> hzqrdmxList;
    
    /**
     * 红字确认单明细项
     */
    @Data
    public static class HzqrdmxItem {
        /**
         * 蓝字明细序号
         */
        private String lzmxxh;
        
        /**
         * 序号
         */
        private String xh;
        
        /**
         * 商品和服务税收分类合并编码
         */
        private String sphfwssflhbbm;
        
        /**
         * 货物或应税劳务、服务名称
         */
        private String hwhyslwfwmc;
        
        /**
         * 商品/服务简称
         */
        private String spfwjc;
        
        /**
         * 项目名称
         */
        private String xmmc;
        
        /**
         * 规格型号
         */
        private String ggxh;
        
        /**
         * 单位
         */
        private String dw;
        
        /**
         * 发票商品单价
         */
        private String fpspdj;
        
        /**
         * 发票商品数量(负数)
         */
        private String fpspsl;
        
        /**
         * 金额(负数)
         */
        private String je;
        
        /**
         * 税率
         */
        private String sl1;
        
        /**
         * 税额(负数)
         */
        private String se;
    }
}