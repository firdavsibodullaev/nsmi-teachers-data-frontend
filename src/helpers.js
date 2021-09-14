export function formatResponseValidatorFields(response, values) {
    const data = {};
    Object.entries(response).map((item) => {
        const value = item[0];
        const messages = item[1];
        data[value] = {
            value: values[value],
            errors: [new Error(messages[0])],
        };
        return this;
    });
    return data;
}

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

export default {
    formatResponseValidatorFields,
    getBase64,
};
