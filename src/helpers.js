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

export function sortQuery(sorter) {
    if (sorter.order === 'descend') {
        return `-${sorter.field}`;
    }
    return sorter.field;
}

export function generatePassword(len = 8) {
    let password = "";
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%?";
    for (let i = 0; i < len; i++) {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return password;
}

export default {
    formatResponseValidatorFields,
    getBase64,
    sortQuery,
    generatePassword
};
