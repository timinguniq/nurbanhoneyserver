// 회원 테이블
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
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
        defaultValue: "https://nurbanhoneyprofile.s3.ap-northeast-2.amazonaws.com/badge/0.png",
        comment: "배지 이미지 주소(URL)"
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: "닉네임",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "프로필 설명",
      },
      point: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        allowNull: false,
        comment: "포인트 (글쓰기나 베팅을 통한 포인트 적립)",
      },
      insigniaShow: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "휘장(보여주는 휘장)",
      },
      insigniaOwn: {
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
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "User", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    User.associate = models => {
      /**
       * User안에 있는 "id값"을 "userId라는 컬럼 이름"으로 NurbanBoard모델에 새로운 컬럼으로 추가한다.
       */      
      User.hasOne(models.NurbanBoard, {foreignKey: "userId", sourceKey: 'id'});

      User.hasOne(models.NurbanComment, {foreignKey: "userId", sourceKey: 'id'});

      User.hasOne(models.NurbanLike, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});
    
      User.hasOne(models.NurbanDislike, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      User.hasOne(models.Rank, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      User.hasOne(models.NoticeLike, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      User.hasOne(models.NoticeDislike, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});

      User.hasOne(models.Notice, {foreignKey: {name: "userId", allowNull: false}, sourceKey: 'id'});
    };
    
    return User;
  };
