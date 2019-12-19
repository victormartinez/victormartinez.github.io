---
layout: post
title: "Docker"
categories: [DevOps]
tags: [docker, container, devops]
image: 
on_post: false
toc: true
featured: true
---

# Dia 1

lxc: linux container (o que deu o start no docker)
chroot: separação de disco

Isolamento lógico:
  processos, usuários, rede, mount point

  |- Isolamento feito pelos namespaces

Isolamento físico (recurso): 
  cpu, memório, taxa de i/o (disco/rede)

  |- Isolamento feito pelos cGoups


Images:
  - Camadas
  - Não faça várias instruções RUN dentro do Dockerfile senão ele vai criar várias camadas
    - Ao executar um container somente a última camada é Read Write. As demais (abaixo) são apenas Read.
      - Se você precisar escrever em um arquivo que está nas camadas debaixo, o Docker vai fazer uma cópia desse arquivo para
        a camada superior para que eu possa escrever.
      - Copy on Write

    - Por que o docker não deixa você alterar a imagem?
      - O docker usa apenas 1 imagem para todos os containers. Dado 10 containers, o docker não faz 10 cópias da imagem. Ele usa a mesma imagem.
      - Isso garante que todos os containers rodem com a mesma informação. Somente a última camada que pode ser alterada (e.g. logs) em tempo de execução.


      - RUN apt-get install ...
      - RUN apt-get clean   (não vai funcionar pq ele não vai conseguir apagar os arquivos da camada anterior)

    - 1 img 500 mb
      - 10 containers == 500mb (é a mesma imagem)
    - As imagens são compartilhadas entre os containers em execução!


Container:
  - Usa o kernel do próprio host (10 containers vão usar o kernel do host)
  - Diferente da VM que cada VM tem um novo SO



iptables: comando para interagir com o Netfilter
Regras de rede, filtro de pacotes e redirects no Docker é feito por iptables que interage com o Netfilter
Por exemplo: como saber que uma request da internet vai chegar em qual container? iptables gerencia isso.


Tipos de Namespaces:
- pid: isolamento de processos
- net namespace: isolamento de rede (ith0)
- mnit: gerenciamento dos mountpoints
- utc, itc, etc...

CGroups (criado pelo google)
- Isolamento de disco, cpu, memória, etc.


Docker Client: CLI
Docker Server (daemon): quem vai gerenciar os containers
- vc pode ter um server com docker na AWS e com o CLI conectar nele


curl -fsSL https://get.docker.com | bash


docker container ls
docker container ls -a
docker image ls
docker container run -it ubuntu
docker container attach <id-or-name>


Entrypoint: principal processo do container
Ctrl + D: mata o principal processo. No caso como era o bash, matou o processo. Como ele é o entrypoint, o docker matou o container.
Ctrl + PQ: sai do container sem matar o container.


Quando eu faço um docker run -it <imagem> automaticamente o docker vai se conectar no entrypoint do container. No caso do ubuntu, como é o bash, vc vai ter acesso ao bash.
Porém, tem vezes que fazemos isso em outra imagem (por exemplo nginx) e parece que fica travado. Isso ocorre porque o container não tem como entrypoint o bash, mas sim o próprio
processo do nginx. Aí, nesse momento você está conectado ao processo do nginx. Todo processo que está em execução dentro do container precisa estar em Foreground (1o plano).
Não é possível deixar um comando de entrypoint em execução em background (como daemon) (não dá pra rodar o nginx via systemctl ou algo do tipo pq vai ficar em background).

O attach vai se conectar no processo principal.


docker container run -d nginx
- rodar o container como daemon


Existem casos, como o nginx, que você precisar ter um terminal mas o entrypoint não é um terminal. Então, usamos o exec:
- docker container exec -it <id-do-container>



Experimento interessante:
docker container run -d nginx
docker container exec -it <container-nginx> bash
ctrl+d => não mata o container pois eu pedi para executar o bash que NÃO é o entrypoint.



### docker container run hello-world
### docker image ls
### docker ps
### docker container ls
### docker container ls -a
### docker container run -ti centos:7
### docker container run -ti ubuntu
### docker container -d nginx
### docker container attach [CONTAINER ID]
### docker container exec -ti [CONTAINER ID] [COMANDO]
### docker container start [CONTAINER ID]
### docker container stop [CONTAINER ID]
### docker container restart [CONTAINER ID]
### docker container pause [CONTAINER ID]
### docker container unpause [CONTAINER ID]
### docker container inspect [CONTAINER ID]
### docker container logs -f [CONTAINER ID]
### docker container rm [CONTAINER ID]
### docker container rm -f [CONTAINER ID]
### docker container stats [CONTAINER ID]
### docker container top [CONTAINER ID]
### docker container run -d -m 64M nginx
### docker container update --memory 64M --cpus 0.4 nginx
### docker container update -m 64M --cpus 0.4 nginx

