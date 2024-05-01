import React from 'react';
import { Accordion, Text, Box } from '@chakra-ui/react';
import FAQItem from './FAQItem';

const FAQ = () => {

  const data1 = [
    {
      question: "What is Office(H)ours?",
      answer: "Office hours management app for maximizing user experience."
    },
    {
      question: "What does the (H) mean?",
      answer: "This is a reference to asymptotic notation i.e. O(N)."
    },
    {
      question: "Who runs Office(H)ours?",
      answer: "Created by Nikhil, Haroon, and Vinh for a CS final project."
    },
    {
      question: "What is the history of Office(H)ours?",
      answer: "3 students. 1 goal. Better office hours."
    }
  ];

  const data2 = [
    {
      question: "Who can use O(H)?",
      answer: "Students! TAs! Professors!"
    },
    {
      question: "How do I use O(H)?",
      answer: "Add classes and view on calendar. Easy and simple!"
    }
  ];

  return (
    <Box m={10}>
      <Text mb={10} textColor="#063763" textAlign="center" fontWeight="bold" fontSize="4xl">Frequently Asked Questions</Text>
      <Text fontSize={28} fontWeight="semibold" mb={4}>About Us</Text>
      <Accordion allowToggle>
        {data1.map((faq, index) => (
          <FAQItem key={index} title={faq.question} content={faq.answer} />
        ))}
      </Accordion>

      <Text fontSize={28} fontWeight="semibold" mt={10} mb={4}>Using Office(H)ours</Text>
      <Accordion allowToggle>
        {data2.map((faq, index) => (
          <FAQItem key={index} title={faq.question} content={faq.answer} />
        ))}
      </Accordion>
    </Box>
  );
};

export default FAQ;
