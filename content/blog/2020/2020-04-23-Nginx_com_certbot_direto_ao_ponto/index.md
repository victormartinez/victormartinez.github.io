---
layout: post
title: "Nginx + Certbox: direto ao ponto"
category: DevOps
tags: [nginx, certbot, https, reverse proxy]
image: featured.png
date: "2020-04-23T00:00:00"

---

Trabalhar em uma equipe sem experiência em DevOps obriga você a gerenciar para fazer as coisas em relação à infraestrutura. Tivemos que instalar e configurar uma instância do [RabbitMQ](https://www.rabbitmq.com/) atrás de um [Nginx](https://www.nginx.com/) com HTTPS. Esta é uma postagem direta sobre como instalar e configurar o proxy reverso com [Let's Encrypt](https://letsencrypt.org).

## Nginx

Neste tutorial, o Nginx funciona como um proxy reverso, encaminhando solicitações externas da Internet para o serviço interno. Vamos começar.

**1. Crie um registro `A` em seu provedor de DNS:**

| Type |    Name     | Content       | TTL  |
| :--: | :---------: | ------------- | ---- |
|  A   | yourwebsite | 123.456.78.91 | Auto |

**2. Instale o Nginx e habilite-o:**

```bash
sudo apt-get install nginx-full
sudo systemctl enable nginx
```

Gerencie a sua instância do nginx com os comandos abaixo:

```bash
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl status nginx
```

**3. Crie um arquivo de configuração no diretório** `/etc/nginx/sites-available/`**. Um bom padrão é nomeá-lo de acordo com o DNS do seu serviço:**

```bash
/etc/nginx/sites-available/yourwebsite.com
```

**4. Substitua o conteúdo abaixo de acordo com suas necessidades:**

```text
server {
  server_name <YOUR-DNS>;
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;
  location / {
          client_body_buffer_size 128k;
          proxy_send_timeout   90;
          proxy_read_timeout   90;
          proxy_buffer_size    4k;
          proxy_buffers     16 32k;
          proxy_busy_buffers_size 64k;
          proxy_temp_file_write_size 64k;
          proxy_connect_timeout 30s;
          proxy_pass   http://<YOUR-LOCAL>:<PORT>;
          proxy_set_header   Host   $host;
          proxy_set_header   X-Real-IP  $remote_addr;
          proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

**5. Crie um link simbólico para o diretório sites-enabled:**

```bash
sudo ln -s /etc/nginx/sites-available/<your-filename> /etc/nginx/sites-enabled/<your-filename>
```

**6. Carregue a configuração e cheque o status:**

```bash
sudo systemctl reload nginx
sudo systemctl status nginx
```

A saída abaixo ilustra que nosso Nginx está funcionando corretamente (dados sensíveis foram omitidos).

```text
 nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Tue 2019-08-13 18:18:09 UTC; 3 months 7 days ago
     Docs: man:nginx(8)
 Main PID: 6027 (nginx)
    Tasks: 5 (limit: 4915)
   CGroup: /system.slice/nginx.service
           ├─5198 nginx: worker process
           ├─5199 nginx: worker process
           ├─5200 nginx: worker process
           ├─5201 nginx: worker process
           └─6027 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;

Aug 13 18:18:09 systemd[1]: Starting A high performance web server and a reverse proxy server...
Aug 13 18:18:09 systemd[1]: Started A high performance web server and a reverse proxy server.
Aug 13 18:53:04 systemd[1]: Reloading A high performance web server and a reverse proxy server.
Aug 13 18:53:04 systemd[1]: Reloaded A high performance web server and a reverse proxy server.
Aug 13 18:58:21 systemd[1]: Reloading A high performance web server and a reverse proxy server.
Aug 13 18:58:21 systemd[1]: Reloaded A high performance web server and a reverse proxy server.
```

## Certbot

Para permitir HTTPs no seu website você precisa ter um certificado de um Autoridade Certificadora (CA - Certificate Authority). Nós podemos usar o Let's Encrypt e o cliente do Certbot para configurar o ambiente.

**1. Instale o Certbot com o plugin do Nginx:**

```bash
sudo apt-get install python-certbot-nginx
```

**2. Execute o certbot passando seu domínio como parâmetro:**

```bash
sudo certbot --nginx -d <YOUR-DOMAIN>
```

**3. Garanta que a renovação automática está configurada no cronjob do Linux:**

```bash
cat /etc/cron.d/certbot
```

Voilà!

## Links

Você pode achar útil os links abaixo:

- [Certbot.org](https://tecadmin.net/auto-renew-lets-encrypt-certificates/)
- [Techmonger: Certbot Auto Renew/](https://tecadmin.net/auto-renew-lets-encrypt-certificates/)
- [Tecadmin: Auto renew lets encrypt certificates](https://tecadmin.net/auto-renew-lets-encrypt-certificates/)
