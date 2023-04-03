/*login template.
Future security improvement would be to implement sign in with Google for OAuth and OpenId Connect protocols
https://developers.google.com/identity/gsi/web/guides/overview
*/
import React, {useState} from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = props =>{

    //initially set as empty strings. onChangeName and onChangeId bind values to state variables
    const [name, setName] = useState("")
    const [id, setId] = useState("")

    const onChangeName = e =>{
        const name = e.target.value
        setName(name);
    }

    const onChangeId = e =>{
        const id = e.target.value
        setId(id);
    }

    /*submit button calls login. The login component calls the login function in App.js and sets App's user state.
    We can then pass on the logged-in user to other components.
    */

    const login = () =>{
        props.login({name: name, id: id})
        props.history.push('/')
    }

    return(
        <div class="vh-100">
            <Form className='login shadow-sm p-3 mb-5 bg-white rounded'>
            <h2>Login</h2>
            <br></br>
                <Form.Group>
                    <h3>Username</h3>
                    <Form.Control
                        aria-label='Enter username' 
                        type="text"
                        placeholder="Enter username"
                        value={name}
                        onChange={onChangeName}
                    />
                </Form.Group>
                <br></br>
                <Form.Group>
                    <h3>ID</h3>
                    <Form.Control
                        aria-label='Enter id'
                        type="text"
                        placeholder="Enter id"
                        value={id}
                        onChange={onChangeId}
                    />
                </Form.Group>
                <Button variant = "btn btn-primary btn-lg" onClick={login}>
                    Submit
                </Button>
            </Form>
        </div>
    )

}

export default Login;