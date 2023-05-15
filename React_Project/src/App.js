import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {
  Container,
  createTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Select from 'react-select';


import RecList from './components/RecommendationsList';

function App() {
  const [list, setList] = useState(null);
  const [smovie, setSmovie] = useState(null);
  const [rec, setRec] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get('https://moviebuzz-backend.fly.dev/movies')
        .then((r) => setList(JSON.parse(r.data)));
    }
    fetchData();
  }, []);

  async function fetchMovie(props) {
    await axios
      .post('https://moviebuzz-backend.fly.dev/get-recommendations', {
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        id: props[0].toString(),
        tconst: props[1],
      })
      .then((r) => {
        setRec(null);
        setRec(JSON.parse(r.data));
      });
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const options = list?.allm.map((props) =>
    // Ideally you can change the value to something different that is easier to keep track of like the UTC offset
    ({
      value: props.slice(0, 2),
      label: props[2],
    }));
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth));
  }, []);
  const styles = {
    menuList: (base) => ({
      ...base,

      '::-webkit-scrollbar': {
        width: '0',
        height: '0',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#888',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
    }),
  };
  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);
  const myRef = useRef(null);
  const executeScroll = () => scrollToRef(myRef);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div
        style={{
          background: 'black',
          paddingBottom: '5rem',
          marginBottom: '2rem',
        }}
      >
        <Container>
          <Typography
            component="h5"
            variant="h5"
            style={{
              paddingTop: 0,
              paddingBottom: '2rem',
              fontFamily: 'Copse',
            }}
          >
            Movie Recommendation System
          </Typography>
        </Container>
        <Container>
          <Typography component="h6" variant="body1">
            Search for movies
          </Typography>
          {list ? (
            <Select
              // menuIsOpen
              styles={styles}
              maxMenuHeight={200}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
                ScrollBar: () => null,
              }}
              options={options}
              placeholder="Search"
              onChange={(props) => {
                fetchMovie(props.value).then(() => {
                  setSmovie(null);
                  setSmovie(props.value);
                });
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#FFFF00',
                  primary25: '#FFFF00EE',
                  primary50: '#FFFF00',
                  neutral0: 'black',
                  neutral80: '#FFFF008A',
                },
              })}
            />
          ) : (
            <Select />
          )}
        </Container>
      </div>

     
      {rec ? (
        <Container className="all-cont" style={{ paddingBottom: '6rem' }}>
          <div className="header2">
            <Typography component="h1" variant="h4">
              Recommendations For You
            </Typography>
            <div className="break" />
          </div>
          <div>
            {rec && (
              <Grid justify="center" container spacing={5}>
                {rec?.map((data) => (
                  <Grid
                    item
                    xs={6}
                    sm={2.4}
                    md={2.4}
                    onClick={() => fetchMovie(data).then(() => {
                      setSmovie(null);
                      setSmovie(data);
                      executeScroll();
                    })}
                  >
                    <RecList movie={data} />
                  </Grid>
                ))}
              </Grid>
            )}
          </div>
        </Container>
      ) : (
        <div />
      )}
     
    </ThemeProvider>
  );
}
export default App;
