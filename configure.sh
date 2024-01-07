sudo apt-get update
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
cd ~
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_armv7.tar.gz
tar -xzvf piper_armv7.tar.gz
cd piper
wget https://papeer.s3.ap-south-1.amazonaws.com/Audio.zip
unzip -j Audio.zip
cd ~/Desktop
git clone https://github.com/vakhariaheet/Smart-Glasses
cd Smart-Glasses
npm install