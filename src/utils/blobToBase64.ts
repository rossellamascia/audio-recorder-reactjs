export const blobToBase64 = (url: string): Promise<string | ArrayBuffer | null> => {
    return new Promise(async (resolve, _) => {
        // do a request to the blob uri
        const response = await fetch(url);

        // response has a method called .blob() to get the blob file
        const blob = await response.blob();

        // instantiate a file reader
        const fileReader = new FileReader();

        // read the file
        fileReader.readAsDataURL(blob);

        fileReader.onloadend = function () {
            resolve(fileReader.result); // Here is the base64 string
        }
    });
};