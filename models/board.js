// 앱에 모든 게시판 테이블
module.exports = (sequelize, DataTypes) => {
    const board = sequelize.define("board", {
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
        comment: "타입형, 공지사항 0 기본 게시판 1 너반꿀 2",
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
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "board", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    return board;
  };
