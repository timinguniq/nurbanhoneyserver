// 공지사항 싫어요 테이블
module.exports = (sequelize, DataTypes) => {
    const NoticeDislike = sequelize.define("NoticeDislike", {
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
      tableName: "NoticeDislike", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    NoticeDislike.associate = models => {
      /**
       * NoticeDislike모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
       NoticeDislike.belongsTo(models.User, {foreignKey: "userId", sourceKey: 'id'});

       // noticeId 칼럼은 작성자의 Notice id값
       NoticeDislike.belongsTo(models.Notice, {foreignKey: "noticeId", sourceKey: 'id'});
    };
    
    return NoticeDislike;
  };