import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import axios from 'axios'

function VerifyOtp() {

    const navigate = useNavigate()

    const location = useLocation()

    const email = location.state.email

    const purpose = location.state?.purpose

    const { register, handleSubmit } = useForm()

    const verifyOtp = async (data) => {

        try {

            const endpoint =
                purpose === 'REGISTER'
                    ? 'https://individual-final-project-mern-stack.onrender.com/common-api/verify-register-otp'
                    : 'https://individual-final-project-mern-stack.onrender.com/common-api/verifyotp'

            const res = await axios.post(
                endpoint,
                {
                    email,
                    otp: data.otp
                }
            )

            if (res.status === 200) {

                if (purpose === 'REGISTER') {

                    navigate('/login')

                }
                else {

                    navigate('/resetpassword', {
                        state: {
                            email
                        }
                    })

                }

            }

        }
        catch (err) {

            console.log(err)

        }

    }

    return (
        <div className='min-h-screen flex items-center justify-center'>

            <form
                onSubmit={handleSubmit(verifyOtp)}
                className='bg-white p-8 rounded-xl shadow-md w-96 space-y-4'
            >

                <h1 className='text-2xl font-bold'>
                    Verify OTP
                </h1>

                <input
                    type='text'
                    placeholder='Enter OTP'
                    {...register('otp')}
                    className='w-full border p-2 rounded-lg'
                />

                <button
                    className='w-full bg-indigo-600 text-white p-2 rounded-lg'
                >
                    Verify OTP
                </button>

            </form>

        </div>
    )
}

export default VerifyOtp