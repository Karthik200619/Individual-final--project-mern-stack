import React from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import axios from 'axios'

function ResetPassword() {

    const navigate = useNavigate()

    const location = useLocation()

    const email = location.state.email

    const { register, handleSubmit } = useForm()

    const resetPassword = async (data) => {

        try {

            await axios.post(
                'http://localhost:5000/common-api/resetpassword',
                {
                    email,
                    password: data.password
                }
            )

            alert('Password Changed')

            navigate('/login')

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className='min-h-screen flex items-center justify-center'>

            <form
                onSubmit={handleSubmit(resetPassword)}
                className='bg-white p-8 rounded-xl shadow-md w-96 space-y-4'
            >

                <h1 className='text-2xl font-bold'>
                    Reset Password
                </h1>

                <input
                    type='password'
                    placeholder='New Password'
                    {...register('password')}
                    className='w-full border p-2 rounded-lg'
                />

                <button
                    className='w-full bg-green-600 text-white p-2 rounded-lg'
                >
                    Change Password
                </button>

            </form>

        </div>
    )
}

export default ResetPassword