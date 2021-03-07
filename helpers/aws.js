/*

Helper functions for interfacing with AWS.

*/

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.region = "us-east-1";

const s3 = new aws.S3();

const S3_BUCKET = process.env.S3_BUCKET;

// multer wrapper function to simplify image uploading
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_BUCKET,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

// function to delete an image from the S3 bucket
function deleteObject(key) {
  console.log("key" + key);
  s3.deleteObject({ Bucket: S3_BUCKET, Key: key }, (err, data) => {
    console.error(err);
    console.log(data);
  });
}

module.exports = {
  upload: upload,
  delete: deleteObject,
};
