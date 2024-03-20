const fileService = require("./file.services");
const uploadFile = require("./file.middleware");
const { BaseResponse, ApplicationError } = require("./fille.common");
const { MAXSIZE } = require("./file.config");

// const createFile = async (req, res, next) => {
//   try {
//     await uploadFile(req, res);
//     if (req.files.length === 0) {
//       return BaseResponse.error(res, 400, "Please upload a file!");
//     }
//     for (const file of req.files) {
//       console.log(file.size);
//       console.log(file.originalname);
//       if (file.size > MAXSIZE) {
//         return BaseResponse.error(
//           res,
//           400,
//           `File size cannot be larger than ${MAXSIZE}MB!`
//         );
//       }
//     }
//     const files = req.files;
//     const file = await fileService.createFile(files);
//     console.log(file);
//     return BaseResponse.success(
//       res,
//       200,
//       "Uploaded the file successfully",
//       file
//     );
//   } catch (err) {
//     return next(new ApplicationError(500, err));
//   }
// };


const createFile = async (req, res, next) => {
  try {
    await uploadFile(req, res);
    if (req.files.length === 0) {
      return BaseResponse.error(res, 400, "Please upload a file!");
    }
    for (const file of req.files) {
      console.log(file.size);
      console.log(file.originalname);
      if (file.size > MAXSIZE) {
        return BaseResponse.error(
          res,
          400,
          `File size cannot be larger than ${MAXSIZE}MB!`
        );
      }
    }
    const files = req.files;

    const fileData = await fileService.createFile(files);

    console.log(fileData);
    return BaseResponse.success(
      res,
      200,
      "Uploaded the file successfully",
      fileData
    );
  } catch (err) {
    return next(new ApplicationError(500, err));
  }
};


// const searchFile = async (req, res, next) => {
//   const { field, key } = req.query;
  
//   try {
//     if (!field || !key) {
//       return BaseResponse.error(res, 400, "Field and key are required!");
//     }

//     const result = await searchFile(field, key);
//     return BaseResponse.success(res, 200, "Files found successfully", result);
//   } catch (err) {
//     return next(new ApplicationError(500, err));
//   }
// };


module.exports = { createFile };
// const readFile = async (req, res,next) => {
//   try {
//     const { key } = req.params;
//     const fileData = await fileService.readFile(key);
//     return BaseResponse.success(res, 200, "File read successfully", fileData);
//   } catch (err) {
//     return next(new ApplicationError(500, err));
//   }
// };