const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createNewStateFact)
    .put(statesController.updateStateFact)
    .delete(statesController.deleteStateFact);

router.route('/:state')
    .get(statesController.getState);
router.route('/:state/capitol')
    .get(statesController.getStateCapital);
router.route('/:state/nickname')
    .get(statesController.getStateNickname);
router.route('/:state/population')
    .get(statesController.getStatePopulation);
router.route('/:state/admission')
    .get(statesController.getStateAdmission);
    

module.exports = router;