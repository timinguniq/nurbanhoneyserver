// 회원 테이블
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      authority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "권한 지금은 0(유저), 1(운영자)"
      },
      loginType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "login Type(kakao, google, email)",
      },
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: "이메일 또는 간편 로그인 토큰",
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "비밀번호",
      },
      badge: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue: "https://nurbanhoneyprofile3.s3.ap-northeast-2.amazonaws.com/badge/0.png",
        comment: "배지 이미지 주소(URL)"
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "닉네임",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "프로필 설명",
      },
      point: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: "포인트 (글쓰기나 베팅을 통한 포인트 적립)",
      },
      bookmark: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "휘장(전체 소장한 휘장)"
      },
      totalLossCut: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
        comment: "전체 손절액"
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "라스트 로그인 시간",
      },
    }, {
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "user", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    user.associate = models => {
      /**
       * User안에 있는 "id값"을 "userId라는 컬럼 이름"으로 NurbanBoard모델에 새로운 컬럼으로 추가한다.
       */      
      user.hasOne(models.totalboard, {foreignKey: "userId", sourceKey: 'id'});
      
      user.hasOne(models.total_comment, {foreignKey: "userId", sourceKey: 'id'});

      user.hasOne(models.total_like, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});
   
      user.hasOne(models.total_dislike, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'}); 

      user.hasOne(models.rank, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      user.hasOne(models.notice_like, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      user.hasOne(models.notice_dislike, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      user.hasOne(models.notice, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      user.hasOne(models.notice_comment, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      user.hasOne(models.insignia, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});
    };
    
    return user;
  };
