import React, { useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap'
import { FaTimes, FaTrash, FaEdit, FaCheck, FaUserPlus } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import { useGetUserQuery, useDeleteUserMutation, useRegisterUserMutation } from'../../slices/usersApiSlice';

function UserListScreen() {
    const { data: users, refetch, error, isLoading } = useGetUserQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation(); const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await deleteUser(id);
                refetch();
                toast.success('User deleted successfully');
            }
            catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [registerUser] = useRegisterUserMutation();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const availableRoles = [
        { id: 1, name: 'admin' },
        { id: 4, name: 'shipper' },
        { id: 3, name: 'editor' },
        { id: 5, name: 'assistant' },
        { id: 2, name: 'salesperson' },
    ];

    //   const handleRoleChange = (e) => { 
    //     const role = e.target.value;
    //     if (e.target.checked) {
    //       setRoles([...roles, role]);
    //    } else {
    //       setRoles(roles.filter(r => r !== role));
    //     } 
    //   };

    const handleRoleChange = (e) => {
        const role = availableRoles.find(role => role.name === e.target.value);
        if (e.target.checked) {
            setRoles([...roles, role]);
        } else {
            setRoles(roles.filter(r => r.id !== role.id));
        }
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('password', password);
        // formData.append('roles', roles); 
        formData.append('roles', JSON.stringify(roles));
        formData.append('photo', selectedFile);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        // Send formData to the server here 
        try {
            await registerUser(formData).unwrap();
            toast.success('User registered successfully');
        } catch (error) {
            console.error('Failed to register user:', error);
            toast.error('Failed to register user');
        }
        handleClose();
    };
    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    
    return (
        <>
            <h1>Users</h1>
            <Button className='my-3' onClick={handleShow}>
                <FaUserPlus /> Add User
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" name="email" value={email} onChange={(e) =>
                                setEmail(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name:</Form.Label>
                            <Form.Control type="text" name="firstName" value={firstName} onChange={(e) =>
                                setFirstName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name:</Form.Label>
                            <Form.Control type="text" name="lastName" value={lastName} onChange={(e) =>
                                setLastName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" name="password" value={password} onChange={(e) =>
                                setPassword(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Roles:</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        label="Admin"
                                        value="admin"
                                        checked={roles.some(role => role.name === 'admin')}
                                        onChange={handleRoleChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Shipper"
                                        value="shipper"
                                        checked={roles.some(role => role.name === 'shipper')}
                                        onChange={handleRoleChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Editor"
                                        value="editor"
                                        checked={roles.some(role => role.name === 'editor')}
                                        onChange={handleRoleChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Assistant"
                                        value="assistant"
                                        checked={roles.some(role => role.name === 'assistant')}
                                        onChange={handleRoleChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Salesperson"
                                        value="salesperson"
                                        checked={roles.some(role => role.name === 'salesperson')}
                                        onChange={handleRoleChange}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Photo:</Form.Label>
                            <Form.Control type="file" id='photo' name="photo" onChange={handlePhotoUpload} />
                        </Form.Group>
                        <Button type="submit">Add User</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" form="my-form">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {loadingDelete && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th>SALESPERSON</th>
                                <th>EDITOR</th>
                                <th>SHIPPER</th>
                                <th>ASSISTANT</th>
                                <th>Enabled</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{`${user.firstName} ${user.lastName}`}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`}>{user.email}</a>
                                    </td>
                                    <td>{user.roles && Array.isArray(user.roles) &&
                                        user.roles.some(role => role.name === 'Admin') ? <FaCheck color='green' /> : <FaTimes
                                        color='red' />}</td>
                                    <td>{user.roles && Array.isArray(user.roles) &&
                                        user.roles.some(role => role.name === 'Salesperson') ? <FaCheck color='green' /> :
                                        <FaTimes color='red' />}</td>
                                    <td>{user.roles && Array.isArray(user.roles) &&
                                        user.roles.some(role => role.name === 'Editor') ? <FaCheck color='green' /> :
                                        <FaTimes color='red' />}</td>
                                    <td>{user.roles && Array.isArray(user.roles) &&
                                        user.roles.some(role => role.name === 'Shipper') ? <FaCheck color='green' /> :
                                        <FaTimes color='red' />}</td>
                                    <td>{user.roles && Array.isArray(user.roles) &&
                                        user.roles.some(role => role.name === 'Assistant') ? <FaCheck color='green' /> :
                                        <FaTimes color='red' />}</td>
                                    <td>{user.enabled ? <FaCheck color='green' /> : <FaTimes
                                        color='red' />}</td> {/* New table data */}
                                    <td>
                                        <LinkContainer to={`/admin/user/${user.id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <FaEdit />
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(user.id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
        </>
    )
}
export default UserListScreen;