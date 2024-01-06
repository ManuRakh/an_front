
const statusesRu = ['Отправлено', 'В процессе', 'На проверке', 'Подтверждено'];
const statusesEn = ['scheduled', 'processing', 'review', 'approved'];

const convertStatusToEn = (status) => {
    for (let i = 0; i < statusesEn.length; i++) {
        if (status === statusesRu[i]) return statusesEn[i];
    }

    return status;
}

const convertStatusToRu = (status) => {
    for (let i = 0; i < statusesEn.length; i++) {
        if (status === statusesEn[i]) return statusesRu[i];
    }

    return status;
}

export {
    convertStatusToRu,
    convertStatusToEn,
}