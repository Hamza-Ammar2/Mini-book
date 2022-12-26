var express = require('express');
var router = express.Router();
const User = require('../controllers/userController');

/* GET users listing. */
router.get('/', User.allusers);

router.get('/:id', User.userTimeline);
router.get('/:id/friends', User.userFriends);
router.post('/:id/send-request', User.sendRequest);
router.post('/:id/remove-request', User.removeRequest);
router.post('/:id/unfriend', User.unfriend);
router.post('/:id/add-friend', User.addFriend);
router.get('/:id/about', User.about);
router.post('/:id/edit-bio', User.editBio);
router.post('/:id/edit-workplace', User.editWorkplace);
router.post('/:id/edit-residence', User.editResidence);
router.post('/edit-pic', User.editPic);

module.exports = router;
