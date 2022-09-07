import express from "express";
import knex from "knex";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.js";
import {  verifyUser,verifyToken, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
const db = knex({
  client: "pg",
  connection: {
    connectionString: "postgres://njjrdeelxjupud:f3d4cbf4d0ba33a1a24f3ca08d69225d00a133475552816dc2d9bfe8d6d46881@ec2-54-161-255-125.compute-1.amazonaws.com:5432/d7elrjgg32kujo"
  },
});

// router.get("/checkauth", verifyToken,(req,res,next)=>{
//     res.json("hello user, you are loged in");
// })
// router.get("/checkuser/:id", verifyUser,(req,res,next)=>{
//     res.json("hello user, you are loged in and delete your acc");
// })

// router.get("/checkadmin/:id", verifyAdmin,(req,res,next)=>{
//     res.json("hello admin, you are loged in and delete your acc");
// })

router.put("/:id",verifyUser, updateUser(db));

router.delete("/:id",verifyUser, deleteUser(db));

router.get("/:id",verifyUser, getUser(db));

router.get("/",verifyAdmin, getUsers(db));

export default router;
