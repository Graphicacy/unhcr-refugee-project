import { useCallback, useState, useLayoutEffect } from 'react';
import debounce from 'lodash.debounce';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';
import kebabCase from 'lodash.kebabcase';
import { ALL_YEARS, YEARS } from './constants';
import { sum } from 'd3-array';

export const cityToId = (city) => kebabCase(city);
const getCalendarYear = (year) => `CY ${year}`;
export const getValue = (d, selectedYear) =>
  selectedYear !== ALL_YEARS ? +d[getCalendarYear(selectedYear)] : sum(YEARS, (x) => +d[getCalendarYear(x)]);

function getDimensionObject(node) {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: 'x' in rect ? rect.x : rect.top,
    left: 'y' in rect ? rect.y : rect.left,
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

export const useDimensions = (initialDimensions) => {
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [node, setNode] = useState(null);

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = debounce(
        () => window.requestAnimationFrame(() => setDimensions({ ...getDimensionObject(node), isResized: true })),
        250,
      );
      measure();

      window.addEventListener('resize', measure);

      return () => {
        window.removeEventListener('resize', measure);
      };
    }
  }, [node]);

  return [ref, dimensions, node];
};

// Generic reusable hook
export const useDebouncedSearch = (searchFunction) => {
  // Handle the input text state
  const [inputText, setInputText] = useState('');

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() => AwesomeDebouncePromise(searchFunction, 300));

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return [];
    } else {
      return debouncedSearchFunction(inputText);
    }
  }, [debouncedSearchFunction, inputText]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};
