# Optional chapter recordings

The experience ships an original browser-generated ambient score. Sound is off by default. Enable it in the header, or use the explicit bell or drum interaction; it can be muted again in the header. The Mahalaya scene is an original visual tribute to Mahishasura Mardini, not a replay of broadcast audio or footage.

To use your own recordings, add these files:

- `01-agomoni.mp3` — Mahalaya
- `02-pandal.mp3` — Shashti
- `03-saptami.mp3` — Saptami
- `04-anjali.mp3` — Ashtami
- `05-dhak.mp3` — Navami
- `06-bijoya.mp3` — Dashami

Set `NEXT_PUBLIC_USE_CHAPTER_AUDIO=true` in `.env.local` before starting or building. Without that flag no recording requests are made. The ambient score remains available if an optional recording cannot play.
