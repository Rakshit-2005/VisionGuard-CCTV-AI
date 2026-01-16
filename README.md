# MarketWise-Hackathon

wget https://github.com/bluenviron/mediamtx/releases/download/v1.15.6/mediamtx_v1.15.6_linux_amd64.tar.gz
tar -xvf mediamtx_v1.15.6_linux_amd64.tar.gz
cd mediamtx
./mediamtx


ffmpeg -f v4l2 -i /dev/video0 \
  -vcodec libx264 -preset ultrafast -tune zerolatency \
  -f rtsp rtsp://127.0.0.1:8554/webcam

ffplay rtsp://127.0.0.1:8554/webcam

ffmpeg -f dshow -rtbufsize 100M -i video="Chicony USB2.0 Camera" -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p -s 640x480 -r 15 -b:v 1M -f rtsp rtsp://localhost:8554/webcam