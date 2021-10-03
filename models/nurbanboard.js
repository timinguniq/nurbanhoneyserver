// 너반꿀 게시판 테이블
module.exports = (sequelize, DataTypes) => {
    const NurbanBoard = sequelize.define("NurbanBoard", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      thumbnail: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "썸네일 이미지 주소",
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "제목",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "내용",
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "조회수",
      },
      commentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "댓글 갯수",
      },
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "좋아요 수",
      },
      dislikeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "싫어요 수",
      },
    }, {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "NurbanBoard", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    NurbanBoard.associate = models => {
      /**
       * NurbanBoard모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
       NurbanBoard.belongsTo(models.User, {foreignKey: "userId", sourceKey: 'id'});
    };
    
    return NurbanBoard;
  };
