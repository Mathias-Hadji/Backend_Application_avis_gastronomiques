const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce créée !'}))
    .catch(error => res.status(400).json({error}));
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};


exports.likeSauce = (req, res, next ) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if(req.body.like == 0){
            for (let i = 0; i < sauce.usersLiked.length; i++){
                if(req.body.userId == sauce.usersLiked[i]){
                    Sauce.updateOne({ _id: req.params.id },{likes: sauce.likes - 1, $pull: {usersLiked: req.body.userId}})
                    .then(() => res.status(200).json({message: 'Like annulé !'}))
                    .catch(error => res.status(400).json({ error }))
                }
            }
            for(let i = 0; i < sauce.usersDisliked.length; i++){
                if (req.body.userId == sauce.usersDisliked[i]){
                    Sauce.updateOne({ _id: req.params.id },{dislikes: sauce.dislikes - 1, $pull: {usersDisliked: req.body.userId}})
                    .then(() => res.status(200).json({message: 'Dislike annulé !'}))
                    .catch(error => res.status(400).json({ error }))
                }      
            }
            
        } else if(req.body.like == 1){
            Sauce.updateOne({ _id: req.params.id },{likes: sauce.likes + 1, $push: {usersLiked: req.body.userId}})
            .then(() => res.status(200).json({message: 'Like ajouté !'}))
            .catch(error => res.status(400).json({ error }));

        } else if(req.body.like == -1){
            Sauce.updateOne({ _id: req.params.id },{dislikes: sauce.dislikes + 1, $push: {usersDisliked: req.body.userId}})
            .then(() => res.status(200).json({message: 'Dislike ajouté !'}))
            .catch(error => res.status(400).json({ error })); 
        }
    })
    .catch(error => res.status(400).json({error}));
};

