---
layout: post
title: "Nginx + Certbox straight to the point"
categories: [Web Development]
tags: [nginx, certbot, https, reverse proxy]
image: /assets/images/highlights/nginx_and_certbot.png
on_post: false
toc: true
featured: true
---

Working in a team with no DevOps expertise forces you to manage to get things done regarding infrastructure. We had to install and configure a [RabbitMQ](https://www.rabbitmq.com/) instance behind a [Nginx](https://www.nginx.com/) with HTTPS. This is a straighforward post on how to install and configure the reverse proxy with [Let's Encrypt](https://letsencrypt.org).

## Nginx
In this tutorial Nginx works as a Reverse Proxy by forwarding external requests from the Internet to the internal service. Let's get started.

**1. Create an `A` record in your DNS provider:**

| Type |     Name    | Content       | TTL  |
|:----:|:-----------:|---------------|------|
|   A  | yourwebsite | 123.456.78.91 | Auto |


**2. Install Nginx and enable it:**

```bash
sudo apt-get install nginx-full
sudo systemctl enable nginx
```

Manage your nginx instance with the commands below:

```bash
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl status nginx
```


**3. Create a configuration file in the directory** `/etc/nginx/sites-available/`**. A nice pattern is to name the file according to the DNS of your service:**

```bash
/etc/nginx/sites-available/yourwebsite.com
```


**4. Replace the content below according to your necessities:**

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
          proxy_pass   http://<YOUR-DNS>:<PORT>;
          proxy_set_header   Host   $host;
          proxy_set_header   X-Real-IP  $remote_addr;
          proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

**5. Create a symbolic link to the sites-enabled folder:**

```bash
sudo ln -s /etc/nginx/sites-available/<your-filename> /etc/nginx/sites-enabled/<your-filename>
```


**6. Load the configuration and check the status:**

```bash
sudo systemctl reload nginx
sudo systemctl status nginx
```

The output below illustrates that our Nginx is working properly (sensitive data was ommited).

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
To enable HTTPS on your website, you need to get a certificate from a Certificate Authority (CA). We can use Let's Encrypt and the Certbot client to setup the environment.


**1. Install Certbot with nginx plugin:**

```bash
sudo apt-get install python-certbot-nginx
```

**2. Execute certbot passing your domain as parameter:**

```bash
sudo certbot --nginx -d <YOUR-DOMAIN>
``` 

**3. Ensure autorenew is configured in the Linux cronjob:**

```bash
cat /etc/cron.d/certbot
```

Voilà!


## Links
You might find useful the links below:

* [https://certbot.eff.org/](https://tecadmin.net/auto-renew-lets-encrypt-certificates/)
* [https://techmonger.github.io/49/certbot-auto-renew/](https://tecadmin.net/auto-renew-lets-encrypt-certificates/)
* [https://tecadmin.net/auto-renew-lets-encrypt-certificates/](https://tecadmin.net/auto-renew-lets-encrypt-certificates/)
