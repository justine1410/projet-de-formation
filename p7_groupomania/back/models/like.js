module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define("Like",{
      like: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
    });
  
      Like.associate = ( models)=>{
        Like.belongsTo( models.User);
        Like.belongsTo( models.Message);
  
      }
    return Like;
  };