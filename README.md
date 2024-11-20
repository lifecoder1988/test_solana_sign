# test_solana_sign



## 基本流程

使用nodejs 20以上版本



1. 部署合约 contract.rs
2. 安装依赖 npm install
3. 启动server node server
4. 执行client  node client.mjs


## client设置

.env  client.mjs 的配置文件

```
SERVER_ACCOUNT_ADDRESS=EDpmAyjTrsiuHHdgexZMjCvCt7LVd7bWrAVFDavS9PsW // 服务端account的公钥

PROGRAM_ID=5tBeqTQRrMqnPX8QKSYmmdVKUBHufgAVe5h62dWcsHKd //合约的ID

```

idl.json 合约的idl接口描述

client_account.json 发起交易的人的私钥

## server 设置

server_account.json 支付fee的私钥


## 注意

server account 需要有余额 。 如果没有的话 通过cli命令 转一笔给它

solana transfer EDpmAyjTrsiuHHdgexZMjCvCt7LVd7bWrAVFDavS9PsW  1 --allow-unfunded-recipient


## 其他

solana-keygen new --outfile account.json // 创建solana账号 （如果这个账号上没钱，账号其实不存在）

solana-keygen pubkey account.json //查询账户的公钥