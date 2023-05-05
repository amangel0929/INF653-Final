const User = require('../model/State');
const bcrypt = require('bcrypt');

const handleNewState = async (req, res) => {
    const { index, funfacts } = req.body;
    if (!index) return res.status(400).json({ 'message': 'State fun fact index value required' });
    else if (!funfacts) return res.status(400).json({ 'message': 'State fun fact value required' });

    // check for duplicate funfacts in the db
    const duplicate = await State.findOne({ funfacts: funfacts }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

}

module.exports = { handleNewState };