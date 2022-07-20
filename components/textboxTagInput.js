import React, { useCallback, useState, useEffect } from 'react';
import { Tag, Card, Stack, TextField, TextStyle } from '@shopify/polaris';

const _cardTitle = '';
const _textInputTitle = '';
const _textInputHelperText = '';
const _textInputPlaceholder = '';
const _textDescriptionHelperText = '';

const TextBoxTagInput = (props) => {
    const [cardTitle, setCardTitle] = useState(props.cardTitle || _cardTitle);
    const [textInputTitle, setTextInputTitle] = useState(props.textInputTitle || _textInputTitle);
    const [textInputPlaceholder, setTextInputPlaceholder] = useState(props.textInputPlaceholder || _textInputPlaceholder);
    const [textInputHelperText, setTextInputHelperText] = useState(props.textInputHelperText || _textInputHelperText);
    const [textDescriptionHelperText, setTextDescriptionHelperText] = useState(props.textDescriptionHelperText || _textDescriptionHelperText);
    const [pin, setPin] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);


    const handelPin = (value) => {
        let newTags;
        setPin(value);
        if (value?.includes(',') || value?.indexOf(' ') > 0) {
            let newVals;
            if (value.includes(',')) {
                newVals = value.split(',');
            }
            if (value.indexOf(' ') > 0) {
                newVals = value.split(' ');
            }
            // filtering out the blank spaces and triming the texts received
            newVals = newVals.map(item => item.trim()).filter(v => v != '');
            newTags = [...new Set([...selectedTags, ...newVals])];
            setSelectedTags(newTags);
            setPin('');
        }

        if (props.pinCodeChange && newTags) {
            props.pinCodeChange(newTags);
        }
    }

    const removeTag = (tag) => {
        let filteredTag = selectedTags.filter((previousTag) => previousTag !== tag)
        setSelectedTags(filteredTag);
        if (props.pinCodeChange && filteredTag) {
            props.pinCodeChange(filteredTag);
        }
    }

    const InputTags = selectedTags.map((option) => (
        <Tag key={option} onRemove={() => { removeTag(option) }}>
            {option}
        </Tag>
    ));

    useEffect(() => {
        if (props.defaultValue) {
            // console.log('Recieved', props.defaultValue)
            setSelectedTags(props.defaultValue);
            setPin('');
        }
    }, [props.defaultValue])

    return (
        <Card sectioned title={cardTitle}>
            {
                (selectedTags.length != 0) ? (
                    <>
                        <Stack spacing="tight">
                            {InputTags}
                        </Stack>
                        <br />
                    </>
                ) : (
                    <></>
                )
            }

            {/* <Stack> */}
            <TextField
                label={textInputTitle}
                value={pin}
                onChange={(vals) => { handelPin(vals) }}
                helpText={textInputHelperText}
                placeholder={textInputPlaceholder}
            />
            <br />
            <TextStyle variation="subdued">{textDescriptionHelperText}</TextStyle>
            {/* </Stack> */}
        </Card>
    )
}

export default TextBoxTagInput
