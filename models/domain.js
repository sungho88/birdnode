const Sequelize = require("sequelize");

module.exports = class Domain extends (
  Sequelize.Model
) {
  static init(sequelize) {
    return super.init(
      {
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM("free", "premium"),
          allowNull: false,
        },
        clientSecret: {
          type: Sequelize.STRING(36),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, //createdAt, updatedAt이 자동으로 생성
        modelName: "Domain",
        tableName: "domains",
        paranoid: false, // deletedAt이 자동으로 생성
      }
    );
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
};
