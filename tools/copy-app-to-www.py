import shutil
from pathlib import Path
root = Path(__file__).resolve().parent.parent
app = root / 'app'
www = root / 'www'
shutil.rmtree(www, ignore_errors=True)
shutil.copytree(app, www)
print('Copied app -> www')
