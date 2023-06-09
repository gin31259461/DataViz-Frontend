import { roundNumberToDecimalPlaces } from './math';

export const convertBigIntToString = (obj: any): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertBigIntToString(item));
  }

  const convertedObj: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'bigint') {
      convertedObj[key] = obj[key].toString();
    } else if (typeof obj[key] === 'object') {
      convertedObj[key] = convertBigIntToString(obj[key]);
    } else {
      convertedObj[key] = obj[key];
    }
  }

  return convertedObj;
};

export const parseJsonFileToObject = (file: File): Promise<object> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const object = JSON.parse(reader.result as string);
        resolve(object);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const convertCsvToFile = (csvString: string) => {
  const csvBlob = new Blob([csvString], { type: 'text/csv' });
  const csvFile = new File([csvBlob], 'data.csv', { type: 'text/csv' });
  return csvFile;
};

export const isValidCsvString = (str: string) => {
  const rows = str.trim().split('\n');

  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split(',');

    for (let j = 0; j < columns.length; j++) {
      const column = columns[j].trim();

      if (column.length === 0) {
        return false;
      }

      if (/^".*"$/.test(column)) {
        // check if ' ' pair
        if (/^".*[^"]$/.test(column) || /^[^"]*"$/.test(column.replace(/""/g, ''))) {
          return false;
        }
      } else {
        // if , or \n exist : use "" wrap the string
        if (column.includes(',') || column.includes('\n')) {
          return false;
        }
      }
    }
  }

  return true;
};

export const objectToNumber = (obj: Record<string, any>): Record<string, number> => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, Number(value)]));
};

export const objectToXYData = (obj: Record<string, any>) => {
  let xyData: Object[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    xyData.push({ x: key, y: Number(value) });
  });
  return xyData;
};

export const numberToStringPercentage = (percentage: number | undefined) => {
  if (!percentage) return '';
  return (roundNumberToDecimalPlaces(percentage, 2) * 100).toFixed(0).toString() + '%';
};
