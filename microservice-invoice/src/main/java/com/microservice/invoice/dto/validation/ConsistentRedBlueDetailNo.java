package com.microservice.invoice.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * 校验 invoiceFlag 与明细 originalDetailNo 的一致性：
 * invoiceFlag=0（蓝字）时，所有明细 originalDetailNo 必须为空；
 * invoiceFlag=1（红字）时，所有明细 originalDetailNo 必须非空且不超过8位。
 */
@Documented
@Constraint(validatedBy = ConsistentRedBlueDetailNoValidator.class)
@Target({TYPE})
@Retention(RUNTIME)
public @interface ConsistentRedBlueDetailNo {

    String message() default "当invoiceFlag为0（蓝字）时，originalDetailNo必须为空；当invoiceFlag为1（红字）时，originalDetailNo必须填写";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

