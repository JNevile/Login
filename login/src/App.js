import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './App.css';

//First, define the initial state for the form with empty input boxes ready for user to add their name and email
const initialState = {
    name: '',
    email: '',
    showModal: false,
    isLoggedIn: false,
};

//Reducer function is used to handle state transition
function formReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME': //Update the user's name 
            return { ...state, name: action.payload };
        case 'SET_EMAIL': //Update the user's email 
            return { ...state, email: action.payload };
        case 'SHOW_MODAL': //Show the modal dialog if there is a validation error
            return { ...state, showModal: true };
        case 'HIDE_MODAL': //Hides the modal dialog 
            return { ...state, showModal: false };
        case 'SET_LOGGED_IN': //Notes the user is logged in
            return { ...state, isLoggedIn: true };
        case 'RESET_FORM': //Resets form fields to empty and states 
            return { name: '', email: '', showModal: false, isLoggedIn: false };
        default:
            return state;
    }
}

function LoginForm() {
    //Initialize the state using useReducer and provide a dispatch function
    const [state, dispatch] = useReducer(formReducer, initialState);

    //Resets the form name and email inputs to empty boxes and resets state using dispatch
    const handleReset = () => {
        dispatch({ type: 'RESET_FORM' });
    };

    //Handles form submission and validation
    const handleSubmit = (e) => {
        e.preventDefault(); //Prevents default form submission
        if (!state.name || !state.email) {
            //Show modal if validation fails because of any field is still empty
            dispatch({ type: 'SHOW_MODAL' });
        } else {
            //Set state to logged in when validation is correct
            dispatch({ type: 'SET_LOGGED_IN' });
        }
    };

    //Close the modal dialog to hide the validation error message
    const closeModal = () => {
        dispatch({ type: 'HIDE_MODAL' });
    };

    return (
        <div>
            {state.isLoggedIn ? (
                //Displays a welcome message if the user gets logged in successfully
                <h1>Hello, {state.name}</h1>
            ) : (
                //Renders the login form if the user is not successfully logged in
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Name:
                            <input
                                type="text" //Text input for the name
                                value={state.name} //Binds the input value to state
                                onChange={(e) =>
                                    dispatch({ type: 'SET_NAME', payload: e.target.value })
                                } //Dispatch action to update the user's name
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Email:
                            <input
                                type="email" //Text input for the user's email
                                value={state.email} //Binds the input value to state
                                onChange={(e) =>
                                    dispatch({ type: 'SET_EMAIL', payload: e.target.value })
                                } //Dispatch action to update the user's email
                            />
                        </label>
                    </div>
                    <div className="button-group">
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            )}

            {ReactDOM.createPortal(
                //Render the modal outside of the main React component tree using Portal
                <Modal isOpen={state.showModal} onRequestClose={closeModal}>
                    <h2>Validation Error</h2>
                    <p>All fields are required.</p>
                    <button onClick={closeModal}>Close</button>
                </Modal>,
                document.getElementById('modal-root') 
            )}
        </div>
    );
}

//Exports the LoginForm component 
export default function App() {
    return <LoginForm />;
}