#!/bin/bash
# 启动脚本：AI生成朋友圈素材 (Mac)

# 获取当前脚本所在目录
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================="
echo "      AI生成朋友圈素材 - 启动脚本"
echo "=========================================="
echo ""

# 1. 检测 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js！"
    echo "请先安装 Node.js: https://nodejs.org/"
    read -p "按任意键退出..."
    exit 1
fi

echo "环境正常: Node.js 已安装"
echo ""

# 2. 启动服务
echo "正在启动服务器..."
# 在后台启动 node
node server.js &
PID=$!

# 等待几秒确保服务器启动
sleep 2

# 3. 打开浏览器
echo "正在打开浏览器..."
open "http://localhost:3000"

echo ""
echo "=========================================="
echo "      程序运行中 (关闭窗口将停止服务)"
echo "=========================================="
echo ""

# 等待后台进程结束 (保持窗口打开)
wait $PID
