export default function normalizeData(data, keyName = "id") {
    const res = {};
    data.forEach((entry) => {
        res[entry[keyName]] = { ...entry };
    });
    return res;
}
