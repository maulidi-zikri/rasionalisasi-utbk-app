
with open('c:/Users/IP330.290/Downloads/rasionalisasi_utbk/index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

count = 0
for i, line in enumerate(lines[:160]):
    opens = line.count('<div')
    closes = line.count('</div')
    count += (opens - closes)
    if opens > 0 or closes > 0:
        print(f"Line {i+1}: {opens} opens, {closes} closes. Current balance: {count}")
