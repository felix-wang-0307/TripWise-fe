export function findInsertionId(sortedData, newData, selector = (item) => item) {
    let start = 0;
    let end = sortedData.length;

    while (start < end) {
        const mid = Math.floor((start + end) / 2);
        if (selector(newData) > selector(sortedData[mid])) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return start;
};