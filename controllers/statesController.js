const State = require("../model/State");
const statesData = require("../model/statesData.json");

const getAllStates = async (req, res) => {
    const states = await statesData;
    var keys = ["code"];
    var values = ["HI", "AK"];
    if (!states)
        return res.status(400).json({ 'message': "No states found." });
    if (req.query.contig === 'false') {
        let result = states.filter(function (e) {
            return keys.every(function (a) {
                return values.includes(e[a])
            })
        })
        res.json(result); } else if (req.query.contig === 'true') {
        let result = states.filter(function (e) {
            return keys.every(function (a) {
                return !values.includes(e[a])
            })
        })
        res.json(result);
    } else {
        res.json(states);
    }
}
  
  const createNewStateFact = async (req, res) => {
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length != 2) {
      return res.status(400).json({'message': 'A state code is required at minimum.'});
    }
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': "State fun facts value required" });
    }
    if (!Array.isArray(req?.body?.funfacts)) {
        return res.status(400).json({ 'message': "State fun facts value must be an array" });
    }
    try {
        await State.updateOne({
            stateCode: input
        },
            {
                $addToSet: {
                    funfacts: { $each: req.body.funfacts}},
            }, { upsert: true });
    const result = await State.findOne({ stateCode: input }).exec();
        res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
}


const updateStateFact = async (req, res) => {
    if (req?.body?.index <1 || !req?.body.index) {
        return res.status(400).json({ 'message': "State fun fact index value required" });
    }
    else if (req?.body?.index <1 || !req?.body.funfact){
        return res.status(400).json({ 'message': "State fun fact value required" });
    }
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length !== 2) {
        return res.status(400).json({'message': `No Fun Facts found for ${input}`});
    }
    const index = req?.body?.index-1;
    const result = await State.findOne({ stateCode: input }).exec();
    if (index > result.funfacts.length) {
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${input}` });
    } else {
        try {
            result.funfacts[index] = req.body.funfact;
            await State.updateOne({
                stateCode: input
            },
                {
                    $set: { funfacts: result.funfacts },
                });
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    }
}

const deleteStateFact = async (req, res) => {
    if (req?.body?.index < 1 || !req?.body.index) {
        return res.status(400).json({ 'message': "State fun fact index value required" });
    }
    const input = req?.params?.state.toUpperCase();
    if (!input || input.length !== 2) {
        return res.status(400).json({ 'message': `No Fun Facts found for ${input}`});
    }

    const index = req?.body?.index - 1;
    const result = await State.findOne({ stateCode: input }).exec();

    if (index >= mongoResult.funfacts.length) {
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${input}` });
    } else {
        try {
            result.funfacts.splice(index, 1);
            await State.updateOne({
                stateCode: input
            },
                {
                    $set: { funfacts: result.funfacts },
                });
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    }
}

const getState = async (req, res) => {
    let result = await getData(req, res);
    result = result[0];
    res.json(result);
}


const getStateCapital = async (req, res) => {
    const result = await getData(req, res);
    let capitalRes = {
        "state": result[0].state,
        "capital": result[0].capital_city
    }
    res.json(capitalRes);
}


const getStateNickname = async (req, res) => {
    const result = await getData(req, res);
    let nicknameRes = {
        "state": result[0].state,
        "nickname": result[0].nickname
    }
    res.json(nicknameRes);
}


const getStatePopulation = async (req, res) => {
    const result = await getData(req, res);
    let populationRes = {
        "state": result[0].state,
        "population": result[0].population.toLocaleString("en-US")
    }
    res.json(populationRes);
}


const getStateAdmission = async (req, res) => {
    const result = await getData(req, res);
    let admissionRes = {
        "state": result[0].state,
        "admitted": result[0].admission_date
    }
    res.json(admissionRes);
}




//function to get data from state
const getData = async (req, res) => {
    const states = await statesData;
    const input = req?.params?.state.toUpperCase();
        if (!input || input.length !== 2) {
            return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
        }

    var keys = ["code"];
    var result = states.filter(function (e) {
        return keys.every(function (a) {
            return input.includes(e[a])
        })
    })

    if (!result || result.length === 0) {
        return res.status(400).json({ 'message': "Invalid state abbreviation parameter" });

    }
    const mongo = await State.findOne({ stateCode: input }).exec();
    if (mongo !== null) {
        let funFactRes =
            mongo.funfacts;

        result[0].funfacts = funFactRes;
        result.toString();
        return result;
    } else
        result.toString();
        return result;
}

module.exports = {
    getAllStates,
    createNewStateFact,
    updateStateFact,
    deleteStateFact,
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
}