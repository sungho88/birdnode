const Sequelize = require("sequelize");

module.exports = class Hashtag extends (
  Sequelize.Model
) {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true, //createdAt, updatedAt이 자동으로 생성
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtags",
        paranoid: false, // deletedAt이 자동으로 생성
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  }
};
