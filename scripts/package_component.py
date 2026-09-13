"""Create and byte-verify a deterministic, runtime-only installation ZIP."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parent.parent
about = json.loads((root / 'about.json').read_text(encoding='utf-8'))
name = about['about_url'].rstrip('/').rsplit('/', 1)[-1]
files = [root / 'about.json']
if (root / 'settings.yml').exists(): files.append(root / 'settings.yml')
for directory in ['common', 'desktop', 'mobile', 'javascripts', 'locales', 'migrations']:
    if (root / directory).exists():
        files += [path for path in (root / directory).rglob('*') if path.is_file()]
dist = root / 'dist'
dist.mkdir(exist_ok=True)
archive = dist / f"{name}-{about['theme_version']}-candidate.zip"
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as output:
    for path in sorted(files):
        info = zipfile.ZipInfo(path.relative_to(root).as_posix(), (1980, 1, 1, 0, 0, 0))
        info.create_system = 3
        info.external_attr = 0o100644 << 16
        info.compress_type = zipfile.ZIP_DEFLATED
        output.writestr(info, path.read_bytes())
with zipfile.ZipFile(archive) as check:
    assert set(check.namelist()) == {path.relative_to(root).as_posix() for path in files}
    for path in files: assert check.read(path.relative_to(root).as_posix()) == path.read_bytes()
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
archive.with_suffix('.zip.sha256').write_text(f'{digest}  {archive.name}\n', encoding='utf-8')
print(f'{archive.name}: {digest}; {len(files)} runtime files verified')
