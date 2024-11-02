// Import the required modules
const express = require("express");
const router = express.Router();


/********************************************* IMPORT CONTROLLERS & MIDDLEWARES ***********************************************/

// profile
const {
        updateProfile, 
        updateProfilePicture, 
        deleteUser,
        getUser, 
} = require("../controllers/Profile");

// user
const {
        getAdmins,
        getCreators,
        getReaders,
        getPosts,
        showFavorites,
} = require("../controllers/User");

// middlewares
const {
        auth,
        isAdmin, 
       // isReader, 
       // isCreator
} = require("../middlewares/auth"); 

 
/********************************************* IMPORT CONTROLLERS & MIDDLEWARES ***********************************************/

router.put("/updateProfile", updateProfile); // done
router.put("/updateProfilePicture", updateProfilePicture);
router.delete("/deleteUser/:userId", deleteUser); // done 
router.get("/getuser", getUser); // done

router.get("/getAdmins", auth, isAdmin, getAdmins); // done
router.get("/getCreators", auth, isAdmin, getCreators); // done
router.get("/getReaders", auth, isAdmin, getReaders); // done
router.get("/getPosts/:userId", getPosts); // done
router.get("/showFavorites/:userId", showFavorites); // done

// export routes
module.exports = router;