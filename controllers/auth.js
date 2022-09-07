import jwt from "jsonwebtoken";

export const register = (db, bcrypt) => async (req, res, next) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    db.transaction((trx) => {
      trx
        .insert({
          hash: hash,
          username: username,
        })
        .into("login")
        .returning("username")
        .then((loginUser) => {
          return trx("users")
            .returning("*")
            .insert({
              username: loginUser[0].username,
              email: email,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch((err) => res.status(400).json("unable to register"));
  });
};

export const login = (db, bcrypt) => async (req, res, next) => {
  const { username, password } = req.body;
  db.select("username", "hash")
    .from("login")
    .where("username", "=", username)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("username", "=", req.body.username)
          .then((user) => {
            const id = user[0].id;
            const isadmin = user[0].isadmin;
            if (user) {
              const accessToken = jwt.sign(
                { id: id, isadmin: isadmin },
                process.env.JWT
              );
              res
                .cookie("access_token", accessToken, { httpOnly: true })
                .json(user[0]);
            }
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials.");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
};
