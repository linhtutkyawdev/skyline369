import axiosInstance from "./axiosInstance";

axiosInstance
  .post("/login", {
    name: "linhtutkyaw.dev@gmail.com",
    password: "Clear123",
  })
  .then((res) => {
    console.log(res);
    axiosInstance
      .post("/logout", {
        token: res.data.token,
      })
      .then((res) => {
        console.log(res);
      });
  })
  .catch((err) => {
    console.error(err);
  });
