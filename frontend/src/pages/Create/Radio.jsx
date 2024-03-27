import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    RadioGroup,
    Radio,
    Stack,
    VStack,
    Grid
} from '@chakra-ui/react'
import { Field } from 'formik';

export const ClassRadio = ({name, label, values, validate, ...styles}) => {
    return (
        <Field name={name} validate={(value) => validate(label, value)}>
            {({ field, form }) => (
                <FormControl isInvalid={form.errors[name] && form.touched[name]} mt={4} {...styles}>
                    <FormLabel>{label}</FormLabel>
                    <RadioGroup colorScheme='blue' defaultValue={[]}>
                        <Grid templateColumns='repeat(3, 1fr)' gap={1} direction={['column', 'row']}>
                            {values.map((value, index) => <Radio key={index} {...field} value={value.toLowerCase()} >{value}</Radio>)}
                        </Grid>
                    </RadioGroup>
                    <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
                </FormControl>
            )}
        </Field>
    )
}