### docker image ls
### docker image build
### docker image build -t toskeira:1.0 .

stress --cpu 1 --vm-bytes 128M --vm 1

[CONTAINER ID] pode ser os três primeiros caracteres

DIFERENÇA ENTRE STOP E PAUSE:
- PAUSE manda um SIGSTOP e o container usa o cgroup para fazer freeze dos processos.
- STOP manda um SIGTERM e termina a execução do processo principal. Depois de um grace period, manda um SIGKILL.



```
FROM debian

LABEL app="Girpops"

ENV NAME="Victor"

RUN apt-get update && apt-get install -y stress && apt-get clean

CMD stress --cpu 1 --vm-bytes 64M --vm 1

```

RUN roda no momento de construção da imagem
CMD roda depois que o container está up

# Dia 2

Volume: 
  você está pegando um pedaço do seu filesystem e disponibilizando para o container.
  Você não está criando um disco propriamente dito.

Tipos:
  Bind: Eu já tenho um diretório e quero montá-lo dentro do container.
  Volume: Quando você cria o diretório (dockerfile)


src => source
dst => destination
### docker container run -it --mount type=bind,src=~/opt/giropops,dst=/giropops debian

docker: Error response from daemon: invalid mount config for type "bind": invalid mount path: '~/giropops' mount path must be absolute.


ro = read only
### docker container run -it --mount type=bind,src=~/opt/giropops,dst=/giropops,ro debian
### docker volume ls
### docker volume create <VOLUME>
### docker volume inspect <VOLUME>

Todo e qualquer volume no docker estará em:
/var/lib/docker/volumes/2bd7f3f60864e8e1b5525091fe59cdccbee175c0b160198bb6c8e5e9f06d3a8e/_data

### docker volume create giropops
### docker container run -it --mount type=volume,src=giropops,dst=/giropops debian
### docker container exec -it <container-debian> touch /giropops/teste.txt
### docker volume ls
### docker volume rm <VOLUME>

Apaga todos os volumes que não estiver sendo utilizado por pelo menos 1 container (tome cuidado)
### docker volume prune 
### docker container prune 


Comandos antigos:
### docker container create -v /data --name dbdados centos
### docker container run -d -p 5432:5432 --name psql1 --volumes-from dbdados -e POSTGRESQL_USER=docker -e POSTGRESQL_PASS=docker -e POSTGRESQL_DB=docker kamui/postgresql
### docker container run -d -p 5433:5432 --name psql2 --volumes-from dbdados -e POSTGRESQL_USER=docker -e POSTGRESQL_PASS=docker -e POSTGRESQL_DB=docker kamui/postgresql


docker container create vs run
- Create não coloca em execução, apenas cria.

Em um cluster, dado um volume, por default o docker não replica os dados. O volume do node1 podem ter dados diferentes do volume montado no node 2. Diferente do k8s, que monta um volume em todos os hosts.


### docker container run -it --mount type=volume,src=giropops,dst=/data --mount type=bind,src=/opt/backup,dst=/backup debian tar -cvf /backup/bkp-banco.tar /data

### docker container run -ti --mount type=bind,src=/volume,dst=/volume ubuntu
### docker container run -ti --mount type=bind,src=/root/primeiro_container,dst=/volume ubuntu
### docker container run -ti --mount type=bind,src=/root/primeiro_container,dst=/volume,ro ubuntu
### docker volume create giropops
### docker volume rm giropops
### docker volume inspect giropops
### docker volume prune
### docker container run -d --mount type=volume,source=giropops,destination=/var/opa  nginx
### docker container create -v /data --name dbdados centos
### docker run -d -p 5432:5432 --name pgsql1 --volumes-from dbdados -e POSTGRESQL_USER=docker -e POSTGRESQL_PASS=docker -e POSTGRESQL_DB=docker kamui/postgresql
### docker run -d -p 5433:5432 --name pgsql2 --volumes-from dbdados -e  POSTGRESQL_USER=docker -e POSTGRESQL_PASS=docker -e POSTGRESQL_DB=docker kamui/postgresql
### docker run -ti --volumes-from dbdados -v $(pwd):/backup debian tar -cvf /backup/backup.tar /data





