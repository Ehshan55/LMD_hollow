import React, { useCallback, useState, useEffect, useContext } from 'react';
import { Layout, Card, FormLayout, TextField, Button, Icon, Select, PageActions } from "@shopify/polaris";

import { CirclePlusMinor } from '@shopify/polaris-icons';
import { DeleteMajor } from '@shopify/polaris-icons';

function QuestionBlocks(props) {
    // data container states
    const [questionArray, setQuestionArray] = useState(props.promotionQuestionObj);

    // for button save loader

    useEffect(() => {
        // console.log("Question updated: ", questionArray);
        if (props.promotionQuestionUpdate) {
            props.promotionQuestionUpdate(questionArray);
        }
    }, [questionArray])


    //////////////////////////////////////////////////////////////////////////////////////////////////
    const onMinCounterChange = (minRange, itemIndex) => {
        let questionObj = questionArray[itemIndex];
        if (questionObj.question_type == 'counter') {
            questionObj.question_options.min = minRange;
        }

        let arrayVal = [...questionArray];
        arrayVal[itemIndex] = questionObj
        setQuestionArray(arrayVal);
    }

    const onMaxCounterChange = (maxRange, itemIndex) => {
        let questionObj = questionArray[itemIndex];

        if (questionObj.question_type == 'counter') {
            questionObj.question_options.max = maxRange;
        }

        let arrayVal = [...questionArray];
        arrayVal[itemIndex] = questionObj
        setQuestionArray(arrayVal);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////////////////////
    const onMinRangeChange = (minRange, itemIndex) => {
        let questionObj = questionArray[itemIndex];
        if (questionObj.question_type == 'range') {
            questionObj.question_options.min = minRange;
        }

        let arrayVal = [...questionArray];
        arrayVal[itemIndex] = questionObj
        setQuestionArray(arrayVal);
    }

    const onMaxRangeChange = (maxRange, itemIndex) => {
        let questionObj = questionArray[itemIndex];
        if (questionObj.question_type == 'range') {
            questionObj.question_options.max = maxRange;
        }

        let arrayVal = [...questionArray];
        arrayVal[itemIndex] = questionObj
        setQuestionArray(arrayVal);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////
    const onOptionsTitleChange = (optionTitle, itemIndex, optionsIndex) => {
        let questionObj = questionArray[itemIndex];
        if (questionObj.question_type == 'multiple-choice') {
            questionObj.question_options.options[optionsIndex].title = optionTitle;
        } else if (questionObj.question_type == 'checkbox') {
            questionObj.question_options.options[optionsIndex].title = optionTitle;
        }

        let arrayVal = [...questionArray];
        arrayVal[itemIndex] = questionObj
        setQuestionArray(arrayVal);
    }

    const onOptionsDiscountChange = (optionDiscount, itemIndex, optionsIndex) => {
        let questionObj = questionArray[itemIndex];
        if (questionObj.question_type == 'multiple-choice') {
            questionObj.question_options.options[optionsIndex].discount = optionDiscount;
        } else if (questionObj.question_type == 'checkbox') {
            questionObj.question_options.options[optionsIndex].discount = optionDiscount;
        }

        let arrayVal = [...questionArray];
        arrayVal[itemIndex] = questionObj
        setQuestionArray(arrayVal);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////


    const getDropdownOptionVal = (OptionVal) => {
        let DropdownOptionsSelected = 'Counter'
        // 'Counter', 'Multiple Choice', 'Checkbox', 'Range'
        if (OptionVal == 'counter') {
            DropdownOptionsSelected = 'Counter';
        } else if (OptionVal == 'multiple-choice') {
            DropdownOptionsSelected = 'Multiple Choice';
        } else if (OptionVal == 'checkbox') {
            DropdownOptionsSelected = 'Checkbox';
        } else if (OptionVal == 'range') {
            DropdownOptionsSelected = 'Range';
        }

        return DropdownOptionsSelected;
    }



    const QuestionMiniBlock = (promotionObj, objIndex) => {
        return (
            <Card sectioned key={objIndex}>
                <FormLayout>
                    <FormLayout.Group>
                        <TextField
                            label={"Question " + (objIndex + 1)}
                            placeholder={"Type your questions"}
                            type="text"
                            value={promotionObj.question_title}
                            onChange={(newVal) => { onQuestionTitleChange(objIndex, newVal) }}
                            connectedRight={
                                <Button onClick={() => { onDeleteQuestionButtonClick(objIndex) }}>
                                    <Icon source={DeleteMajor} color="base" />
                                </Button>
                            }
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        <Select
                            // labelHidden
                            label="Type"
                            options={['Counter', 'Multiple Choice', 'Checkbox', 'Range']}
                            value={getDropdownOptionVal(promotionObj.question_type)}
                            onChange={(selectedOption) => { onQuestionTypeChange(selectedOption, objIndex) }}
                        />
                        <TextField
                            label="Total Potential Discount"
                            placeholder={"Discount %"}
                            type="number"
                            value={promotionObj.potential_discount?.toString()}
                            onChange={(newVal) => { onPotentialDiscountChange(objIndex, newVal) }}
                            prefix="%"
                        />
                    </FormLayout.Group>


                    {(promotionObj.question_type == 'counter') ? (
                        <FormLayout.Group>
                            <TextField
                                label="Min Value"
                                type="number"
                                value={promotionObj.question_options.min?.toString()}
                                onChange={(minCounter) => { onMinCounterChange(minCounter, objIndex) }}
                                min={0}
                                max={100}
                            />
                            <TextField
                                label="Max Value"
                                type="number"
                                value={promotionObj.question_options.max?.toString()}
                                onChange={(maxCounter) => { onMaxCounterChange(maxCounter, objIndex) }}
                                min={0}
                                max={100}
                            />
                        </FormLayout.Group>
                    ) : (<></>)}


                    {/* for multiple choice option start  */}
                    {(promotionObj.question_type == 'multiple-choice') ? (
                        promotionObj.question_options.options.map((itemVal, option_index) => {
                            return (
                                <FormLayout.Group key={option_index}>
                                    <TextField
                                        type="text"
                                        value={itemVal.title}
                                        placeholder={"Options"}
                                        onChange={(newTitle) => { onOptionsTitleChange(newTitle, objIndex, option_index) }}
                                    />
                                    <TextField
                                        type="number"
                                        value={itemVal.discount?.toString()}
                                        placeholder={"Discount %"}
                                        connectedRight={<Button onClick={() => { onDeleteOptionsButtonClick(objIndex, option_index) }}>X</Button>}
                                        suffix="%"
                                        onChange={(discountVal) => { onOptionsDiscountChange(discountVal, objIndex, option_index) }}
                                    />
                                </FormLayout.Group>
                            )
                        })
                    ) : (<></>)}


                    {(promotionObj.question_type == 'multiple-choice') ? (
                        <FormLayout.Group>
                            <Button plain onClick={() => { onAddMoreOptions(objIndex) }}>Add more option</Button>
                        </FormLayout.Group>
                    ) : (<></>)}
                    {/* for multiple choice option end  */}


                    {/* For checkbox field  */}
                    {(promotionObj.question_type == 'checkbox') ? (
                        promotionObj.question_options.options.map((itemVal, option_index) => {
                            return (
                                <FormLayout.Group key={option_index}>
                                    <TextField
                                        type="text"
                                        value={itemVal.title}
                                        placeholder={"Options"}
                                        onChange={(newTitle) => { onOptionsTitleChange(newTitle, objIndex, option_index) }}
                                    />
                                    <TextField
                                        type="number"
                                        value={itemVal.discount?.toString()}
                                        placeholder={"Discount %"}
                                        connectedRight={<Button onClick={() => { onDeleteOptionsButtonClick(objIndex, option_index) }}>X</Button>}
                                        suffix="%"
                                        onChange={(discountVal) => { onOptionsDiscountChange(discountVal, objIndex, option_index) }}
                                    />
                                </FormLayout.Group>
                            )
                        })
                    ) : (<></>)}

                    {(promotionObj.question_type == 'checkbox') ? (
                        <FormLayout.Group>
                            <Button plain onClick={() => { onAddMoreOptions(objIndex) }}>Add more option</Button>
                        </FormLayout.Group>
                    ) : (<></>)}
                    {/* checkbox field ends here  */}

                    {(promotionObj.question_type == 'range') ? (
                        <FormLayout.Group>
                            <TextField
                                label="Min Range"
                                type="number"
                                value={promotionObj.question_options.min?.toString()}
                                onChange={(minRange) => { onMinRangeChange(minRange, objIndex) }}
                                min={0}
                                max={100}
                            />
                            <TextField
                                label="Max Range"
                                type="number"
                                value={promotionObj.question_options.max?.toString()}
                                onChange={(maxRange) => { onMaxRangeChange(maxRange, objIndex) }}
                                min={0}
                                max={100}
                            />
                        </FormLayout.Group>
                    ) : (<></>)}

                </FormLayout>
            </Card >
        )
    }


    const addNewQuestion = () => {
        let deaultQuestionObj = {
            question_title: '',
            question_type: 'counter',
            dropdown_val: 'Counter',
            potential_discount: '0',
            question_options: {
                min: '0',
                max: '1'
            }
        }
        setQuestionArray([...questionArray, deaultQuestionObj]);
    }

    // for queston title change event
    const onQuestionTitleChange = (q_index, questionTitle) => {

        let questionObj = questionArray[q_index];
        questionObj.question_title = questionTitle;

        let arrayVal = [...questionArray];
        arrayVal[q_index] = questionObj
        setQuestionArray(arrayVal);
    }

    // for potential discount change
    const onPotentialDiscountChange = (q_index, potentialDiscount) => {

        let questionObj = questionArray[q_index];
        questionObj.potential_discount = potentialDiscount;

        let arrayVal = [...questionArray];
        arrayVal[q_index] = questionObj
        setQuestionArray(arrayVal);
    }

    const onAddMoreOptions = (q_index) => {
        let questionObj = questionArray[q_index];

        if (questionObj.question_type == 'multiple-choice') {
            questionObj.question_options['options'].push({
                title: '',
                discount: '0'
            })
        } else if (questionObj.question_type == 'checkbox') {
            questionObj.question_options['options'].push({
                title: '',
                discount: '0'
            })
        }

        let arrayVal = [...questionArray];
        arrayVal[q_index] = questionObj;
        setQuestionArray(arrayVal);
    }

    // for question type change event
    const onQuestionTypeChange = (OptionVal, q_index) => {
        // 'counter', 'multiple-choice', 'checkbox', 'range'
        let questionObj = questionArray[q_index];

        // 'Counter', 'Multiple Choice', 'Checkbox', 'Range'
        if (OptionVal == 'Counter') {
            questionObj.question_type = 'counter';
            questionObj.dropdown_val = 'Counter';
            questionObj.question_options = {
                min: '0',
                max: '1'
            }
        } else if (OptionVal == 'Multiple Choice') {
            questionObj.question_type = 'multiple-choice';
            questionObj.dropdown_val = 'Multiple Choice';
            questionObj.question_options['options'] = [{
                title: '',
                discount: ''
            }]
        } else if (OptionVal == 'Checkbox') {
            questionObj.question_type = 'checkbox';
            questionObj.dropdown_val = 'Checkbox';
            questionObj.question_options['options'] = [{
                title: '',
                discount: ''
            }]
        } else if (OptionVal == 'Range') {
            questionObj.question_type = 'range';
            questionObj.dropdown_val = 'Range';
            questionObj.question_options = {
                min: '0',
                max: '1'
            }
        }

        let arrayVal = [...questionArray];
        arrayVal[q_index] = questionObj;

        setQuestionArray(arrayVal);
    }

    // for delete question change
    const onDeleteQuestionButtonClick = (q_index) => {
        let questionObj = [...questionArray];
        questionObj.splice(q_index, 1);
        setQuestionArray(questionObj);
    }

    const onDeleteOptionsButtonClick = (q_index, optionLevelIndex) => {
        let questionObj = questionArray[q_index];
        let optionsObj = questionObj.question_options.options;
        optionsObj.splice(optionLevelIndex, 1);

        let finalOptions = [...questionArray];
        finalOptions[q_index].question_options.options = optionsObj;
        setQuestionArray(finalOptions);
    }

    return (
        <>
            <Layout.AnnotatedSection
                title='Maximum Potential Discount'
                description="This # represents the maximum discount that will be accepted for products in this grouping which satisfy all the criteria below"
            >
                <Card sectioned>
                    <FormLayout>
                        <TextField
                            label="Max Potential Discount"
                            type="number"
                            value={props.maximumPotentialDiscount?.toString()}
                            onChange={(newVal) => { props.onMaximumPotentialDiscountChange(newVal) }}
                            prefix="%"
                        />
                    </FormLayout>
                </Card>
            </Layout.AnnotatedSection>

            <Layout.AnnotatedSection
                title='Set up Questions'
                description="Select questions and assign a discount % for each criteria, the sum of discounts for each question represents the maximum discount for this grouping, and this number auto-populates above."
            >

                {
                    questionArray.map((promotionObj, objIndex) => QuestionMiniBlock(promotionObj, objIndex))
                }

                <Card sectioned>
                    <div style={{ color: '#6fb09b', textAlign: 'center' }} >
                        <Button monochrome outline icon={CirclePlusMinor} onClick={() => { addNewQuestion() }}>
                            NEW QUESTION
                        </Button>
                    </div>
                </Card>

            </Layout.AnnotatedSection>

            <br></br>

            <PageActions
                primaryAction={[
                    {
                        content: 'Save and Update',
                        onAction: (() => { props.onSettingSaveAction() }),
                        loading: props.saveButtonLoader
                    }
                ]}
            />
        </>
    )
}

export default QuestionBlocks;