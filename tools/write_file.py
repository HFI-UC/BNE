import sys
from pathlib import Path
data = sys.stdin.read()
path = Path(sys.argv[1])
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(data, encoding='utf-8')
