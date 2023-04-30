// 포탈 게시판 댓글 테이블
module.exports = (sequelize, DataTypes) => {
    const total_comment = sequelize.define("total_comment", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      board: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        allowNull: false,
        comment: "보드 종류 0이면 너반꿀, 1이면 자유게시판",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "내용",
      },
    },{
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "total_comment", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    total_comment.associate = models => {
      /**
       * TotalComment모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
       total_comment.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});

       // articleId 칼럼은 작성자의 TotalBoard id값
       total_comment.belongsTo(models.totalboard, {as: "location", foreignKey: "articleId", sourceKey: 'id'});
    };
    
    return total_comment;
  };
