// 토탈 게시판 테이블
module.exports = (sequelize, DataTypes) => {
    const totalboard = sequelize.define("totalboard", {
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
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "이미지 uuid",
      },
      thumbnail: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "",
        comment: "썸네일 이미지 주소",
      },
      title: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: "제목",
      },
      lossCut: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
        comment: "손실액",
      },
      reflectLossCut: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: "손실액이 User(totalLossCut)에 반영여부",
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
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "totalboard", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    totalboard.associate = models => {
      /**
       * TotalBoard모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */
       // userId 칼럼은 작성자의 User id값
       totalboard.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});

      /**
       * TotalBoard안에 있는 "id값"을 "articleId라는 컬럼 이름"으로 TotalComment모델에 새로운 컬럼으로 추가한다.
       */      
      totalboard.hasOne(models.total_comment, {foreignKey: "articleId", sourceKey: 'id'});

      /**
       * TotalBoard안에 있는 "id값"을 "articleId라는 컬럼 이름"으로 TotalLike모델에 새로운 컬럼으로 추가한다.
       */
      totalboard.hasOne(models.total_like, {foreignKey: "articleId", sourceKey: 'id'});

      /**
       * TotalBoard안에 있는 "id값"을 "articleId라는 컬럼 이름"으로 TotalDislike모델에 새로운 컬럼으로 추가한다.
       */      
      totalboard.hasOne(models.total_dislike, {foreignKey: "articleId", sourceKey: 'id'});
    };
    
    return totalboard;
  };
