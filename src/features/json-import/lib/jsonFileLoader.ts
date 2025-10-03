export const loadJsonFromFile = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        resolve(jsonData);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    };

    input.click();
  });
};
