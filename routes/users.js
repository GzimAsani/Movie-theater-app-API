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
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "movieapp_database",
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
