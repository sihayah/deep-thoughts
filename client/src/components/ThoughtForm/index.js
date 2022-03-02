import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';
import { ADD_THOUGHT } from '../../utils/mutations';

const ThoughtForm = () => {
    const [thoughtText, setText] = useState("");
    const [charCount, setCharCount] = useState(0);

    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
            try {
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts]}
                });                
            } catch (e) {
                console.log(e)
            }

            const { me } = cache.readQuery({ query: QUERY_ME });
            console.log({me})
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, thoughts: [...me.thoughts, addThought]}},
            });
        },
    });

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();
        try {
            await addThought({
                variables: { thoughtText }
            });
        setText('');
        setCharCount(0);            
        } catch(e) {
            console.error(e);
        }

    }

    return (
        <div>
            <p className={`m=0 ${charCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {charCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form 
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new thought..."
                    defaultValue={thoughtText}
                    className="form-input col-12 col-md-9"
                    onChange={handleChange}
                ></textarea>
                 <button className="btn col-12 col-md-3" type="submit">
                        Submit
                </button>
            </form>
        </div>
    )
};

export default ThoughtForm;