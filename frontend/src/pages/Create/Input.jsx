import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import { Field } from 'formik';

export const ClassInput = ({name, label, placeholder, validate, inputStyle, type, ...styles}) => {
    return (
        <Field name={name} validate={(value) => validate(label, value)}>
            {({ field, form }) => (
                <FormControl isInvalid={form.errors[name] && form.touched[name]} mt={2} {...styles}>
                    <FormLabel>{label}</FormLabel>
                    <Input type={type} {...field} placeholder={placeholder} style={inputStyle} />
                    <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                </FormControl>
            )}
        </Field>
    )
}