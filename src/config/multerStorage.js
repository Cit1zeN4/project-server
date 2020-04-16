const multer = require('multer')

module.exports = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files')
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().getTime()}-${file.originalname}`)
  },
})
