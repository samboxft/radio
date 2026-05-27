# Autonomous Royalty-Free Radio (Deploy Package)

This package boots a publishable internet radio stack:

- `icecast` on `:8000` (stream output)
- `liquidsoap` (playout engine + queue switching)
- `orchestrator` on `:8088` (queue API + hourly job stub)
- `web` on `:8081` (public player)

## 1) Required content policy

Place only royalty-free tracks with explicit internet streaming rights in:

- `assets/music/`
- `assets/fallback/`
- `assets/news/news_stub.mp3` (optional placeholder)

## 2) Deploy to Ubuntu VPS

Run on the VPS:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Copy this folder to the VPS (from your local machine):

```bash
scp -r ./radio2 user@YOUR_VPS_IP:/opt/radio2
```

Start services:

```bash
cd /opt/radio2
sudo docker compose up -d --build
```

Open firewall:

```bash
sudo ufw allow 8000/tcp
sudo ufw allow 8081/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable
```

## 3) Public URLs

- Stream: `http://YOUR_VPS_IP:8000/radio.mp3`
- Player UI: `http://YOUR_VPS_IP:8081`
- Orchestrator health: `http://YOUR_VPS_IP:8088/healthz`

## 4) Queue examples

Enqueue a music track:

```bash
curl -X POST http://YOUR_VPS_IP:8088/enqueue \
  -H "Content-Type: application/json" \
  -d '{"queue":"music_queue","file_path":"music/example.mp3"}'
```

Enqueue top-of-hour news:

```bash
curl -X POST http://YOUR_VPS_IP:8088/enqueue \
  -H "Content-Type: application/json" \
  -d '{"queue":"toth_news","file_path":"news/news_stub.mp3"}'
```

## 5) What to replace next

- Replace `hourly_news_stub` in `orchestrator/app.py` with your real pipeline (news API + LLM + TTS).
- Add a DB-backed selector for strict 24h no-repeat and artist/album density caps.
- Rotate `assets/music/` by global indie + modern royalty-free catalogs.
