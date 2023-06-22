import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  ChakraProvider,
  SimpleGrid,
  Text,
  VStack,
  extendTheme,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const App = () => {
  const themeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  };

  const theme = extendTheme({ themeConfig });

  const [victor, setVictor] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const [clicked, setClicked] = useState({
    clickedOne: null,
    clickedTwo: null,
    clickedThree: null,
    clickedFour: null,
    clickedFive: null,
    clickedSix: null,
    clickedSeven: null,
    clickedEight: null,
    clickedNine: null,
  });

  const clickHandler = e => {
    let button = e.target;

    // if victor has been set make sure the entire board is uninteractive
    // or if victor has not been set make sure every plot with set id (which means it's been selected by a player) is uninteractive
    if (victor || clicked[button.id] !== null) {
      return;
    }

    setClicked(prev => ({ ...prev, [button.id]: currentPlayer }));
    setCurrentPlayer(prev => (prev === 'O' ? 'X' : 'O'));
  };

  const resetHandler = () => {
    setVictor('');
    setCurrentPlayer('X');
    setClicked({
      clickedOne: null,
      clickedTwo: null,
      clickedThree: null,
      clickedFour: null,
      clickedFive: null,
      clickedSix: null,
      clickedSeven: null,
      clickedEight: null,
      clickedNine: null,
    });
  };

  useEffect(() => {
    // objectStatus is an array containing all values of clicked object
    let objectStatus = Object.values(clicked);

    // tempArrOne and tempArrTwo are used to convert the values to a 2D Array
    // afterwards that array is used to determine the situation of the board
    let tempArrOne = [];
    let tempArrTwo = [];

    //this for loop converts the value to a 2D Array
    for (let i = 0; i < objectStatus.length; i++) {
      switch (i) {
        case 2:
          tempArrTwo.push(objectStatus[i]);
          tempArrOne.push(tempArrTwo);
          tempArrTwo = [];
          break;
        case 5:
          tempArrTwo.push(objectStatus[i]);
          tempArrOne.push(tempArrTwo);
          tempArrTwo = [];
          break;
        case 8:
          tempArrTwo.push(objectStatus[i]);
          tempArrOne.push(tempArrTwo);
          tempArrTwo = [];
          break;
        //read the loop from default first
        default:
          tempArrTwo.push(objectStatus[i]);
          break;
      }
    }

    // this for loop determines the situation of the game
    for (let i = 0; i < tempArrOne.length; i++) {
      // this if statement checks the vertical array
      // basically checks if:
      // [x, ?, ?]
      // [x, ?, ?]
      // [x, ?, ?]
      // or any vertical situations like that returns true
      if (
        tempArrOne[0][i] === tempArrOne[1][i] &&
        tempArrOne[0][i] === tempArrOne[2][i] &&
        tempArrOne[0][i] !== null
      ) {
        setVictor(tempArrOne[0][i]);
      }

      // this if statement checks the horizontal array
      // basically checks if:
      // [?, ?, ?]
      // [x, x, x]
      // [?, ?, ?]
      // or any horizontal situations like that returns true
      if (
        tempArrOne[i].every(val => val === tempArrOne[i][0]) &&
        !tempArrOne[i].includes(null)
      ) {
        setVictor(tempArrOne[i][0]);
      }
    }

    // this if statement checks the diagonal array
    // basically checks if:
    // [x, ?, ?]
    // [?, x, ?]
    // [?, ?, x]
    // or any diagonal situations like that returns true
    if (
      tempArrOne[0][0] === tempArrOne[1][1] &&
      tempArrOne[0][0] === tempArrOne[2][2] &&
      tempArrOne[0][0] !== null
    ) {
      setVictor(tempArrOne[0][0]);
    }

    if (
      tempArrOne[0][2] === tempArrOne[1][1] &&
      tempArrOne[0][2] === tempArrOne[2][0] &&
      tempArrOne[0][2] !== null
    ) {
      setVictor(tempArrOne[0][2]);
    }

    // check if every board has been selected
    // if it reaches here and it returns true
    // then that means there is no winner and it results in draw
    if (objectStatus.every(v => v !== null)) {
      setVictor('Draw');
      return;
    }
  }, [clicked]);

  return (
    <ChakraProvider theme={theme}>
      <Box
        w="calc(100vw)"
        h="calc(100vh)"
        cursor="default"
        style={{ userSelect: 'none' }}
      >
        <AbsoluteCenter>
          <VStack spacing={2}>
            <Card>
              <CardHeader>
                {/* header */}
                {victor ? (
                  victor !== 'Draw' ? (
                    <Card
                      cursor="default"
                      style={{ userSelect: 'none' }}
                      bgColor="green"
                    >
                      <CardBody>
                        <Center>{victor} is victorious!!!</Center>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card
                      cursor="default"
                      style={{ userSelect: 'none' }}
                      bgColor="green"
                    >
                      <CardBody>
                        <Center>It's a draw!!!</Center>
                      </CardBody>
                    </Card>
                  )
                ) : (
                  <Card
                    cursor="default"
                    style={{ userSelect: 'none' }}
                    bgColor="green"
                  >
                    <CardBody>
                      <Center>It's {currentPlayer} turn</Center>
                    </CardBody>
                  </Card>
                )}
              </CardHeader>
              <CardBody>
                {/* board */}
                <SimpleGrid columns={3} spacing={1}>
                  {Object.entries(clicked).map(item => {
                    return (
                      <Box
                        bg={item[1] ? 'white' : 'tomato'}
                        height="80px"
                        width="80px"
                        key={item[0]}
                        id={item[0]}
                        onClick={e => clickHandler(e)}
                        alignContent="center"
                        textAlign="center"
                      >
                        <Center>
                          <Text color="red" marginTop={5} fontWeight="bold">
                            {item[1]}
                          </Text>
                        </Center>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </CardBody>
              <CardFooter>
                {/* reset button */}
                <Button
                  cursor="default"
                  style={{ userSelect: 'none' }}
                  colorScheme="orange"
                  onClick={resetHandler}
                  w="100%"
                >
                  Reset
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardBody>
                <Center>
                  <Text>Press to Change Dark Mode &#8594;</Text>
                  <ColorModeSwitcher />
                </Center>
              </CardBody>
            </Card>
          </VStack>
        </AbsoluteCenter>
      </Box>
    </ChakraProvider>
  );
};

export default App;
