import { TextElement } from "./imageToText";

interface ParsedQuestion {
  question: string;
  options: string[];
}

export function parseQuestionFromOCR(elements: TextElement[]): ParsedQuestion {
  let question = "";
  const options: string[] = [];
  let currentOption = "";

  const optionPrefixes = [
    "(A)",
    "(B)",
    "(C)",
    "(D)",
    "(E)",
    "A.",
    "B.",
    "C.",
    "D.",
    "E.",
    "1.",
    "2.",
    "3.",
    "4.",
    "5.",
    "A)",
    "B)",
    "C)",
    "D)",
    "E)",
    "(A",
    "(B",
    "(C",
    "(D",
    "(E",
  ];

  let isInOptions = false;

  elements.forEach((element) => {
    const trimmedText = element.text.trim();
    if (optionPrefixes.some((prefix) => trimmedText.startsWith(prefix))) {
      if (currentOption) {
        options.push(currentOption.trim());
      }
      isInOptions = true;
      currentOption = trimmedText;
    } else if (isInOptions) {
      currentOption += " " + trimmedText;
    } else {
      question += " " + trimmedText;
    }
  });

  if (currentOption) {
    options.push(currentOption.trim());
  }

  return {
    question: question.trim(),
    options: options,
  };
}
