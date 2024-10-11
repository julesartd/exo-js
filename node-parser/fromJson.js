import axios from 'axios';
import {promises as fs} from 'node:fs';
import Papa from 'papaparse';
import xlsx from "json-as-xlsx";

async function getFormat() {
    const readlineSync = await import('readline-sync');
    return readlineSync.default.question("Veuillez saisir le format de sortie (json/csv/excel) :\n");
}

async function getData() {
    try {
        const response = await axios.get('https://random-data-api.com/api/v2/users?size=10');
        return response.data;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function createJsonFile(data) {
    const json = JSON.stringify(data, null, 2);
    await fs.writeFile('files/fromJson/data.json', json);
    console.log('JSON file created successfully.');
}

function filterData(data) {
    return data.map(({employment, address, credit_card, subscription, ...rest}) => rest);
}

function jsonToCsv(data) {
    const filteredData = filterData(data);
    return Papa.unparse(filteredData);
}

function jsonToExcel(data) {
    const filteredData = filterData(data);
    const columns = Object.keys(filteredData[0]).map(key => ({label: key, value: key}));
    const jsonSheet = {
        sheet: 'Sheet1', columns: columns, content: filteredData
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
    await fs.writeFile('files/fromJson/data.csv', csv);
    console.log('CSV file created successfully.');
}

async function createExcelFile(data) {
    const excelBuffer = jsonToExcel(data);
    await fs.writeFile('files/fromJson/data.xlsx', excelBuffer);
    console.log('Excel file created successfully.');
}

async function main() {
    const format = (await getFormat()).toLowerCase();

    const data = await getData();

    switch (format) {
        case 'json':
            console.log('Format JSON');
            await createJsonFile(data);
            break;
        case 'csv':
            console.log('Format CSV');
            await createCsvFile(data);
            break;
        case 'excel':
            console.log('Format Excel');
            await createExcelFile(data);
            break;
        default:
            console.log('Format inconnu');
            break;
    }
    console.log('Format de sortie :', format);
}

main().then(() => null);