import multer from 'multer'


const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize:
            30 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg','image/png','image/webp',
            'video/mp4',
            'video/webm',
            'video/quicktime'
        ]
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(
                new Error(
                    'Invalid file type'
                )
            )
        }
    }

})