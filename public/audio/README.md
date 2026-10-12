# Optional chapter recordings

The experience ships an original browser-generated ambient score. Sound starts from the Begin the journey gesture and can be muted in the header.

To use your own recordings, add these files:

- `01-agomoni.mp3` — Mahalaya
- `02-pandal.mp3` — Shashti
- `03-dhak.mp3` — Ashtami
- `04-sindoor.mp3` — Navami
- `05-bijoya.mp3` — Dashami

Set `NEXT_PUBLIC_USE_CHAPTER_AUDIO=true` in `.env.local` before starting or building. Without that flag no recording requests are made. The ambient score remains available if an optional recording cannot play.
