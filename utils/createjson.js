// json 만드는 메서드
module.exports = (name, valueList) => {
    let resultObject = new Object({});
    resultObject[name] = valueList;
    return resultObject;
}