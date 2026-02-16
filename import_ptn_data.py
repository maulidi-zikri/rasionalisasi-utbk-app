import csv
import json
import urllib.request
import io

URL = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"
OUTPUT_FILE = "ptn_data.js"

def fetch_csv(url):
    print(f"Fetching CSV from {url}...")
    with urllib.request.urlopen(url) as response:
        return response.read().decode('utf-8')

def parse_csv(csv_content):
    print("Parsing CSV...")
    f = io.StringIO(csv_content)
    reader = csv.reader(f)
    
    headers = []
    data = {}
    
    # Locate header row
    uni_idx = -1
    prodi_idx = -1
    jenjang_idx = -1
    
    row_count = 0
    start_parsing = False
    
    for row in reader:
        row_count += 1
        if not row: continue
        
        # Header detection logic
        if not start_parsing:
            # Check if this row looks like a header
            row_upper = [c.upper().strip() for c in row]
            if "UNIVERSITAS" in row_upper and "PROGRAM STUDI" in row_upper:
                print(f"Found header at row {row_count}")
                try:
                    uni_idx = row_upper.index("UNIVERSITAS")
                    prodi_idx = row_upper.index("PROGRAM STUDI")
                    if "JENJANG" in row_upper:
                        jenjang_idx = row_upper.index("JENJANG")
                    start_parsing = True
                    continue
                except ValueError:
                    continue
        
        if start_parsing:
            if len(row) <= max(uni_idx, prodi_idx): continue
            
            uni = row[uni_idx].strip()
            prodi = row[prodi_idx].strip()
            jenjang = row[jenjang_idx].strip() if jenjang_idx != -1 and len(row) > jenjang_idx else ""
            
            if not uni or uni.upper() == "UNIVERSITAS": continue
            if not prodi: continue
            
            # Clean Uni Name
            uni = uni.replace('"', '').strip()
            
            # Key Formatting
            if uni not in data:
                data[uni] = set()
            
            # Prodi Formatting
            formatted_prodi = prodi
            if jenjang and jenjang.upper() in ["D3", "D4", "D1", "D2"]:
                formatted_prodi = f"{prodi} ({jenjang})"
            
            data[uni].add(formatted_prodi)
            
    return data

def main():
    try:
        csv_content = fetch_csv(URL)
        parsed_data = parse_csv(csv_content)
        
        # Convert to final structure
        result_list = []
        for uni in sorted(parsed_data.keys()):
            prodis = sorted(list(parsed_data[uni]))
            result_list.append({
                "university": uni,
                "prodis": prodis
            })
            
        print(f"Processed {len(result_list)} universities.")
        
        # Write to JS file
        js_content = f"const masterDataPTN = {json.dumps(result_list, indent=4)};"
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(js_content)
            
        print(f"Successfully wrote data to {OUTPUT_FILE}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
