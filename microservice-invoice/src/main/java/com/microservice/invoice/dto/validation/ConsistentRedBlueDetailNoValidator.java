package com.microservice.invoice.dto.validation;

import com.microservice.invoice.dto.InvoiceRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ConsistentRedBlueDetailNoValidator implements ConstraintValidator<ConsistentRedBlueDetailNo, InvoiceRequestDTO> {

    @Override
    public boolean isValid(InvoiceRequestDTO value, ConstraintValidatorContext context) {
        if (value == null || value.getDetails() == null) {
            return true;
        }

        boolean isRed = "1".equals(value.getInvoiceFlag());
        boolean ok = true;

        for (InvoiceRequestDTO.InvoiceDetailDTO d : value.getDetails()) {
            String originalDetailNo = d.getOriginalDetailNo();
            if (!isRed) {
                // 蓝字：必须为空
                if (originalDetailNo != null && !originalDetailNo.isEmpty()) {
                    ok = false;
                    break;
                }
            } else {
                // 红字：必须有值且不超过8位
                if (originalDetailNo == null || originalDetailNo.isEmpty() || originalDetailNo.length() > 8) {
                    ok = false;
                    break;
                }
            }
        }

        if (!ok) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "当invoiceFlag为0（蓝字）时，originalDetailNo必须为空；当invoiceFlag为1（红字）时，originalDetailNo必须填写且不超过8位"
            ).addConstraintViolation();
        }

        return ok;
    }
}

