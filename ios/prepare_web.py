#!/usr/bin/env python3
"""Stage an offline Web folder before XcodeGen or an Xcode build."""
from pathlib import Path
import base64
import json
import shutil

ROOT = Path(__file__).resolve().parent.parent
web = ROOT / 'ios' / 'Web'
web.mkdir(exist_ok=True)
html = (ROOT / 'index.html').read_text()
html = html.replace('<script>', '<script src="audio-bundle.js"></script><script>', 1)
(web / 'index.html').write_text(html)
for name in ['privacy.html', 'support.html', 'manifest.webmanifest']:
    shutil.copy2(ROOT / name, web / name)
shutil.copytree(ROOT / 'assets', web / 'assets', dirs_exist_ok=True)
audio = {p.stem: base64.b64encode(p.read_bytes()).decode('ascii') for p in (ROOT / 'assets').glob('*.wav')}
(web / 'audio-bundle.js').write_text('window.__BUNDLED_AUDIO__=' + json.dumps(audio) + ';')
print('Staged offline Web content and', len(audio), 'audio files')
