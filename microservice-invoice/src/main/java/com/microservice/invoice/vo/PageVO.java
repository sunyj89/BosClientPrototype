package com.microservice.invoice.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/**
 * 分页响应VO
 *
 * @author yangyang
 * @date 2025-01-18
 */
@Data
@Schema(description = "分页响应数据")
public class PageVO<T> {
    
    @Schema(description = "当前页码", example = "1")
    private Integer page;
    
    @Schema(description = "每页数量", example = "10")
    private Integer pageSize;
    
    @Schema(description = "总记录数", example = "100")
    private Long total;
    
    @Schema(description = "总页数", example = "10")
    private Integer totalPages;
    
    @Schema(description = "数据列表")
    private List<T> list;
    
    /**
     * 构建分页响应
     */
    public static <T> PageVO<T> of(Integer page, Integer pageSize, Long total, List<T> list) {
        PageVO<T> vo = new PageVO<>();
        vo.setPage(page);
        vo.setPageSize(pageSize);
        vo.setTotal(total);
        vo.setTotalPages((int) Math.ceil((double) total / pageSize));
        vo.setList(list);
        return vo;
    }
}