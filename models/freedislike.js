// 자유 게시판 싫어요 테이블
module.exports = (sequelize, DataTypes) => {
    const free_dislike = sequelize.define("free_dislike", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
    },{
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "free_dislike", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    free_dislike.associate = models => {
      /**
       * FreeBoard모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
       free_dislike.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});

       // articleId 칼럼은 작성자의 Free1Board id값
       free_dislike.belongsTo(models.freeboard, {foreignKey: "articleId", sourceKey: 'id'});
    };
    
    return free_dislike;
  };
