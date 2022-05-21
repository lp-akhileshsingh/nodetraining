const axios = require("axios");
require("dotenv").config();

const uploadBucket = async ({ url, data, title }) => {
  try {
    const res = await axios({
      method: "post",
      url: process.env.bit_bucket_url,
      data: {
        bucketname: process.env.bucketname,
        level1: url, // `${(Math.random() + 1).toString(36).substring(3)}.png`
        fileTitle: title,
        filecontent: data, //
      },
    });
    console.log("test=====", res.data);
    return { error: false, data: res.data };
  } catch (error) {
    console.log("erroe====", error);
    return { error: true, message: error.message };
  }
};

module.exports = {
  uploadBucket,
};
