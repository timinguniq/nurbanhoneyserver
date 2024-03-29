// 앱 버전 테이블
module.exports = (sequelize, DataTypes) => {
    const appversion = sequelize.define("appversion", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      appversion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "앱버전",
      },
      isUpdate: {
        type: DataTypes.BOOLEAN,
        comment: "업데이트 여부",
      },
    }, {
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "appversion", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    return appversion;
  };
