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

// 에러 json 만드는 메소드
exports.error = (errorValue) => {
    let resultObject = new Object();
    resultObject.error = errorValue;
    return resultObject;
}

// 결과 json 만드는 메소드
exports.result = (resultValue) => {
    let resultObject = new Object();
    resultObject.result = resultValue;
    return resultObject;
}