// 하나의 데이터로 Json 만드는 메소드
exports.one = (name, valueList) => {
    let resultObject = new Object();
    resultObject[name] = valueList;
    return resultObject;
}

// 여러 데이터로 Json 만드는 메소드
exports.multi = (name, valueList) => {
    let resultObject = new Object();
    for(let i = 0 ; i < name.length ; i++){
        resultObject[name[i]] = valueList[i];
    }
    return resultObject;
}