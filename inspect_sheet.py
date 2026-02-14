import csv
import urllib.request
import io

url = "https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957"

try:
    print(f"Downloading CSV from {url}...")
    response = urllib.request.urlopen(url)
    data = response.read().decode('utf-8')
    
    print("Download successful.")
    
    # Parse CSV
    reader = csv.reader(io.StringIO(data))
    headers = next(reader)
    print("Headers found:", headers)
    
    # Print first row to see data format
    first_row = next(reader)
    print("First row:", first_row)
    
except Exception as e:
    print(f"Error: {e}")
