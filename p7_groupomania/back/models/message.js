module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message",{
    title: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: { 
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    likes: { 
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikes: { 
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

  });
     Message.associate = ( models)=>{ Message.belongsTo( models.User);
     Message.hasMany(models.Commentaire, { foreignKey:{allowNull:false},onDelete: 'CASCADE'});
     Message.hasMany(models.Like, {foreignKey:{allowNull:false},onDelete: ' CASCADE'});
    } 
  return Message;
};
