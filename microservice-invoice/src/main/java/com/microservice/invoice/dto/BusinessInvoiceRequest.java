package com.microservice.invoice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "业务开票请求（兼容非油/油品/充值卡）")
public class BusinessInvoiceRequest {

    private String open_time;
    private String platform;
    private String remark;

    private InvoiceInfo invoice_info;

    private Integer is_split;
    private String wx_order_id;
    private String qj_order_id;

    private String order_code;
    private String order_codes;

    private RetailInfo retail_info;
    private List<OilInfo> oil_info;

    private Integer give_cash;
    private List<Object> give_cash_arr;

    @Data
    public static class InvoiceInfo {
        @Schema(description = "发票抬头")
        private String invoice_title;
        @Schema(description = "纳税人识别号")
        private String taxyer_id;
        @Schema(description = "票种 01:数电专 02:数电普")
        private String invoice_type;
        private String email;
        private String address;
        private String tell;
        private String bank_name;
        private String bank_no;
    }

    @Data
    public static class RetailInfo {
        private String order_code;
        private List<RetailItem> item;

        @Data
        public static class RetailItem {
            private Integer retail_type;
            private Integer goods_type;
            private String name;
            private BigDecimal num;
            private BigDecimal unit_price;
            private BigDecimal price;
        }
    }

    @Data
    public static class OilInfo {
        private String order_code;
        private OilItem item;

        @Data
        public static class OilItem {
            private Integer oil_type;
            private Integer goods_type;
            private String name;
            private BigDecimal num;
            private BigDecimal unit_price;
            private BigDecimal origin_price;
            private BigDecimal price;
            private String gun_id;
            private String oil_id;
        }
    }
}

