export const updateUser = (db) => async (req, res, next) => {
    const { id } = req.params;
    db("user1")
      .where({ id: id })
      .update(req.body)
      .returning("*")
      .then((user) => {
        if (user.length) {
          res.status(200).json(user[0]);
        } else {
          res.status(404).json("This User does not exist");
        }
      })
      .catch((err) => next(err));
  };
  
  export const deleteUser = (db) => async (req, res, next) => {
    const { id } = req.params;
    try {
      db("user1")
        .where({ id: id })
        .del()
        .then(res.status(200).json("User has been deleted"));
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
  export const getUser = (db) => async (req, res, next) => {
    const { id } = req.params;
  
    db.select("*")
      .from("user1")
      .where({id: id })
      .then((users) => {
        if (users.length) {
          res.json(users[0]);
        } else {
          res.status(400).json("This User does not exist");
        }
      })
      .catch((err) => {
        next(err, "Invalid credientials");
      });
  };
  
  export const getUsers = (db) => async (req, res, next) => {
    db.select("*")
      .from("user1")
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        next(err, "Invalid credientials");
      });
  };
  