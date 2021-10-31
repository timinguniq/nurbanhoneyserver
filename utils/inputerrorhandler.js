// input 데이터 값 에러 핸들러(필수 입력 값들 중 하나라도 null이거나 undefined면 에러를 출력한다.)
module.exports = async (inputArray) => {
    let result = false;
    for(let i = 0 ; i < inputArray.length ; i++){
        let value = inputArray[i];
        if(value === null || value === undefined){
            result = true;
            break;
        }
    }
    return result
}
