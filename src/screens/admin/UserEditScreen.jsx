import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useUpdateUserMutation, useGetUserDetailsQuery, useUpdateUserStatusMutation } from '../../slices/usersApiSlice'
const UserEditScreen = () => {
    const { id: userId } = useParams()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [enabled, setEnabled] = useState(false)
    const [initialEnabled, setInitialEnabled] = useState(false)
    const [roles, setRoles] = useState({
        isAdmin: false,
        isSalesperson: false,
        isEditor: false,
        isShipper: false,
        isAssistant: false
    });
    const {
        data: user,
        refetch,
        error,
        isLoading
    } = useGetUserDetailsQuery(userId)
    console.log(user)
    console.log(userId)
    const navigate = useNavigate()
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()
    const [updateUserStatus] = useUpdateUserStatusMutation()
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setEmail(user.email)
            setEnabled(user.enabled)
            setInitialEnabled(user.enabled)
            setRoles({
                isAdmin: user.roles.some(role => role.name === 'Admin'),
                isSalesperson: user.roles.some(role => role.name === 'Salesperson'),
                isEditor: user.roles.some(role => role.name === 'Editor'),
                isShipper: user.roles.some(role => role.name === 'Shipper'),
                isAssistant: user.roles.some(role => role.name === 'Assistant')
            });
        }
    }, [user])
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const userRoles = [];
            if (roles.isAdmin) userRoles.push({ name: 'Admin' });
            if (roles.isSalesperson) userRoles.push({ name: 'Salesperson' });
            if (roles.isEditor) userRoles.push({ name: 'Editor' });
            if (roles.isShipper) userRoles.push({ name: 'Shipper' });
            if (roles.isAssistant) userRoles.push({ name: 'Assistant' });
            await updateUser({
                id: userId, firstName, lastName, email, roles: userRoles,
                enabled
            })
            if (enabled !== initialEnabled) {
                await updateUserStatus({ id: userId, enabled })
            }
            toast.success('User updated successfully')
            refetch()
            navigate('/admin/userlist')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {
                    loadingUpdate && <Loader />
                }
                {
                    isLoading ? <Loader /> : error ? <Message
                        variant='danger'>{error}</Message> : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='firstName' className='my-2'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type='text' placeholder='Enter first name'
                                    value={firstName} onChange={(e) => setFirstName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='lastName' className='my-2'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type='text' placeholder='Enter last name'
                                    value={lastName} onChange={(e) => setLastName(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='email' className='my-2'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='isAdmin' className='my-2'>
                                <Form.Check type='checkbox' label='Admin'
                                    checked={roles.isAdmin} onChange={(e) => setRoles({
                                        ...roles, isAdmin:
                                            e.target.checked
                                    })}></Form.Check>
                            </Form.Group>
                            <Form.Group controlId='isSalesperson' className='my-2'>
                                <Form.Check type='checkbox' label='Salesperson'
                                    checked={roles.isSalesperson} onChange={(e) => setRoles({
                                        ...roles, isSalesperson:
                                            e.target.checked
                                    })}></Form.Check>
                            </Form.Group>
                            <Form.Group controlId='isEditor' className='my-2'>
                                <Form.Check type='checkbox' label='Editor'
                                    checked={roles.isEditor} onChange={(e) => setRoles({
                                        ...roles, isEditor:
                                            e.target.checked
                                    })}></Form.Check>
                            </Form.Group>
                            <Form.Group controlId='isShipper' className='my-2'>
                                <Form.Check type='checkbox' label='Shipper'
                                    checked={roles.isShipper} onChange={(e) => setRoles({
                                        ...roles, isShipper:
                                            e.target.checked
                                    })}></Form.Check>
                            </Form.Group>
                            <Form.Group controlId='isAssistant' className='my-2'>
                                <Form.Check type='checkbox' label='Assistant'
                                    checked={roles.isAssistant} onChange={(e) => setRoles({
                                        ...roles, isAssistant:
                                            e.target.checked
                                    })}></Form.Check>
                            </Form.Group>
                            <Form.Group controlId='enabled' className='my-2'>
                                <Form.Check type='checkbox' label='Enabled'
                                    checked={enabled} onChange={(e) => setEnabled(e.target.checked)}></Form.Check>
                            </Form.Group>
                            <Button type='submit' variant='primary'
                                className='my-2'>Update</Button>
                        </Form>
                    )

                }
            </FormContainer>
        </>
    )
}

export default UserEditScreen;