module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User",{
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: { 
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: false,
    },
  });

     User.associate = ( models)=>{
      User.hasMany(models.Message, { foreignKey:{ allowNull:false}, onDelete: 'SET NULL'});
      User.hasMany(models.Commentaire, {foreignKey:{allowNull:false }, onDelete: 'SET NULL'});
      User.hasMany(models.Like,{ foreignKey:{ allowNull:false}, onDelete: 'SET NULL'});
    } 
  return User;
};


