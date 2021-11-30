module.exports = (sequelize, DataTypes) => {
  const Commentaire = sequelize.define("Commentaire",{
    content: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    pseudo:{
      type: DataTypes.STRING,
      allowNull: false,

    },
  });

    Commentaire.associate = ( models)=>{
      Commentaire.belongsTo( models.User);
      Commentaire.belongsTo( models.Message);
    }
  return Commentaire;
};
