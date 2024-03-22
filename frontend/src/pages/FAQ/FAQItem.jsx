import React from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text
} from "@chakra-ui/react";

const FAQItem = ({ title, content }) => (
  <AccordionItem border="1px" borderColor="gray.200">
    <AccordionButton _expanded={{ bg: '#063763', color: 'white' }}>
      <Box flex="1" textAlign="left">
        <Text fontSize={20}>{title}</Text>
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>
    <Text fontSize={18}>{content}</Text>
    </AccordionPanel>
  </AccordionItem>
);

export default FAQItem;
