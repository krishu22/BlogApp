// Import the required modules
const express = require("express");
const router = express.Router();


/********************************************* IMPORT CONTROLLERS & MIDDLEWARES ***********************************************/ 

// blog 
const {
        createBlog,
        getBlogDetails,
        showAllBlogs,
        deleteBlog,
        editBlog
} = require("../controllers/Blog");

// category
const {
        createCategory,
        getCategoryDetails,
        showAllCategories,
} = require("../controllers/Category");

// comment
const {
        createComment,
        deleteComment,
        showCommentsOnBlog,
        showUserComments,
} = require("../controllers/Comment");

// rating 
const {
        createRating,
        getBlogRatings,
        getUserRatings,
} = require("../controllers/Rating");

// middlewares
const {
        auth,
        isAdmin,
        isReader, 
        isCreator
} = require("../middlewares/auth");
 
 
/************************************************** ROUTES ****************************************************/

router.post("/createBlog", createBlog); // done
router.get("/getBlogDetails/:blogId", getBlogDetails); // done
router.get("/showAllBlogs", showAllBlogs); // done
router.delete("/deleteBlog/:blogId", deleteBlog); // done
router.put("/editBlog/:blogId", editBlog); // done

router.post("/createCategory", createCategory); // done
router.get("/getCategoryDetails/:categoryId", getCategoryDetails); // done
router.get("/showAllCategories", showAllCategories); // done

router.post("/createComment/:blogId", auth, createComment); // done
router.delete("/deleteComment", deleteComment); // done
router.get("/showCommentsOnBlog", showCommentsOnBlog); // done 
router.get("/showUserComments", showUserComments); // done

router.post("/createRating", createRating); // done
router.get("/getBlogRatings/:blogId", getBlogRatings); // done
router.get("/getUserRatings/:userId", getUserRatings); // done 

// export routes
module.exports = router;