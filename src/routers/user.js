const express = require("express");
const userServices = require("../services/user");
const auth = require("../middlewares/auth");
const router = new express.Router();
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();
// Sign In
router.post("/login", async (req, res) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };
  const result = await userServices.signIn(payload);

  if (result.value) {
    return res.send(result.value);
  }
  res.status(result.statusCode).send({
    message: result.message,
  });
});

// Sign Up
router.post("/signup", async (req, res) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
  };
  const result = await userServices.signUp(payload);
  if (result.value) {
    return res.send(result.value);
  }
  res.status(result.statusCode).send({
    message: result.message,
  });
});

// Get By ID
router.get("/users/:id", auth, async (req, res) => {
  const id = req.params.id;
  const result = await userServices.getById(id);
  if (result.value) {
    return res.send(result.value);
  }
  res.status(result.statusCode).send({
    message: result.message,
  });
});
// Get My Profile
router.get("/profile", auth, async (req, res) => {
  const result = await userServices.getProfile(req.user.id);
  if (result.value) {
    return res.send(result.value);
  }
  res.status(result.statusCode).send({
    message: result.message,
  });
});

//Get public repos
router.get('/user/repos' , auth , async(req,res)=>{
    try{
        const username = req.user.github_account
        if(!username) {
            return res.status(404).send({
                message: "Please Authenticate to github"
            })
        }
        const {data:repos} = await octokit.repos.listForUser({username})
        res.send(repos.map(r=>r.name))
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Username Doesn't Exist"
        })
    }
})

router.put('/github',auth,async(req,res)=>{
    try{
        const githubUsername=req.body
        const id=req.user.id
        const result=  await userServices.updateUser(githubUsername,id)
        if(result.message){
           return res.status(result.statusCode).send({
            message: result.message
           })
        }
        res.send({
            message: "Authenticated Successfully"
        })
    }catch(err){
        //console.log(err)
        res.status(500).json("something went wrong")
    }
})
module.exports = router
