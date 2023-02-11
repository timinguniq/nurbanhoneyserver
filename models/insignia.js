// 휘장 테이블
module.exports = (sequelize, DataTypes) => {
    const insignia = sequelize.define("insignia", {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: "id",
      },
      insignia: {
        type: DataTypes.STRING(256),
        allowNull: false,
        comment: "휘장 string으로 표현 ex) insigniaArticle10, insigniaArticle100",
      },
      isShown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "휘장을 보여줄 휘장인지 아닌지 보여주는 필드",
      },
    }, {
      uniqueKeys: {
        actions_unique: {
            fields: ['insignia', 'userId']
        }
      }, 
      freezeTableName: true,
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "insignia", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });
    
    insignia.associate = models => {
      /**
       * Insignia 안에 "userId라는 컬럼 이름"으로 User모델에 있는 "id값"을 새로운 컬럼으로 추가한다.
       */      
       // userId 칼럼은 작성자의 User id값
       insignia.belongsTo(models.user, {foreignKey: "userId", sourceKey: 'id'});
    };
    
    return insignia;
  };
