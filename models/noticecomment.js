// 공지사항 게시판 댓글 테이블
module.exports = (sequelize, DataTypes) => {
    const notice_comment = sequelize.define("notice_comment", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
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
      tableName: "notice_comment", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    }) ;
    
    notice_comment.associate = models => {
      /**
       * Notice모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
       notice_comment.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});

       // noticeId 칼럼은 작성자의 Notice id값
       notice_comment.belongsTo(models.notice, {foreignKey: "noticeId", sourceKey: 'id'});
    };
    
    return notice_comment;
  };