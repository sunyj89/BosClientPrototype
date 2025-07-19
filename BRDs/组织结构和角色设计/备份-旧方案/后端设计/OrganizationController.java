package com.bosclient.organization.controller;

import com.bosclient.common.result.Result;
import com.bosclient.organization.dto.*;
import com.bosclient.organization.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 组织架构管理控制器
 * @author BosClient Team
 */
@RestController
@RequestMapping("/api/organization")
@Tag(name = "组织架构管理", description = "组织架构、用户管理、角色配置相关接口")
@Validated
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    // ==================== 组织架构管理 ====================

    @GetMapping("/tree")
    @Operation(summary = "获取组织架构树", description = "获取完整的组织架构树形结构")
    public Result<List<OrgTreeNodeDTO>> getOrgTree() {
        return Result.success(organizationService.getOrgTree());
    }

    @GetMapping("/details/{id}")
    @Operation(summary = "获取组织详情", description = "根据组织ID获取组织详细信息")
    public Result<OrgDetailsDTO> getOrgDetails(
            @Parameter(description = "组织ID") @PathVariable Long id) {
        return Result.success(organizationService.getOrgDetails(id));
    }

    @PostMapping("/unit")
    @Operation(summary = "新增组织单元", description = "创建新的组织单元")
    public Result<OrgUnitDTO> addOrgUnit(@Valid @RequestBody AddOrgUnitRequest request) {
        return Result.success(organizationService.addOrgUnit(request));
    }

    @PutMapping("/unit/{id}")
    @Operation(summary = "更新组织单元", description = "更新指定组织单元信息")
    public Result<OrgUnitDTO> updateOrgUnit(
            @Parameter(description = "组织ID") @PathVariable Long id,
            @Valid @RequestBody UpdateOrgUnitRequest request) {
        return Result.success(organizationService.updateOrgUnit(id, request));
    }

    @DeleteMapping("/unit/{id}")
    @Operation(summary = "删除组织单元", description = "删除指定组织单元（需检查是否有子组织和员工）")
    public Result<Void> deleteOrgUnit(@Parameter(description = "组织ID") @PathVariable Long id) {
        organizationService.deleteOrgUnit(id);
        return Result.success();
    }

    @GetMapping("/types")
    @Operation(summary = "获取组织类型列表", description = "获取所有可用的组织类型")
    public Result<List<OrgTypeDTO>> getOrgTypes() {
        return Result.success(organizationService.getOrgTypes());
    }

    @GetMapping("/legal-entities")
    @Operation(summary = "获取法人主体列表", description = "获取所有法人主体信息")
    public Result<List<LegalEntityDTO>> getLegalEntities() {
        return Result.success(organizationService.getLegalEntities());
    }

    // ==================== 用户管理 ====================

    @GetMapping("/users")
    @Operation(summary = "获取用户列表", description = "根据组织ID获取用户列表")
    public Result<List<UserDTO>> getUsersByOrgId(
            @Parameter(description = "组织ID") @RequestParam Long orgId) {
        return Result.success(organizationService.getUsersByOrgId(orgId));
    }

    @PostMapping("/user")
    @Operation(summary = "添加用户", description = "在指定组织下添加新用户")
    public Result<UserDTO> addUser(@Valid @RequestBody AddUserRequest request) {
        return Result.success(organizationService.addUser(request));
    }

    @PutMapping("/user/{id}")
    @Operation(summary = "更新用户信息", description = "更新指定用户的信息")
    public Result<UserDTO> updateUser(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return Result.success(organizationService.updateUser(id, request));
    }

    @DeleteMapping("/user/{id}")
    @Operation(summary = "删除用户", description = "删除指定用户")
    public Result<Void> deleteUser(@Parameter(description = "用户ID") @PathVariable Long id) {
        organizationService.deleteUser(id);
        return Result.success();
    }

    // ==================== 角色管理 ====================

    @GetMapping("/roles")
    @Operation(summary = "获取角色列表", description = "获取所有角色信息")
    public Result<List<RoleDTO>> getRoles() {
        return Result.success(organizationService.getRoles());
    }

    @GetMapping("/role-configurations")
    @Operation(summary = "获取角色配置列表", description = "获取所有角色配置信息")
    public Result<List<RoleConfigurationDTO>> getRoleConfigurations() {
        return Result.success(organizationService.getRoleConfigurations());
    }

    @GetMapping("/role-configuration/{id}")
    @Operation(summary = "获取角色配置详情", description = "根据ID获取角色配置详细信息")
    public Result<RoleConfigurationDTO> getRoleConfiguration(
            @Parameter(description = "角色配置ID") @PathVariable Long id) {
        return Result.success(organizationService.getRoleConfiguration(id));
    }

    @PostMapping("/role-configuration")
    @Operation(summary = "新增角色配置", description = "创建新的角色配置")
    public Result<RoleConfigurationDTO> addRoleConfiguration(
            @Valid @RequestBody AddRoleConfigurationRequest request) {
        return Result.success(organizationService.addRoleConfiguration(request));
    }

    @PutMapping("/role-configuration/{id}")
    @Operation(summary = "更新角色配置", description = "更新指定角色配置")
    public Result<RoleConfigurationDTO> updateRoleConfiguration(
            @Parameter(description = "角色配置ID") @PathVariable Long id,
            @Valid @RequestBody UpdateRoleConfigurationRequest request) {
        return Result.success(organizationService.updateRoleConfiguration(id, request));
    }

    @DeleteMapping("/role-configuration/{id}")
    @Operation(summary = "删除角色配置", description = "删除指定角色配置（系统角色不可删除）")
    public Result<Void> deleteRoleConfiguration(
            @Parameter(description = "角色配置ID") @PathVariable Long id) {
        organizationService.deleteRoleConfiguration(id);
        return Result.success();
    }

    @PostMapping("/role-configuration/{id}/copy")
    @Operation(summary = "复制角色配置", description = "基于现有角色配置创建副本")
    public Result<RoleConfigurationDTO> copyRoleConfiguration(
            @Parameter(description = "源角色配置ID") @PathVariable Long id,
            @Valid @RequestBody CopyRoleConfigurationRequest request) {
        return Result.success(organizationService.copyRoleConfiguration(id, request));
    }

    // ==================== 权限管理 ====================

    @GetMapping("/permissions")
    @Operation(summary = "获取权限定义列表", description = "获取所有系统权限定义")
    public Result<PermissionDefinitionDTO> getPermissions() {
        return Result.success(organizationService.getPermissions());
    }
} 