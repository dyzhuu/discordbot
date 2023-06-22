import { google } from 'googleapis';
import Exec from '../models/Exec';
import Logging from '../library/Logging';
import fs from 'fs';
const spreadsheetId = process.env.SPREADSHEET_ID;
const auth = new google.auth.JWT({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});
const service = google.sheets('v4');

async function createExec(exec: Exec) {
    try {
        await service.spreadsheets.values.append({
            spreadsheetId,
            auth,
            range: 'A2:H',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [Object.values(exec)]
            }
        });
        await writeName();
        return {
            exec
        };
    } catch (error) {
        Logging.error(error);
    }
}

/**
 *
 * @param column the category to filter results by
 * @param value the value to search for
 * @returns array of array of exec details.
 */
async function getExec(column: number, value: string): Promise<Exec[] | void> {
    const range = 'A2:H';
    try {
        const result = await service.spreadsheets.values.get({
            spreadsheetId,
            range,
            auth
        });

        const sheetValues: string[][] = result.data.values!.filter(
            (row) => row[column - 1] === value
        );
        const exec = sheetValues.map((details) => dboToObject(details));

        return exec;
    } catch (error) {
        Logging.error(error);
    }
}

async function getAllExec() {
    const range = 'Sheet1!A2:H30';
    try {
        const result = await service.spreadsheets.values.get({
            spreadsheetId,
            range,
            auth
        });

        const execs = result.data.values!.map((details) =>
            dboToObject(details)
        );

        return;
    } catch (error) {
        Logging.error(error);
    }
}

async function updateExec(exec: Exec) {
    const range = 'A2:H';
    try {
        const nameResults = await service.spreadsheets.values.get({
            spreadsheetId,
            range: 'A2:A',
            majorDimension: 'Columns',
            auth
        });
        const row = nameResults.data.values![0].indexOf(exec.name) + 2;

        const result = await service.spreadsheets.values.update({
            spreadsheetId,
            range: `A${row}:H${row}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [Object.values(exec)]
            },
            auth
        });
    } catch (error) {
        Logging.error(error);
    }
}

async function writeName() {
    const range = 'A2:A';
    try {
        const result = await service.spreadsheets.values.get({
            spreadsheetId,
            range,
            auth
        });
        const data = result.data.values!.flat(1).sort();
        fs.writeFileSync('names.txt', JSON.stringify(data));
        return;
    } catch (error) {
        Logging.error(error);
    }
}

function dboToObject(dbo: string[]): Exec {
    return {
        name: dbo[0],
        role: dbo[1],
        email: dbo[2],
        phoneNumber: dbo[3],
        dietaryRequirements: dbo[4],
        shirtSize: dbo[5],
        yearGraduating: dbo[6],
        degree: dbo[7]
    };
}

export default { writeName, dboToObject, createExec, getExec, updateExec };