package com.microservice.invoice.provider.baiwang.dto;

import lombok.Data;
import java.util.List;

/**
 * 数电发票开具请求参数
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
public class SdfpkjRequest {
    /**
     * 发票请求流水号
     */
    private String fpqqlsh;
    
    /**
     * 蓝字发票标志 0:蓝字发票 1:红字发票
     */
    private String lzfpbz;
    
    /**
     * 平台编号
     */
    private String ptbh;
    
    /**
     * 发票票种 01:数电专 02:数电普
     */
    private String fppz;
    
    /**
     * 购买方自然人标志 Y:是 N:否
     */
    private String gmfzrrbz;
    
    /**
     * 特定要素 01:成品油
     */
    private String tdys;
    
    /**
     * 销售方地址
     */
    private String xsfdz;
    
    /**
     * 销售方电话
     */
    private String xsfdh;
    
    /**
     * 销售方开户行
     */
    private String xsfkhh;
    
    /**
     * 销售方账号
     */
    private String xsfzh;
    
    /**
     * 购买方纳税人识别号
     */
    private String gmfnsrsbh;
    
    /**
     * 购买方名称
     */
    private String gmfmc;
    
    /**
     * 购买方地址
     */
    private String gmfdz;
    
    /**
     * 购买方电话
     */
    private String gmfdh;
    
    /**
     * 购买方开户行
     */
    private String gmfkhh;
    
    /**
     * 购买方账号
     */
    private String gmfzh;
    
    /**
     * 购买方经办人
     */
    private String gmfjbr;
    
    /**
     * 经办人身份证件号码
     */
    private String jbrsfzjhm;
    
    /**
     * 购买方经办人联系电话
     */
    private String gmfjbrlxdh;
    
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
     * 开票人
     */
    private String kpr;
    
    /**
     * 对应蓝字发票号码(红字发票必填)
     */
    private String dylzfphm;
    
    /**
     * 红字确认信息单编号(红字发票必填)
     */
    private String hzqrxxdbh;
    
    /**
     * 红字确认单uuid(红字发票必填)
     */
    private String hzqrduuid;
    
    /**
     * 备注
     */
    private String bz;
    
    /**
     * 是否展示销售方银行账号标签 Y:展示 N:不展示
     */
    private String sfzsxsfyhzhbq;
    
    /**
     * 是否展示购买方银行账号标签 Y:展示 N:不展示
     */
    private String sfzsgmfyhzhbq;
    
    /**
     * 收款人姓名
     */
    private String skrxm;
    
    /**
     * 复核人姓名
     */
    private String fhrxm;
    
    /**
     * 发票明细列表
     */
    private List<FpmxItem> fpmxList;
    
    /**
     * 发票明细项
     */
    @Data
    public static class FpmxItem {
        /**
         * 对应蓝字发票明细序号
         */
        private String dylzfpmxxh;
        
        /**
         * 明细序号
         */
        private String mxxh;
        
        /**
         * 商品/服务简称
         */
        private String spfwjc;
        
        /**
         * 项目名称
         */
        private String xmmc;
        
        /**
         * 货物或应税劳务、服务名称
         */
        private String hwhyslwfwmc;
        
        /**
         * 规格型号
         */
        private String ggxh;
        
        /**
         * 单位
         */
        private String dw;
        
        /**
         * 数量
         */
        private String sl;
        
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
        private String slv;
        
        /**
         * 税额
         */
        private String se;
        
        /**
         * 含税金额
         */
        private String hsje;
        
        /**
         * 商品和服务税收分类合并编码
         */
        private String sphfwssflhbbm;
        
        /**
         * 发票行性质 00:正常行
         */
        private String fphxz;
        
        /**
         * 优惠政策标识
         */
        private String yhzcbs;
    }
}