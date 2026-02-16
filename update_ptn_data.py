import csv
import json
import requests
import io

# URLs
MASTER_URL = "https://docs.google.com/spreadsheets/d/1k40Z02rfLG-m-T953Ko5qO5af78U9OJym1LJ3e-LLk0/export?format=csv&gid=1068323031"
STATS_URL = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

def fetch_csv(url):
    print(f"Downloading CSV from {url}...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        return list(csv.DictReader(io.StringIO(response.content.decode('utf-8'))))
    except Exception as e:
        print(f"Error fetching CSV: {e}")
        return []

def clean_min_score(score):
    if not score or score.lower().strip() == "no data":
        return "belum ada data"
    # Try to keep it as is, or simplify if needed. 
    # The requirement says "jika datanya isinya 'No data' ubah statusnya menjadi 'belum ada data'"
    return score.strip()

def fetch_and_process_data():
    master_data_rows = fetch_csv(MASTER_URL)
    stats_data_rows = fetch_csv(STATS_URL)
    
    # Create lookup dictionary for stats data
    # Key: (University Name, Major Name) -> Row Data (with normalized keys)
    stats_lookup = {}
    for row in stats_data_rows:
        # Normalize keys for this row
        normalized_row = {}
        for k, v in row.items():
            if k:
                # Remove newlines and extra spaces from key upper case
                norm_key = k.replace('\n', ' ').strip()
                while '  ' in norm_key:
                    norm_key = norm_key.replace('  ', ' ')
                normalized_row[norm_key] = v
        
        uni = normalized_row.get('UNIVERSITAS', '').strip()
        prodi = normalized_row.get('PROGRAM STUDI', '').strip()
        if uni and prodi:
            stats_lookup[(uni, prodi)] = normalized_row

    universities = {}
    
    print("Processing and merging data...")
    for row in master_data_rows:
        uni_name = row.get('UNIVERSITAS', '').strip()
        prodi_name = row.get('PROGRAM STUDI', '').strip()
        jenjang = row.get('JENJANG', '').strip()
        
        if not uni_name or not prodi_name:
            continue
            
        # Initialize with Master Data (Source 1) as fallback/base
        # Master headers: PROVINSI,UNIVERSITAS,PROGRAM STUDI,% KEKETATAN 2025,JENJANG,DAYA TAMPUNG 2025,PEMINAT 2024,PORTOFOLIO,% PENERIMAAN 2024
        
        # Default values from Master (if available)
        daya_tampung = row.get('DAYA TAMPUNG 2025', '').strip()
        peminat = row.get('PEMINAT 2024', '').strip()
        keketatan = row.get('% KEKETATAN 2025', '').strip()
        portofolio_raw = row.get('PORTOFOLIO', '').strip()
        portofolio = None if portofolio_raw == 'Tidak Ada' else portofolio_raw
        
        min_score = "belum ada data"

        # Try to find in stats source (Source 2)
        # Targeted Columns based on User Request:
        # 1. "DAYA TAMPUNG 2025 (SNBT)" -> for dayaTampung
        # 2. "PEMINAT 2024 (SNBT)" -> for peminat
        # 3. "%PENERIMAAN SNBT 2025" -> for keketatan
        # 4. "Perkiraan Minimum Skor UTBK" -> for minScore
        
        key = (uni_name, prodi_name)
        if key in stats_lookup:
            stats_row = stats_lookup[key]
            
            # Extract stats from Source 2 using normalized keys
            dt_s2 = stats_row.get("DAYA TAMPUNG 2025 (SNBT)", "").strip()
            pem_s2 = stats_row.get("PEMINAT 2024 (SNBT)", "").strip()
            ket_s2 = stats_row.get("%PENERIMAAN SNBT 2025", "").strip()
            
            min_score_raw = stats_row.get("Perkiraan Minimum Skor UTBK", "").strip()
            
            # Use Source 2 data if available (overwrite master data)
            if dt_s2: daya_tampung = dt_s2
            if pem_s2: peminat = pem_s2
            if ket_s2: keketatan = ket_s2
            
            if min_score_raw:
                if min_score_raw.lower() == "no data":
                    min_score = "belum ada data"
                else:
                    min_score = min_score_raw
        
        # Structure for JSON
        if uni_name not in universities:
            universities[uni_name] = []
            
        universities[uni_name].append({
            "name": prodi_name,
            "jenjang": jenjang,
            "dayaTampung": daya_tampung,
            "peminat": peminat,
            "keketatan": keketatan,
            "portofolio": portofolio,
            "minScore": min_score
        })
    
    # Convert to list for final JSON
    master_data = []
    for uni in sorted(universities.keys()):
        # Sort prodis by name
        prodis = sorted(universities[uni], key=lambda x: x['name'])
        master_data.append({
            "university": uni,
            "prodis": prodis
        })
        
    # Generate JS file content
    js_content = f"const masterDataPTN = {json.dumps(master_data, indent=4)};\n"
    
    # Write to file
    output_path = "c:/Users/IP330.290/Downloads/rasionalisasi_utbk/ptn_data.js"
    with open(output_path, "w", encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Successfully updated {output_path} with {len(master_data)} universities.")

if __name__ == "__main__":
    fetch_and_process_data()
