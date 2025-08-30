package com.microservice.invoice.mapper;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.microservice.invoice.entity.StationInvoiceConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 油站发票配置 Mapper 接口
 *
 * @author yangyang
 * @date 2025-01-15
 */
@Mapper
public interface StationInvoiceConfigMapper extends BaseMapper<StationInvoiceConfig> {

    /**
     * 检查指定商户在给定时间范围内是否存在时间冲突的配置
     *
     * @param stationId 商户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param excludeId 排除的配置ID（编辑时需要排除当前配置）
     * @return 冲突的配置数量
     */
    int countTimeConflicts(@Param("stationId") Long stationId, 
                          @Param("startTime") LocalDateTime startTime,
                          @Param("endTime") LocalDateTime endTime,
                          @Param("excludeId") Long excludeId);

    /**
     * 根据商户ID和当前时间获取生效的配置
     *
     * @param stationId 商户ID
     * @param currentTime 当前时间
     * @return 生效的配置
     */
    StationInvoiceConfig getActiveConfig(@Param("stationId") Long stationId, 
                                       @Param("currentTime") LocalDateTime currentTime);

    /**
     * 根据商户ID获取配置列表（支持状态筛选）
     *
     * @param stationId 商户ID
     * @param status 状态（pending/active/expired）
     * @param currentTime 当前时间
     * @return 配置列表
     */
    List<StationInvoiceConfig> getConfigsByStatus(@Param("stationId") Long stationId,
                                                @Param("status") String status,
                                                @Param("currentTime") LocalDateTime currentTime);

    /**
     * 根据商户ID查询一条配置（默认取最新一条）
     *
     * @param stationId 商户ID
     * @return 配置
     */
    default StationInvoiceConfig selectOneByStationId(Long stationId) {
        return this.selectOne(new LambdaQueryWrapper<StationInvoiceConfig>()
                .eq(StationInvoiceConfig::getMerchantId, stationId)
                .orderByDesc(StationInvoiceConfig::getId)
                .last("limit 1"));
    }

    /**
     * 根据商户ID查询一条“生效中的且未删除”的配置（默认取最新一条）
     * 生效条件：start_time <= now 且 (end_time is null 或 end_time >= now)
     * 未删除条件：deleted = false
     *
     * @param stationId 商户ID
     * @return 生效配置
     */
    default StationInvoiceConfig selectActiveByStationId(Long stationId) {
        LocalDateTime now = LocalDateTime.now();
        return this.selectOne(new LambdaQueryWrapper<StationInvoiceConfig>()
                .eq(StationInvoiceConfig::getMerchantId, stationId)
                .eq(StationInvoiceConfig::getDeleted, Boolean.FALSE)
                .le(StationInvoiceConfig::getStartTime, now)
                .and(q -> q.isNull(StationInvoiceConfig::getEndTime)
                        .or()
                        .ge(StationInvoiceConfig::getEndTime, now))
                .orderByDesc(StationInvoiceConfig::getId)
                .last("limit 1"));
    }
}