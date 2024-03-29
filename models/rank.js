// 랭크 게시판 테이블
module.exports = (sequelize, DataTypes) => {
    const rank = sequelize.define("rank", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      totalLossCut: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: "랭크 토탈 손실액",
      },
      totalLikeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "랭크 토탈 좋아요 수(인정 수)",
      }
    }, {
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "rank", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    rank.associate = models => {
      /**
       * Rank모델 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */
       // userId 칼럼은 작성자의 User id값
       rank.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});
    };
    
    return rank;
  };
