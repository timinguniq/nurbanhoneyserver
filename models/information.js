// 이용약관이나 개인정보 처리방침 같은 정보를 가지고 있는 테이블
module.exports = (sequelize, DataTypes) => {
    const information = sequelize.define("information", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "타입형, 0이면 이용약관, 1이면 개인정보 처리방침",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "내용",
      },
    }, {
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "information", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    return information;
  };
