import React, { useState, useRef } from "react";
import {
  Flex,
  Box,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Spacer,
  List,
  ListItem
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const AddClass = ({ handleAddClass, allClasses }) => {
    const inputRef = useRef(null);
    const [addedClass, setAddedClass] = useState("");
    const [filteredClasses, setFilteredClasses] = useState("");

    const handleUserAddClass = (event) => {
        event.preventDefault();
        handleAddClass(addedClass);
        setAddedClass("");
    }

    const updateFilteredClasses = (input) => {
        setAddedClass(input);
        const inputLowerCase = input.toLowerCase();
        const filtered = allClasses.filter(cls => (`${cls.name} ${cls.abbr}`).toLowerCase().includes(inputLowerCase));
        setFilteredClasses(filtered);
    };

    // puts the clicked selection in the search bar
    const handleClassSelection = (classId) => {
        // handleAddClass(classId); // this would do post request on click, don't want?
        setAddedClass(classId);
        setFilteredClasses([]);

        if (inputRef.current) // brings focus back to input upon click
            inputRef.current.focus();

      };

    return (
        <Box            
            p={4}
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
                        ref={inputRef}
                        type="text" 
                        placeholder="search for a class e.g. CPSC 419"
                        value={addedClass}
                        onChange={(event) => updateFilteredClasses(event.target.value)} 
                    />
                </InputGroup>

                <List spacing={2} maxHeight="310px" borderRadius="md" overflowY="auto" backgroundColor="white">
                    {filteredClasses && filteredClasses.map((cls, index) => (
                        <ListItem 
                            key={index} p={2} cursor="pointer" _hover={{ bg: '#BFDCFF' }} 
                            onClick={() => handleClassSelection(cls.abbr)}
                        >
                        <Flex direction="column">
                            <Text fontWeight="semibold">{cls.abbr}</Text>
                            <Text opacity="70%">{cls.name}</Text>
                            
                        </Flex>
                            
                        </ListItem>
                    ))}
                </List>

                <Spacer />

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