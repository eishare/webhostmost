#!/bin/bash

DOMAIN="$1"
if [ -z "$DOMAIN" ]; then
  echo "Usage: bash vless.sh yourdomain.com"
  exit 1
fi

UUID=$(cat /proc/sys/kernel/random/uuid)
PORT=2052
PATH="/$(echo $UUID | cut -c1-8)"

mkdir -p ~/vless
cat > ~/vless/config.json <<EOF
{
  "log": {
    "level": "info"
  },
  "inbounds": [
    {
      "type": "vless",
      "listen": "0.0.0.0",
      "listen_port": $PORT,
      "users": [
        {
          "uuid": "$UUID"
        }
      ],
      "transport": {
        "type": "ws",
        "path": "$PATH"
      }
    }
  ],
  "outbounds": [
    { "type": "direct" },
    { "type": "block", "tag": "block" }
  ]
}
EOF

# Download sing-box (x86_64)
wget -O ~/vless/sing-box.tar.gz https://github.com/SagerNet/sing-box/releases/latest/download/sing-box-1.7.3-linux-amd64.tar.gz
tar -xzf ~/vless/sing-box.tar.gz -C ~/vless
mv ~/vless/sing-box*/sing-box ~/vless/sing-box
chmod +x ~/vless/sing-box

# Start the service
pkill -f sing-box
nohup ~/vless/sing-box run -c ~/vless/config.json >/dev/null 2>&1 &

echo ""
echo "==============================="
echo "  VLESS 节点部署成功"
echo "==============================="
echo "域名: $DOMAIN"
echo "UUID: $UUID"
echo "WebSocket PATH: $PATH"
echo "本地监听端口: $PORT"
echo ""
echo "注意：请在 Cloudflare 启用代理（橙色云）"
echo ""
echo "=== 客户端节点信息 ==="
echo ""
echo "vless://$UUID@$DOMAIN:443?encryption=none&security=tls&type=ws&host=$DOMAIN&path=$PATH#VLESS-CF"
