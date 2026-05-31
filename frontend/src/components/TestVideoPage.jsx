import React from 'react'
import axios from 'axios'

function TestVideoPage() {

    const uploadVideo = async (e) => {

        try {

            const file =
                e.target.files[0]

            if (!file) return

            const formData =
                new FormData()

            formData.append(
                "video",
                file
            )

            const res =
                await axios.post(

                    "https://individual-final-project-mern-stack.onrender.com/user-api/test-video-upload",

                    formData,

                    {
                        withCredentials: true
                    }

                )

            console.log(res.data)

        }
        catch (err) {

            console.log(err)

        }

    }

    return (

        <div>

            <input

                type="file"

                accept="image/*,video/*"

                onChange={uploadVideo}

            />

        </div>

    )

}

export default TestVideoPage