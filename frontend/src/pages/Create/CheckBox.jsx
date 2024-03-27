import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    CheckboxGroup,
    Stack,
    Checkbox
} from '@chakra-ui/react'
import { Field } from 'formik';

export const ClassCheckBox = ({name, label, values, validate, inputStyle, ...styles}) => {
    return (
        <Field name={name} validate={(value) => validate(label, value)}>
            {({ field, form }) => (
                <FormControl isInvalid={form.errors[name] && form.touched[name]} mt={4} {...styles}>
                    <FormLabel>{label}</FormLabel>
                    <CheckboxGroup colorScheme='blue' defaultValue={[]}>
                        <Stack spacing={[1, 5]} direction={['column', 'row']}>
                            {values.map((value, index) => <Checkbox key={index} {...field} value={value.toLowerCase()} style={inputStyle}>{value}</Checkbox>)}
                        </Stack>
                    </CheckboxGroup>
                    <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                </FormControl>
            )}
        </Field>
    )
}