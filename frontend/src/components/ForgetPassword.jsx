import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useState } from 'react'

function ForgotPassword() {

    const navigate = useNavigate()

    const { register, handleSubmit } = useForm()

    const [error, setError] = useState('')

    const submitEmail = async (data) => {

        try {

            const res = await axios.post(
                'http://localhost:5000/common-api/forgetpass',
                data
            )

            if (!res.data.payload.isPresent) {
                setError('User does not exist')
                return
            }

            await axios.post(
                'http://localhost:5000/common-api/sendotp',
                {
                    email: data.email
                }
            )

            navigate('/verifyotp', {
                state: {
                    email: data.email
                }
            })

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className='min-h-screen flex items-center justify-center'>

            <form
                onSubmit={handleSubmit(submitEmail)}
                className='bg-white p-8 rounded-xl shadow-md w-96 space-y-4'
            >

                <h1 className='text-2xl font-bold'>
                    Forgot Password
                </h1>

                <input
                    type='email'
                    placeholder='Enter Email'
                    {...register('email')}
                    className='w-full border p-2 rounded-lg'
                />

                <button
                    className='w-full bg-indigo-600 text-white p-2 rounded-lg'
                >
                    Send OTP
                </button>

                <p className='text-red-500'>
                    {error}
                </p>

            </form>

        </div>
    )
}

export default ForgotPassword