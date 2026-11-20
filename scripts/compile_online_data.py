import csv, gzip, json, os, sys
from collections import OrderedDict
from openpyxl import load_workbook

csv_path = sys.argv[1]
out_dir = sys.argv[2]
source_xlsx = sys.argv[3]
os.makedirs(out_dir, exist_ok=True)

with open(csv_path, 'r', encoding='utf-8-sig', newline='') as f:
    reader = csv.reader(f)
    columns = next(reader)
    files = {}
    counts = {}
    first_last = {}
    try:
        for n, row in enumerate(reader, 1):
            if len(row) < len(columns):
                row += [''] * (len(columns) - len(row))
            year = row[8] or 'unknown'
            try:
                month = int(row[9])
                quarter = (month - 1) // 3 + 1
            except (ValueError, TypeError):
                quarter = 0
            key = f'{year}-Q{quarter}'
            if key not in files:
                path = os.path.join(out_dir, f'{key}.json.gz')
                gz = gzip.open(path, 'wt', encoding='utf-8', newline='')
                gz.write('{"year":' + json.dumps(key, ensure_ascii=False) + ',"columns":' + json.dumps(columns, ensure_ascii=False, separators=(',', ':')) + ',"rows":[')
                files[key] = [gz, True, path]
                counts[key] = 0
            gz, first, path = files[key]
            if not first:
                gz.write(',')
            gz.write(json.dumps(row, ensure_ascii=False, separators=(',', ':')))
            files[key][1] = False
            counts[key] += 1
            first_last.setdefault(key, [row[5], row[5]])[1] = row[5]
            if n % 100000 == 0:
                print(f'processed {n:,} rows', flush=True)
    finally:
        for gz, _, _ in files.values():
            gz.write(']}')
            gz.close()

sheets = []
wb = load_workbook(source_xlsx, read_only=True, data_only=True)
for name in ['Methodology', 'Color Legend']:
    ws = wb[name]
    rows = [[v for v in row] for row in ws.iter_rows(values_only=True)]
    sheets.append({'name': name, 'rows': rows})
manifest = {
    'title': 'NIFTY 50 1-minute Panchang Data 2015–2026',
    'sourceFile': os.path.basename(source_xlsx),
    'totalRows': sum(counts.values()),
    'columns': columns,
    'years': [{'year': key, 'path': f'online-data/{os.path.basename(path)}', 'rows': counts[key], 'first': first_last[key][0], 'last': first_last[key][1]} for key, (_, _, path) in sorted(files.items())],
    'sheets': sheets
}
with open(os.path.join(out_dir, 'manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
print(json.dumps({'rows': manifest['totalRows'], 'chunks': len(manifest['years'])}, ensure_ascii=False))
