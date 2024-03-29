import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Spacer
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const AddClass = ({ handleAddClass }) => {
    const [addedClass, setAddedClass] = useState(""); 

    const handleUserAddClass = (event) => {
        event.preventDefault();
        handleAddClass(addedClass);
        setAddedClass("");
    }

    return (
        <Box            
            p={4}
            // ml={{ lg: 10 }}
            mt={{ base: 6, lg: 0 }}
            borderWidth="2px"
            borderRadius="lg"
            borderColor="#4073AF"
            w={{ base: 'full', lg: 'sm' }}
            h={500}
            bg="#F3F8FF"
            boxShadow="lg"
            flex="1"
        >
            <VStack as="form" onSubmit={handleUserAddClass} align="stretch" spacing={4} p={4} h={475}>
                <InputGroup borderWidth="1px" borderRadius="md" bg="white">
                    <InputLeftElement pointerEvents="none">
                        <FaSearch size="20" color="black" />
                    </InputLeftElement>
                    <Input 
                        type="text" 
                        placeholder="search for a class e.g. CPSC 419"
                        value={addedClass}
                        onChange={(event) => setAddedClass(event.target.value)} 
                    />
                </InputGroup>

                <Spacer />
                {/* <Text>temporary: {addedClass}</Text> */}
                {/* dropdown list could go here */}

                <Button 
                    backgroundColor="#063763"
                    _hover={{ opacity: '70%' }}
                    textColor="white"
                    type='submit'
                    minWidth={150}
                    alignSelf="center"
                >
                    Add Class
                </Button>

            </VStack>
        </Box>
    )
}

export default AddClass;