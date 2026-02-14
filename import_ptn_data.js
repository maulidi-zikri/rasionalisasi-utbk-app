const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/1eZHfayqypBQ3XRGf5hRMlIaMKiz0OPylow4T891mqSs/export?format=csv&gid=1813610957';

function fetchCSV(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
            res.on('error', (err) => reject(err));
        });
    });
}

function parseCSV(csv) {
    const lines = csv.split(/\r?\n/);
    const result = {};

    // Header is usually around line 2 (0-indexed). 
    // We'll scan for the header line starting with "PROVINSI" or containing "UNIVERSITAS"
    let headerIndex = -1;
    let uniCol = -1;
    let prodiCol = -1;
    let jenjangCol = -1;

    for (let i = 0; i < Math.min(20, lines.length); i++) {
        const line = lines[i];
        if (line.includes('UNIVERSITAS') && line.includes('PROGRAM STUDI')) {
            headerIndex = i;
            const cols = line.split(','); // Simple split for header check
            // Find indices
            cols.forEach((col, idx) => {
                const c = col.toUpperCase().trim();
                if (c === 'UNIVERSITAS') uniCol = idx;
                if (c === 'PROGRAM STUDI') prodiCol = idx;
                if (c === 'JENJANG') jenjangCol = idx;
            });
            break;
        }
    }

    if (uniCol === -1 || prodiCol === -1) {
        console.error("Could not find headers");
        process.exit(1);
    }

    // Parse specific CSV row logic (handling quotes)
    const parseRow = (row) => {
        const res = [];
        let current = '';
        let inQuote = false;
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                res.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        res.push(current.trim());
        return res;
    };

    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line || line.trim() === '') continue;

        const cols = parseRow(line);
        if (cols.length <= Math.max(uniCol, prodiCol)) continue;

        const uni = cols[uniCol]?.replace(/^"|"$/g, '').trim();
        const prodi = cols[prodiCol]?.replace(/^"|"$/g, '').trim();
        const jenjang = jenjangCol !== -1 ? cols[jenjangCol]?.replace(/^"|"$/g, '').trim() : '';

        if (!uni || !prodi || uni.toUpperCase() === 'UNIVERSITAS') continue;

        if (!result[uni]) result[uni] = new Set();

        let formatted = prodi;
        // If Jenjang is D3/D4, append it if not already valid
        if (jenjang && ['D3', 'D4', 'D1', 'D2'].includes(jenjang)) {
            formatted = `${prodi} (${jenjang})`;
        } else if (jenjang && jenjang.startsWith('S1') === false && jenjang !== '') {
            // Handle other cases? S1 is default so we don't add it.
            // Maybe "Sarjana Terapan" -> D4
        }

        // Clean up common dirty data
        formatted = formatted.replace(/""/g, '"');

        result[uni].add(formatted);
    }

    return Object.keys(result).map(key => ({
        university: key,
        prodis: Array.from(result[key]).sort()
    })).sort((a, b) => a.university.localeCompare(b.university));
}

fetchCSV(url).then(csv => {
    const data = parseCSV(csv);
    // Be careful with output size. Console.log might truncate.
    // Better to write to a file.
    const fs = require('fs');
    const content = `const masterDataPTN = ${JSON.stringify(data, null, 4)};`;
    fs.writeFileSync('ptn_data.js', content); // Overwrite existing ptn_data.js
    console.log("Successfully updated ptn_data.js with " + data.length + " universities.");
}).catch(err => {
    console.error("Failed:", err);
});
