import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADD_REACTION } from '../../utils/mutations';

const ReactionForm = ({ thoughtId }) => {
    const [ addReaction, { error } ] = useMutation(ADD_REACTION);
    const [charCount, setCharCount] = useState(0);
    const [reactionBody, setBody] = useState("");

    const handleChange = (event) => {
        if (event.target.value.length <= 280) {
            setBody(event.target.value);
            setCharCount(event.target.value.length);
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await addReaction({
                variables: {thoughtId, reactionBody}
            }) 
            setBody('');
            setCharCount(0); 
        }
          
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <p 
            className=
                {`m-0 ${charCount === 280 || error ? 'text-error' : ""}`}
            >
                Character Count: {charCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
                <textarea
                    placholder="Leave a reaction to this thought..."
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                    value={reactionBody}
                >
                </textarea>
                <button className="btn col=12 col-md-3" type="submit" onSubmit={handleFormSubmit}>
                    Submit
                </button>
                
            </form>
        </div>
    )
}

export default ReactionForm;