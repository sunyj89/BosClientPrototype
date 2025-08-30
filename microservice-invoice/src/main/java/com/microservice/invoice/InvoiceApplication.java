package com.microservice.invoice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.TimeZone;

@SpringBootApplication(
    scanBasePackages = {"com.microservice.invoice", "com.microservice.common"},
    exclude = {
        SecurityAutoConfiguration.class,
        ManagementWebSecurityAutoConfiguration.class
    }
)
public class InvoiceApplication {
    
    static {
        // 设置JVM默认时区为东八区
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Shanghai"));
    }
    
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(InvoiceApplication.class, args);
        Environment env = context.getEnvironment();
        String port = env.getProperty("server.port", "8083");
        String contextPath = env.getProperty("server.servlet.context-path", "");
        String activeProfile = env.getProperty("spring.profiles.active", "default");
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            // ignore
        }
        System.out.println("\n" +
                "   ___   ____ ___ _     \n" +
                "  / _ \\ / __ \\_ _| |    \n" +
                " | | | | |  | | || |    \n" +
                " | |_| | |__| | || |___ \n" +
                "  \\___/ \\____/___|_____|\n" +
                "                          \n");
        System.out.println("=".repeat(80));
        System.out.println("🚀 发票管理服务启动成功！");
        System.out.println("=".repeat(80));
        System.out.println("📋 服务信息:");
        System.out.println("   应用名称: " + env.getProperty("spring.application.name"));
        System.out.println("   运行环境: " + activeProfile);
        System.out.println("   服务端口: " + port);
        System.out.println("   上下文路径: " + contextPath);
        System.out.println();
        System.out.println("🌐 访问地址:");
        System.out.println("   本地访问: http://localhost:" + port + contextPath);
        System.out.println("   网络访问: http://" + hostAddress + ":" + port + contextPath);
        System.out.println();
        System.out.println("📚 API文档:");
        System.out.println("   Swagger UI: http://localhost:" + port + contextPath + "/doc.html");
        System.out.println("   OpenAPI JSON: http://localhost:" + port + contextPath + "/v3/api-docs");
        System.out.println();
        System.out.println("🔍 健康检查:");
        System.out.println("   健康状态: http://localhost:" + port + contextPath + "/actuator/health");
        System.out.println();
        System.out.println("=".repeat(80));
        System.out.println("💡 提示: 按 Ctrl+C 停止服务");
        System.out.println("=".repeat(80));
        System.out.println("🔓 Spring Security已完全禁用，所有接口可直接访问，无需认证");
        System.out.println("=".repeat(80));
    }
} 