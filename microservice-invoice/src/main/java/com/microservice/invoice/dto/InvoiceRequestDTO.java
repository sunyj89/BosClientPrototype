package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.microservice.invoice.dto.validation.ConsistentRedBlueDetailNo;
import java.math.BigDecimal;
import java.util.List;

/**
 * 开票请求DTO
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
@ConsistentRedBlueDetailNo
@Schema(description = "开票请求参数", 
    example = "{\n" +
    "  \"merchantId\": 2001,\n" +
    "  \"userId\": 12345,\n" +
    "  \"invoiceFlag\": \"0\",\n" +
    "  \"invoiceType\": \"02\",\n" +
    "  \"platformCode\": \"wx\",\n" +
    "  \"buyerName\": \"江西省交投化石能源有限公司虚拟单位\",\n" +
    "  \"buyerTaxNo\": \"9X0001GGMACM2L8N6B\",\n" +
    "  \"buyerPhone\": \"17665466542\",\n" +
    "  \"email\": \"1628287133@qq.com\",\n" +
    "  \"isBatch\": 1,\n" +
    "  \"orderCodes\": [\"ORDER_DIESEL_001\", \"ORDER_GASOLINE_001\"],\n" +
    "  \"masterOrderCode\": \"ORDER_DIESEL_001\",\n" +
    "  \"details\": [\n" +
    "    {\n" +
    "      \"productShortName\": \"成品油\",\n" +
    "      \"itemName\": \"车用柴油0#\",\n" +
    "      \"goodsName\": \"*成品油*车用柴油0#\",\n" +
    "      \"specification\": \"\",\n" +
    "      \"unit\": \"升\",\n" +
    "      \"quantity\": 50.00,\n" +
    "      \"unitPrice\": 7.85,\n" +
    "      \"taxRate\": 0.13,\n" +
    "      \"productCode\": \"0\",\n" +
    "      \"taxClassificationCode\": \"1070101030100000000\",\n" +
    "      \"preferentialPolicyFlag\": \"0\",\n" +
    "      \"originalDetailNo\": \"\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"productShortName\": \"成品油\",\n" +
    "      \"itemName\": \"车用汽油92#\",\n" +
    "      \"goodsName\": \"*成品油*车用汽油92#\",\n" +
    "      \"specification\": \"\",\n" +
    "      \"unit\": \"升\",\n" +
    "      \"quantity\": 30.00,\n" +
    "      \"unitPrice\": 8.12,\n" +
    "      \"taxRate\": 0.13,\n" +
    "      \"productCode\": \"92\",\n" +
    "      \"taxClassificationCode\": \"1070101010100000000\",\n" +
    "      \"preferentialPolicyFlag\": \"0\",\n" +
    "      \"originalDetailNo\": \"\"\n" +
    "    }\n" +
    "  ]\n" +
    "}")
public class InvoiceRequestDTO {
    
    @NotNull(message = "商户ID不能为空")
    @Schema(description = "商户ID", required = true, example = "2001")
    private Long merchantId;
    
    @Schema(description = "用户ID", example = "12345")
    private Long userId;
    
    @Schema(description = "发票类型 0:蓝字发票 1:红字发票", example = "0")
    private String invoiceFlag = "0";
    
    @Schema(description = "发票票种 01:数电专票 02:数电普票", example = "02")
    private String invoiceType = "02";
    
    @Schema(description = "商品类型 0:非油品 1:油品 2:充值卡", example = "0")
    private String productType = "0";
    
    @Schema(description = "平台编号（兼容旧业务系统）", example = "wx")
    private String platformCode;

    @Schema(description = "集团ID（用于集团开票场景）", example = "9001")
    private Long groupId;
    
    @Schema(description = "订单号列表（批量开票时传入多个订单号）", example = "[\"ORDER_DIESEL_001\", \"ORDER_GASOLINE_001\"]")
    private List<String> orderCodes;
    
    @Schema(description = "是否批量开票 0:否 1:是", example = "1")
    private Integer isBatch = 0;
    
    @Schema(description = "开票主订单号（用于关联批量开票的子订单）", example = "ORDER_DIESEL_001")
    private String masterOrderCode;
    
    @NotBlank(message = "购买方名称不能为空")
    @Schema(description = "购买方名称", required = true, example = "江西省交投化石能源有限公司虚拟单位")
    private String buyerName;
    
    @Schema(description = "购买方纳税人识别号", example = "9X0001GGMACM2L8N6B")
    private String buyerTaxNo;
    
    @Schema(description = "购买方地址", example = "北京市朝阳区XX路XX号")
    private String buyerAddress;
    
    @Schema(description = "购买方电话", example = "17665466542")
    private String buyerPhone;
    
    @Schema(description = "购买方邮箱", example = "1628287133@qq.com")
    private String email;
    
    @Schema(description = "购买方开户行", example = "中国银行北京分行")
    private String buyerBankName;
    
    @Schema(description = "购买方银行账号", example = "123456789012345678")
    private String buyerBankAccount;
    
    @Schema(description = "购买方经办人", example = "张三")
    private String buyerAgent;
    
    @Schema(description = "经办人身份证号", example = "110101199001011234")
    private String agentIdNo;
    
    @Schema(description = "经办人联系电话", example = "13800138000")
    private String agentPhone;
    
    @Schema(description = "开票人", example = "李四")
    private String drawer;
    
    @Schema(description = "收款人", example = "王五")
    private String payee;
    
    @Schema(description = "复核人", example = "赵六")
    private String reviewer;
    
    @Schema(description = "备注", example = "测试备注")
    private String remark;
    
    // 兼容旧业务系统的字段
    @Schema(description = "业务系统油品信息（系统自动转换为标准格式）", 
        example = "[\n" +
        "  {\n" +
        "    \"orderCode\": \"ORDER_DIESEL_001\",\n" +
        "    \"item\": {\n" +
        "      \"oilType\": 0,\n" +
        "      \"goodsType\": 1,\n" +
        "      \"name\": \"车用柴油0#\",\n" +
        "      \"num\": 50.000,\n" +
        "      \"unitPrice\": 7.85,\n" +
        "      \"price\": 392.50\n" +
        "    }\n" +
        "  },\n" +
        "  {\n" +
        "    \"orderCode\": \"ORDER_GASOLINE_001\",\n" +
        "    \"item\": {\n" +
        "      \"oilType\": 92,\n" +
        "      \"goodsType\": 1,\n" +
        "      \"name\": \"车用汽油92#\",\n" +
        "      \"num\": 30.000,\n" +
        "      \"unitPrice\": 8.12,\n" +
        "      \"price\": 243.60\n" +
        "    }\n" +
        "  }\n" +
        "]")
    private List<OilInfo> oilInfo;
    
    @Schema(description = "业务系统非油品信息（系统自动转换为标准格式）")
    private RetailInfo retailInfo;

    @Data
    @Schema(description = "油品信息", 
        example = "{\n" +
        "  \"orderCode\": \"ORDER_DIESEL_001\",\n" +
        "  \"item\": {\n" +
        "    \"oilType\": 0,\n" +
        "    \"goodsType\": 1,\n" +
        "    \"name\": \"车用柴油0#\",\n" +
        "    \"num\": 50.000,\n" +
        "    \"unitPrice\": 7.85,\n" +
        "    \"price\": 392.50\n" +
        "  }\n" +
        "}")
    public static class OilInfo {
        @Schema(description = "订单号", example = "ORDER_DIESEL_001")
        private String orderCode;
        
        @Schema(description = "油品明细")
        private OilItem item;
        
        @Data
        @Schema(description = "油品明细项")
        public static class OilItem {
            @Schema(description = "油品类型/油号", example = "92")
            private Integer oilType;
            
            @Schema(description = "商品类型", example = "1")
            private Integer goodsType;
            
            @Schema(description = "商品名称", example = "车用汽油92#")
            private String name;
            
            @Schema(description = "数量", example = "20.0")
            private BigDecimal num;
            
            @Schema(description = "单价", example = "7.5")
            private BigDecimal unitPrice;
            
            @Schema(description = "总价", example = "150.0")
            private BigDecimal price;
        }
    }
    
    @Data
    @Schema(description = "非油品信息")
    public static class RetailInfo {
        @Schema(description = "订单号")
        private String orderCode;
        
        @Schema(description = "非油品明细列表")
        private List<RetailItem> item;
        
        @Data
        @Schema(description = "非油品明细项")
        public static class RetailItem {
            @Schema(description = "零售类型 1:便利店 2:积分兑换 3:洗车服务 4:充值卡", example = "1")
            private Integer retailType;
            
            @Schema(description = "商品类型", example = "2")
            private Integer goodsType;
            
            @Schema(description = "商品名称", example = "非油品A")
            private String name;
            
            @Schema(description = "数量", example = "1")
            private BigDecimal num;
            
            @Schema(description = "单价", example = "10.0")
            private BigDecimal unitPrice;
            
            @Schema(description = "总价", example = "10.0")
            private BigDecimal price;
        }
    }
    
    @Schema(description = "对应蓝字发票号码：当invoiceFlag为0（蓝字）时必须为空；当invoiceFlag为1（红字）时，需填写与之对应的蓝字发票号码", example = "")
    private String originalInvoiceNo;
    
    @Schema(description = "红字确认信息单编号：当invoiceFlag为0（蓝字）时必须为空；当invoiceFlag为1（红字）时，需填写该蓝字发票对应申请的红字确认单编号", example = "")
    private String redConfirmNo;
    
    @Schema(description = "红字确认单UUID：当invoiceFlag为0（蓝字）时必须为空；当invoiceFlag为1（红字）时，需填写该蓝字发票对应申请的红字确认单UUID", example = "")
    private String redConfirmUuid;
    
    @Schema(description = "原蓝字发票日期（红字确认单申请必填）", example = "2025-04-28 15:54:15")
    private String originalInvoiceDate;
    
    @Schema(description = "冲红原因代码 01:开票有误 02:销货退回 03:服务中止 04:销售折让", example = "01")
    private String reverseReasonCode;
    
    @NotNull(message = "发票明细不能为空")
    @Size(min = 1, message = "至少需要一条发票明细")
    @Schema(description = "发票明细列表", required = true,
        example = "[\n" +
        "  {\n" +
        "    \"productShortName\": \"成品油\",\n" +
        "    \"itemName\": \"车用柴油0#\",\n" +
        "    \"goodsName\": \"*成品油*车用柴油0#\",\n" +
        "    \"specification\": \"\",\n" +
        "    \"unit\": \"升\",\n" +
        "    \"quantity\": 50.00,\n" +
        "    \"unitPrice\": 7.85,\n" +
        "    \"taxRate\": 0.13,\n" +
        "    \"productCode\": \"0\",\n" +
        "    \"taxClassificationCode\": \"1070101030100000000\",\n" +
        "    \"preferentialPolicyFlag\": \"0\",\n" +
        "    \"originalDetailNo\": \"\"\n" +
        "  },\n" +
        "  {\n" +
        "    \"productShortName\": \"成品油\",\n" +
        "    \"itemName\": \"车用汽油92#\",\n" +
        "    \"goodsName\": \"*成品油*车用汽油92#\",\n" +
        "    \"specification\": \"\",\n" +
        "    \"unit\": \"升\",\n" +
        "    \"quantity\": 30.00,\n" +
        "    \"unitPrice\": 8.12,\n" +
        "    \"taxRate\": 0.13,\n" +
        "    \"productCode\": \"92\",\n" +
        "    \"taxClassificationCode\": \"1070101010100000000\",\n" +
        "    \"preferentialPolicyFlag\": \"0\",\n" +
        "    \"originalDetailNo\": \"\"\n" +
        "  }\n" +
        "]")
    private List<InvoiceDetailDTO> details;
    
    /**
     * 发票明细DTO
     */
    @Data
    @Schema(description = "发票明细", 
        example = "{\n" +
        "  \"productShortName\": \"成品油\",\n" +
        "  \"itemName\": \"车用汽油92#\",\n" +
        "  \"goodsName\": \"*成品油*车用汽油92#\",\n" +
        "  \"specification\": \"\",\n" +
        "  \"unit\": \"升\",\n" +
        "  \"quantity\": 30.00,\n" +
        "  \"unitPrice\": 8.12,\n" +
        "  \"taxRate\": 0.13,\n" +
        "  \"productCode\": \"92\",\n" +
        "  \"taxClassificationCode\": \"1070101010100000000\",\n" +
        "  \"preferentialPolicyFlag\": \"0\",\n" +
        "  \"originalDetailNo\": \"\"\n" +
        "}")
    public static class InvoiceDetailDTO {
        @Schema(description = "产品代码，用于匹配油站税率配置", example = "92")
        private String productCode;
        
        @Schema(description = "商品/服务简称", example = "成品油")
        private String productShortName;
        
        @Schema(description = "项目名称", example = "车用汽油92#")
        private String itemName;
        
        @NotBlank(message = "货物或应税劳务名称不能为空")
        @Schema(description = "货物或应税劳务、服务名称", required = true, example = "*成品油*车用汽油92#")
        private String goodsName;
        
        @Schema(description = "规格型号", example = "")
        private String specification;
        
        @Schema(description = "单位", example = "升")
        private String unit;
        
        @NotNull(message = "数量不能为空")
        @Schema(description = "数量", required = true, example = "30.00")
        private BigDecimal quantity;
        
        @NotNull(message = "单价不能为空")
        @Schema(description = "单价", required = true, example = "8.12")
        private BigDecimal unitPrice;
        
        @NotNull(message = "税率不能为空")
        @Schema(description = "税率", required = true, example = "0.13")
        private BigDecimal taxRate;
        
        @NotBlank(message = "税收分类编码不能为空")
        @Schema(description = "商品和服务税收分类合并编码", required = true, example = "1070101010100000000")
        private String taxClassificationCode;
        
        @Schema(description = "优惠政策标识", example = "0")
        private String preferentialPolicyFlag = "0";
        
        @Size(max = 8, message = "对应蓝字发票明细序号最大长度8位")
        @Schema(description = "对应蓝字发票明细序号，选填，最大长度8位；当invoiceFlag为0（蓝字）时必须为空；当invoiceFlag为1（红字）时必须填写对应蓝字发票明细序号", example = "")
        private String originalDetailNo;
    }
}