// 앱에 모든 게시판 테이블
module.exports = (sequelize, DataTypes) => {
    const Board = sequelize.define("Board", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "게시판 이름 ex) 너반꿀, 자유",
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "게시판 핵심 주소 ex)nurban, free",
      },
    }, {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Board", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    return Board;
  };
