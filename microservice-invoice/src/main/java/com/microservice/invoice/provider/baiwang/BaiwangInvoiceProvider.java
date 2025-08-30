package com.microservice.invoice.provider.baiwang;

import cn.hutool.core.codec.Base64;
import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.SM2;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONUtil;
import com.microservice.invoice.dto.InvoiceRequestDTO;
import com.microservice.invoice.dto.InvoiceResponseDTO;
import com.microservice.invoice.provider.InvoiceProvider;
import com.microservice.invoice.mapper.TaxRateConfigMapper;
import com.microservice.invoice.entity.TaxRateConfig;
import com.microservice.invoice.provider.baiwang.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 百旺乐企开票服务实现
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BaiwangInvoiceProvider implements InvoiceProvider {

    private final TaxRateConfigMapper taxRateConfigMapper;
    
    @Override
    public Integer getProviderType() {
        return 1; // 百旺乐企
    }
    
    @Override
    public InvoiceResponseDTO issueInvoice(InvoiceRequestDTO request, StationInvoiceConfig config) {
        log.info("百旺乐企开票，merchantId：{}，发票类型：{}", request.getMerchantId(), request.getInvoiceFlag());
        
        try {
            // 构建百旺请求
            BaiwangRequest baiwangRequest = new BaiwangRequest();
            baiwangRequest.setMethod("sdfpkj");
            
            List<SdfpkjRequest> requestList = new ArrayList<>();
            SdfpkjRequest sdfpkjRequest = buildSdfpkjRequest(request, config);
            requestList.add(sdfpkjRequest);
            baiwangRequest.setObject(requestList);
            
            // 调用百旺API
            String responseStr = callBaiwangApi(baiwangRequest, config);
            BaiwangResponse response = JSONUtil.toBean(responseStr, BaiwangResponse.class);
            
            // 转换响应
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(response.getCode());
            result.setMessage(response.getMsg());
            
            if (response.getCode() == 0 && response.getData() != null) {
                SdfpkjResponse data = JSONUtil.toBean(JSONUtil.toJsonStr(response.getData()), SdfpkjResponse.class);
                result.setRequestSerialNo(data.getFpqqlsh());
                result.setInvoiceNo(data.getFphm());
                result.setInvoiceDate(data.getKprq());
            }
            
            return result;
        } catch (Exception e) {
            log.error("百旺乐企开票失败", e);
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(-1);
            result.setMessage("开票失败：" + e.getMessage());
            return result;
        }
    }
    
    @Override
    public InvoiceResponseDTO getInvoiceDownloadUrl(String invoiceNo, String requestSerialNo, StationInvoiceConfig config) {
        log.info("获取发票下载地址，发票号码：{}", invoiceNo);
        
        try {
            BaiwangRequest request = new BaiwangRequest();
            request.setMethod("hqsdfpxzdz");
            
            InvoiceDownloadRequest downloadRequest = new InvoiceDownloadRequest();
            downloadRequest.setFphm(invoiceNo);
            downloadRequest.setKprq("");  // 开票日期可选
            request.setObject(downloadRequest);
            
            String responseStr = callBaiwangApi(request, config);
            BaiwangResponse response = JSONUtil.toBean(responseStr, BaiwangResponse.class);
            
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(response.getCode());
            result.setMessage(response.getMsg());
            
            if (response.getCode() == 0 && response.getData() != null) {
                InvoiceDownloadResponse data = JSONUtil.toBean(JSONUtil.toJsonStr(response.getData()), InvoiceDownloadResponse.class);
                result.setPdfUrl(data.getPdfurl());
                result.setOfdUrl(data.getOfdurl());
                result.setXmlUrl(data.getXmlurl());
                result.setQrCodeUrl(data.getEwmurl());
            }
            
            return result;
        } catch (Exception e) {
            log.error("获取发票下载地址失败", e);
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(-1);
            result.setMessage("获取下载地址失败：" + e.getMessage());
            return result;
        }
    }
    
    @Override
    public InvoiceResponseDTO queryInvoice(String invoiceNo, String requestSerialNo, StationInvoiceConfig config) {
        log.info("查询发票，发票号码：{}", invoiceNo);
        
        try {
            BaiwangRequest request = new BaiwangRequest();
            request.setMethod("dzfpcx");
            
            InvoiceQueryRequest queryRequest = new InvoiceQueryRequest();
            queryRequest.setFphm(invoiceNo);
            queryRequest.setFpqqlsh(requestSerialNo);
            request.setObject(queryRequest);
            
            String responseStr = callBaiwangApi(request, config);
            BaiwangResponse response = JSONUtil.toBean(responseStr, BaiwangResponse.class);
            
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(response.getCode());
            result.setMessage(response.getMsg());
            
            if (response.getCode() == 0 && response.getData() != null) {
                InvoiceQueryResponse data = JSONUtil.toBean(JSONUtil.toJsonStr(response.getData()), InvoiceQueryResponse.class);
                result.setInvoiceNo(data.getSdfphm());
                result.setInvoiceDate(data.getKprq());
                result.setInvoiceStatus(data.getFpzt());
                result.setTotalAmount(new BigDecimal(data.getHjje()));
                result.setTotalTax(new BigDecimal(data.getHjse()));
                result.setTotalWithTax(new BigDecimal(data.getJshj()));
                result.setPdfUrl(data.getPdfurl());
                result.setOfdUrl(data.getOfdurl());
                result.setXmlUrl(data.getXmlurl());
                result.setBuyerName(data.getGhdwmc());
                result.setBuyerTaxNo(data.getGhdwsbh());
                result.setSellerName(data.getXhdwmc());
                result.setSellerTaxNo(data.getXhdwsbh());
            }
            
            return result;
        } catch (Exception e) {
            log.error("查询发票失败", e);
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(-1);
            result.setMessage("查询发票失败：" + e.getMessage());
            return result;
        }
    }
    
    @Override
    public InvoiceResponseDTO applyRedConfirm(InvoiceRequestDTO request, StationInvoiceConfig config) {
        log.info("申请红字确认单，原发票号码：{}", request.getOriginalInvoiceNo());
        
        try {
            BaiwangRequest baiwangRequest = new BaiwangRequest();
            baiwangRequest.setMethod("szhdzhzqrdsq");
            
            RedConfirmRequest redRequest = buildRedConfirmRequest(request, config);
            baiwangRequest.setObject(redRequest);
            
            String responseStr = callBaiwangApi(baiwangRequest, config);
            BaiwangResponse response = JSONUtil.toBean(responseStr, BaiwangResponse.class);
            
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(response.getCode());
            result.setMessage(response.getMsg());
            
            if (response.getCode() == 0 && response.getData() != null) {
                RedConfirmResponse data = JSONUtil.toBean(JSONUtil.toJsonStr(response.getData()), RedConfirmResponse.class);
                result.setRedConfirmNo(data.getHzfpxxqrdbh());
                result.setRedConfirmUuid(data.getUuid());
                result.setRedConfirmStatus(data.getHzqrxxztDm());
            }
            
            return result;
        } catch (Exception e) {
            log.error("申请红字确认单失败", e);
            InvoiceResponseDTO result = new InvoiceResponseDTO();
            result.setCode(-1);
            result.setMessage("申请红字确认单失败：" + e.getMessage());
            return result;
        }
    }
    
    @Override
    public InvoiceResponseDTO issueRedInvoice(InvoiceRequestDTO request, StationInvoiceConfig config) {
        log.info("百旺乐企开红字发票，merchantId：{}", request.getMerchantId());
        
        // 红字发票复用蓝字发票接口，只是参数不同
        request.setInvoiceFlag("1"); // 设置为红字发票
        return issueInvoice(request, config);
    }
    
    /**
     * 构建数电发票开具请求
     */
    private SdfpkjRequest buildSdfpkjRequest(InvoiceRequestDTO request, StationInvoiceConfig config) {
        SdfpkjRequest sdfpkjRequest = new SdfpkjRequest();
        
        // 基本信息
        // 批量开票时使用主订单号，单个开票时生成UUID
        String requestSerialNo;
        if (request.getIsBatch() != null && request.getIsBatch() == 1 && request.getMasterOrderCode() != null) {
            requestSerialNo = request.getMasterOrderCode();
        } else if (request.getOrderCodes() != null && !request.getOrderCodes().isEmpty()) {
            requestSerialNo = request.getOrderCodes().get(0);
        } else {
            requestSerialNo = UUID.randomUUID().toString().replace("-", "");
        }
        sdfpkjRequest.setFpqqlsh(requestSerialNo);
        sdfpkjRequest.setLzfpbz(request.getInvoiceFlag());
        sdfpkjRequest.setPtbh("");
        sdfpkjRequest.setFppz(request.getInvoiceType());
        sdfpkjRequest.setGmfzrrbz("N");
        sdfpkjRequest.setTdys("1".equals(request.getProductType()) ? "01" : "");
        
        // 销售方信息
        sdfpkjRequest.setXsfdz(config.getStationAddress());
        sdfpkjRequest.setXsfdh(config.getStationPhone());
        sdfpkjRequest.setXsfkhh(config.getBankName());
        sdfpkjRequest.setXsfzh(config.getBankAccount());
        
        // 购买方信息
        sdfpkjRequest.setGmfnsrsbh(request.getBuyerTaxNo());
        sdfpkjRequest.setGmfmc(request.getBuyerName());
        sdfpkjRequest.setGmfdz(request.getBuyerAddress());
        sdfpkjRequest.setGmfdh(request.getBuyerPhone());
        sdfpkjRequest.setGmfkhh(request.getBuyerBankName());
        sdfpkjRequest.setGmfzh(request.getBuyerBankAccount());
        sdfpkjRequest.setGmfjbr(request.getBuyerAgent());
        sdfpkjRequest.setJbrsfzjhm(request.getAgentIdNo());
        sdfpkjRequest.setGmfjbrlxdh(request.getAgentPhone());
        
        // 计算金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        
        List<SdfpkjRequest.FpmxItem> fpmxList = new ArrayList<>();
        int index = 1;
        
        for (InvoiceRequestDTO.InvoiceDetailDTO detail : request.getDetails()) {
            // 设置精度为6位小数以避免计算误差
            BigDecimal quantity = detail.getQuantity().setScale(6, RoundingMode.HALF_UP);
            BigDecimal unitPrice = detail.getUnitPrice().setScale(6, RoundingMode.HALF_UP);
            BigDecimal taxRate = detail.getTaxRate();
            
            // 按照百旺要求的计算逻辑
            // je（金额）= dj（单价）× sl（数量）
            BigDecimal je = quantity.multiply(unitPrice).setScale(2, RoundingMode.HALF_UP);
            
            // se（税额）= je（金额）× slv（税率）
            BigDecimal se = je.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
            
            // hsje（含税金额）= je（金额）+ se（税额）
            BigDecimal hsje = je.add(se);
            
            // 红字发票金额为负数
            if ("1".equals(request.getInvoiceFlag())) {
                je = je.negate();
                se = se.negate();
                hsje = hsje.negate();
                quantity = quantity.negate();
            }
            
            totalAmount = totalAmount.add(je);
            totalTax = totalTax.add(se);
            
            SdfpkjRequest.FpmxItem item = new SdfpkjRequest.FpmxItem();
            // 处理dylzfpmxxh字段：蓝字发票时为空，红字发票时填写
            if ("0".equals(request.getInvoiceFlag())) {
                item.setDylzfpmxxh(""); // 蓝字发票必须为空
            } else if ("1".equals(request.getInvoiceFlag())) {
                item.setDylzfpmxxh(detail.getOriginalDetailNo() != null ? detail.getOriginalDetailNo() : ""); // 红字发票填写对应蓝字发票明细序号
            }
            item.setMxxh(String.valueOf(index++));
            item.setSpfwjc(detail.getProductShortName());
            item.setXmmc(detail.getItemName());
            item.setHwhyslwfwmc(detail.getGoodsName());
            item.setGgxh(detail.getSpecification());
            item.setDw(detail.getUnit());
            item.setSl(quantity.stripTrailingZeros().toPlainString());
            item.setDj(unitPrice.stripTrailingZeros().toPlainString());
            item.setJe(je.toPlainString());
            item.setSlv(taxRate.toPlainString());
            item.setSe(se.toPlainString());
            item.setHsje(hsje.toPlainString());
            item.setSphfwssflhbbm(detail.getTaxClassificationCode());
            item.setFphxz("00");
            item.setYhzcbs(""); // 统一默认为空字符串
            
            fpmxList.add(item);
        }
        
        sdfpkjRequest.setFpmxList(fpmxList);
        
        // 金额信息
        sdfpkjRequest.setHjje(totalAmount.toString());
        sdfpkjRequest.setHjse(totalTax.toString());
        sdfpkjRequest.setJshj(totalAmount.add(totalTax).toString());
        
        // 其他信息
        sdfpkjRequest.setKpr(request.getDrawer());
        sdfpkjRequest.setSkrxm(request.getPayee());
        sdfpkjRequest.setFhrxm(request.getReviewer());
        sdfpkjRequest.setBz(request.getRemark());
        sdfpkjRequest.setSfzsxsfyhzhbq("N");
        sdfpkjRequest.setSfzsgmfyhzhbq("N");
        
        // 红字发票信息
        if ("1".equals(request.getInvoiceFlag())) {
            sdfpkjRequest.setDylzfphm(request.getOriginalInvoiceNo());
            sdfpkjRequest.setHzqrxxdbh(request.getRedConfirmNo());
            sdfpkjRequest.setHzqrduuid(request.getRedConfirmUuid());
        }
        
        return sdfpkjRequest;
    }
    
    /**
     * 构建红字确认单申请请求
     */
    private RedConfirmRequest buildRedConfirmRequest(InvoiceRequestDTO request, StationInvoiceConfig config) {
        RedConfirmRequest redRequest = new RedConfirmRequest();
        
        redRequest.setLrfsf("0"); // 销方
        redRequest.setXsfnsrsbh(config.getTaxpayerId());
        redRequest.setXsfmc(config.getStationName());
        redRequest.setGmfnsrsbh(request.getBuyerTaxNo());
        redRequest.setGmfmc(request.getBuyerName());
        redRequest.setLzfphm(request.getOriginalInvoiceNo());
        redRequest.setSfzzfpbz("N");
        redRequest.setLzkprq(request.getOriginalInvoiceDate());
        redRequest.setLzfppzDm(request.getInvoiceType());
        redRequest.setLzfpTdyslxDm("1".equals(request.getProductType()) ? "01" : "");
        redRequest.setChyyDm(request.getReverseReasonCode());
        
        // 计算总金额和税额
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        
        List<RedConfirmRequest.HzqrdmxItem> hzqrdmxList = new ArrayList<>();
        int index = 1;
        
        for (InvoiceRequestDTO.InvoiceDetailDTO detail : request.getDetails()) {
            // 设置精度为6位小数以避免计算误差
            BigDecimal quantity = detail.getQuantity().setScale(6, RoundingMode.HALF_UP);
            BigDecimal unitPrice = detail.getUnitPrice().setScale(6, RoundingMode.HALF_UP);
            BigDecimal taxRate = detail.getTaxRate();
            
            // 按照百旺要求的计算逻辑
            // je（金额）= dj（单价）× sl（数量）
            BigDecimal je = quantity.multiply(unitPrice).setScale(2, RoundingMode.HALF_UP);
            
            // se（税额）= je（金额）× slv（税率）
            BigDecimal se = je.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
            
            totalAmount = totalAmount.add(je);
            totalTax = totalTax.add(se);
            
            RedConfirmRequest.HzqrdmxItem item = new RedConfirmRequest.HzqrdmxItem();
            item.setLzmxxh(detail.getOriginalDetailNo());
            item.setXh(String.valueOf(index++));
            // 税收商品编码优先从税率配置取（未删除的最新一条），否则回退到传入的taxClassificationCode
            String spbm = detail.getTaxClassificationCode();
            if (detail.getProductCode() != null && !detail.getProductCode().isEmpty()) {
                TaxRateConfig cfg = taxRateConfigMapper.selectLatestActiveByStationAndProduct(request.getMerchantId(), detail.getProductCode());
                if (cfg != null && cfg.getSpbm() != null && !cfg.getSpbm().isEmpty()) {
                    spbm = cfg.getSpbm();
                }
            }
            item.setSphfwssflhbbm(spbm);
            item.setHwhyslwfwmc(detail.getGoodsName());
            item.setSpfwjc(detail.getProductShortName());
            item.setXmmc(detail.getItemName());
            item.setGgxh(detail.getSpecification());
            item.setDw(detail.getUnit());
            item.setFpspdj(unitPrice.stripTrailingZeros().toPlainString());
            item.setFpspsl("-" + quantity.stripTrailingZeros().toPlainString());
            item.setJe("-" + je.toPlainString());
            item.setSl1(taxRate.toPlainString());
            item.setSe("-" + se.toPlainString());
            
            hzqrdmxList.add(item);
        }
        
        redRequest.setLzhjje(totalAmount.toString());
        redRequest.setLzhjse(totalTax.toString());
        redRequest.setHzcxje("-" + totalAmount.toString());
        redRequest.setHzcxse("-" + totalTax.toString());
        redRequest.setHzqrdmxList(hzqrdmxList);
        
        return redRequest;
    }
    
    /**
     * 调用百旺API
     */
    private String callBaiwangApi(BaiwangRequest request, StationInvoiceConfig config) {
        try {
            if (config.getApiUrl() == null || config.getApiUrl().trim().isEmpty()) {
                throw new IllegalArgumentException("Baiwang apiUrl must not be blank");
            }
            String requestJson = JSONUtil.toJsonStr(request);
            // 记录请求参数（加密前）
            log.info("[Baiwang] request method=POST url={} params={}", config.getApiUrl(), requestJson);
            
            // 加密请求
            String encryptedRequest = encrypt(config.getPrivateKey(), config.getPublicKey(), requestJson);
            
            // 构建请求头
            String usernameBase64 = Base64.encode(config.getUsername() == null ? "" : config.getUsername());
            String accountBase64 = Base64.encode(config.getAccount() == null ? "" : config.getAccount());
            String maskedAuth = mask(usernameBase64);
            String maskedAccount = mask(accountBase64);
            
            // 发送请求
            HttpRequest httpRequest = HttpRequest.post(config.getApiUrl())
                    .body(encryptedRequest)
                    .header("Authorization", usernameBase64)
                    .header("account", accountBase64)
                    .contentType("text/plain;charset=utf-8");
            log.info("[Baiwang] http request -> method=POST, url={}, headers={{Authorization:{}, account:{}, Content-Type:{}}}",
                    config.getApiUrl(), maskedAuth, maskedAccount, "text/plain;charset=utf-8");

            HttpResponse httpResponse = httpRequest.execute();
            int status = httpResponse.getStatus();
            String encryptedResponse = httpResponse.body();
            log.info("[Baiwang] http response <- status={} bodyLength={}", status, encryptedResponse == null ? 0 : encryptedResponse.length());
            
            // 解密响应
            String response = decrypt(config.getPrivateKey(), config.getPublicKey(), encryptedResponse);
            log.debug("[Baiwang] decrypted response: {}", response);
            
            return response;
        } catch (Exception e) {
            log.error("调用百旺API失败", e);
            throw new RuntimeException("调用百旺API失败：" + e.getMessage());
        }
    }
    
    private String mask(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }
        int len = value.length();
        if (len <= 4) {
            return "****";
        }
        return value.substring(0, 2) + "****" + value.substring(len - 2);
    }
    
    /**
     * SM2加密
     */
    private String encrypt(String privateKey, String publicKey, String data) {
        SM2 sm2 = SmUtil.sm2(Base64.decode(privateKey), Base64.decode(publicKey));
        return sm2.encryptBcd(data, KeyType.PublicKey);
    }
    
    /**
     * SM2解密
     */
    private String decrypt(String privateKey, String publicKey, String data) {
        SM2 sm2 = SmUtil.sm2(Base64.decode(privateKey), Base64.decode(publicKey));
        return sm2.decryptStrFromBcd(data, KeyType.PrivateKey);
    }
}