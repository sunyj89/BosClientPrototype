package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 开票记录列表VO
 *
 * @author system
 * @date 2024-01-01
 */
@Data
@Schema(description = "开票记录列表VO")
public class InvoiceRecordListVO {

    @Schema(description = "主键ID", example = "1")
    private Long id;

    @Schema(description = "发票请求流水号(内部订单编号)", example = "INV202401010001")
    private String orderCode;

    @Schema(description = "用户ID", example = "1001")
    private Long userId;

    @Schema(description = "商户ID", example = "1001")
    private Long merchantId;

    @Schema(description = "蓝字发票标志 0：蓝字发票 1：红字发票", example = "0")
    private String invoiceFlag;

    @Schema(description = "发票票种 01：数电专 02：数电普", example = "01")
    private String invoiceType;

    @Schema(description = "购买方名称", example = "测试公司A")
    private String buyerName;

    @Schema(description = "合计金额", example = "1000.00")
    private BigDecimal totalAmount;

    @Schema(description = "合计税额", example = "130.00")
    private BigDecimal totalTax;

    @Schema(description = "价税合计", example = "1130.00")
    private BigDecimal totalAmountWithTax;

    @Schema(description = "开票人", example = "张三")
    private String drawerName;

    @Schema(description = "发票状态 00：待开票 01：开票中 02：开票成功 03：开票失败", example = "02")
    private String invoiceStatus;

    @Schema(description = "发票号码", example = "12345678")
    private String invoiceNo;

    @Schema(description = "发票代码", example = "123456789")
    private String invoiceCode;

    @Schema(description = "开票日期", example = "2024-01-01")
    private LocalDate invoiceDate;

    @Schema(description = "错误信息", example = "")
    private String errorMsg;

    @Schema(description = "重试次数", example = "0")
    private Integer retryCount;

    @Schema(description = "PDF文件访问地址", example = "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/pdf")
    private String pdfUrl;

    @Schema(description = "数据来源", example = "系统生成")
    private String sjly;

    @Schema(description = "OFD文件访问地址", example = "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/ofd")
    private String ofdUrl;

    @Schema(description = "二维码访问地址", example = "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/qr")
    private String ewmUrl;

    @Schema(description = "XML文件访问地址", example = "http://172.16.10.159:18081/api/localDigitalLayout/getStream/bswj/20250428/25997000000170129316/xml")
    private String xmlUrl;

    @Schema(description = "创建时间", example = "2024-01-01 10:00:00")
    private LocalDateTime createdTime;

    @Schema(description = "更新时间", example = "2024-01-01 10:00:00")
    private LocalDateTime updatedTime;
}