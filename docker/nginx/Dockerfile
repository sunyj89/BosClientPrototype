FROM 10.0.0.6:58080/weicheche/wcc_base_alpine_nginx:20220331
WORKDIR /data/wwwroot/Bos_Web
COPY . .
COPY docker/nginx/conf   /data/server/nginx/conf
RUN rm -rf /data/wwwroot/hkapp-api && chown www:www /data/wwwroot/Bos_Web
