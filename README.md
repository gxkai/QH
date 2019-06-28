# material-search

> My stylish Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate

# mongodb
$ npm i -g run-rs --unsafe-perm=true --allow-root
$ run-rs --version 4.0.0 --keep

# node
$ node -v
  v10.16.0
#docker
$ docker run --name m0 -p 37017:27017 -d mongo --replSet "rs"
$ docker run --name m1 -p 47017:27017 -d mongo --replSet "rs"
$ docker run --name m2 -p 57017:27017 -d mongo --replSet "rs"
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
db79d86eec50        mongo               "docker-entrypoint..."   About an hour ago   Up About an hour    0.0.0.0:57017->27017/tcp   m2
15796e78e541        mongo               "docker-entrypoint..."   About an hour ago   Up About an hour    0.0.0.0:47017->27017/tcp   m1
589ea9a43964        mongo               "docker-entrypoint..."   About an hour ago   Up About an hour    0.0.0.0:37017->27017/tcp   m0
$ docker exec -it db79d86eec50  /bin/bash
root@db79d86eec50:/#
root@db79d86eec50:/#mongo --host 192.168.73.129 --port 37017
rs:PRIMARY>
rs:PRIMARY>var config={
                _id:"rs",
                members:[
                    {_id:0,host:"192.168.73.129:37017"},
                    {_id:1,host:"192.168.73.129:47017"},
                    {_id:2,host:"192.168.73.129:57017"}
           ]}；
rs:PRIMARY>rs.initiate(config)

rs:PRIMARY>cfg = rs.conf();
rs:PRIMARY>cfg.members[0].host="xxxxxx";
rs:PRIMARY>rs.reconfig(cfg);
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
[run-rs](https://www.npmjs.com/package/run-rs).
[mongodb](https://docs.mongodb.com)
