import { promises as fs } from 'node:fs';
import Papa from 'papaparse';
import xlsx from "json-as-xlsx";
import puppeteer from 'puppeteer';

async function getFormat() {
    const readlineSync = await import('readline-sync');
    return readlineSync.default.question("Veuillez saisir le format de sortie (json/csv/excel) :\n");
}

async function getData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto('https://endoflife.date/nodejs');
        await page.waitForSelector('table');

        const data = await page.evaluate(() => {
            const table = document.querySelector('table');
            const rows = Array.from(table.querySelectorAll('tr'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                return cells.map(cell => cell.innerText);
            });
        });
        await browser.close();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        await browser.close();
    }
}

function parseDataToJson(data) {
    const keys = data.shift();
    let values = data;
    values = data.map(row => {
        return row.reduce((acc, value, index) => {
            acc[keys[index]] = value;
            return acc;
        }, {});
    });
    console.log(values);
    return values;
}

async function createJsonFile(data) {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile('files/fromHtml/data.json', json);
    console.log('JSON file created successfully.');
}

function jsonToCsv(data) {
    return Papa.unparse(data);
}

function jsonToExcel(data) {
    const columns = Object.keys(data[0]).map(key => ({ label: key, value: key }));
    const jsonSheet = {
        sheet: 'Sheet1', columns: columns, content: data
    };
    const settings = {
        fileName: 'data', extraLength: 3, writeOptions: {
            type: 'buffer'
        }
    };
    return xlsx([jsonSheet], settings);
}

async function createCsvFile(data) {
    const csv = jsonToCsv(data);
    await fs.writeFile('files/fromHtml/data.csv', csv);
    console.log('CSV file created successfully.');
}

async function createExcelFile(data) {
    const excelBuffer = jsonToExcel(data);
    await fs.writeFile('files/fromHtml/data.xlsx', excelBuffer);
    console.log('Excel file created successfully.');
}

async function main() {
    const format = (await getFormat()).toLowerCase();

    const data = await getData();
    const jsonData = parseDataToJson(data);

    switch (format) {
        case 'json':
            console.log('Format JSON');
            await createJsonFile(jsonData);
            break;
        case 'csv':
            console.log('Format CSV');
            await createCsvFile(jsonData);
            break;
        case 'excel':
            console.log('Format Excel');
            await createExcelFile(jsonData);
            break;
        default:
            console.log('Format inconnu');
            break;
    }
    console.log('Format de sortie :', format);
}

main().then(() => null);