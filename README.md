# MarketWise-Hackathon

wget https://github.com/bluenviron/mediamtx/releases/download/v1.15.6/mediamtx_v1.15.6_linux_amd64.tar.gz
tar -xvf mediamtx_v1.15.6_linux_amd64.tar.gz
cd mediamtx
./mediamtx


ffmpeg -f v4l2 -i /dev/video0 \
  -vcodec libx264 -preset ultrafast -tune zerolatency \
  -f rtsp rtsp://127.0.0.1:8554/webcam

ffplay rtsp://127.0.0.1:8554/webcam
