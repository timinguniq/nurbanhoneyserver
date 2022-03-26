// 자유 게시판 테이블
module.exports = (sequelize, DataTypes) => {
    const freeboard = sequelize.define("freeboard", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "이미지 uuid",
      },
      thumbnail: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "https://nurbanboard.s3.ap-northeast-2.amazonaws.com/default.png",
        comment: "썸네일 이미지 주소",
      },
      title: {
        type: DataTypes.STRING(256),
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
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "freeboard", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    freeboard.associate = models => {
      /**
       * FreeBoard 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
      freeboard.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});
        
      /**
       * FreeBoard안에 있는 "id값"을 "articleId라는 컬럼 이름"으로 FreeComment모델에 새로운 컬럼으로 추가한다.
       */      
      freeboard.hasOne(models.free_comment, {foreignKey: "articleId", sourceKey: 'id'});

      /**
       * NorbanBoard안에 있는 "id값"을 "articleId라는 컬럼 이름"으로 FreeLike모델에 새로운 컬럼으로 추가한다.
       */      
      freeboard.hasOne(models.free_like, {foreignKey: "articleId", sourceKey: 'id'});

      /**
       * NorbanBoard안에 있는 "id값"을 "articleId라는 컬럼 이름"으로 FreeDislike모델에 새로운 컬럼으로 추가한다.
       */      
      freeboard.hasOne(models.free_dislike, {foreignKey: "articleId", sourceKey: 'id'});
    
    };
    
    return freeboard;
  };
