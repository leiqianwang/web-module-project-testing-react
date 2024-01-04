import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {fetchShow as mockFetchShow} from '../api/fetchShow';
import Show from './../Show';
import Loading from './Loading';
import Episodes from './Episodes';

jest.mock('../api/fetchShow');

const showData = {
    name: "Example Show",
    summary: "This is a summary of the Example Show.",
    seasons: [
      { id: 1, name: "Season 1", episodes: [] },
      // ... other seasons 
        {id : 2, name: "Season 2", episodes: [] },
    ]
  };
      console.log(showData);

  beforeEach(() => {
    mockFetchShow.mockClear();
  });
  

test('renders without errors', async () => {
   
     mockFetchShow.mockResolvedValueOnce(showData);
     render(<Show show={showData}  selectedSeason="none" />);
     
     expect(await screen.findByText(showData.name)).toBeInTheDocument();
     expect(screen.getAllByAltTextId('screen-option')).toHaveLength(showData.seasons.length);

});

test('renders Loading component when prop show is null', () => {
    render(<Show show={null} selectedSeason="none" />);

    expect(screen.getByText(/Fetching data.../i)).toBeInTheDocument();
});

test('renders same number of options seasons are passed in', () => {

    render(<Show show={showData} selectedSeason="none" />);
    expect(screen.getAllByTestId('season-option')).toHaveLength(showData.seasons.length);
    expect(screen.findAllByTestId('seasons')).toBeCalledWith();
  });


test('handleSelect is called when an season is selected', () => { 
    const handleSelect = jest.fn();
    render(<Show show={showData} selectedSeason="none" handleSelect={handleSelect} />);
  
     fireEvent.change(screen.getByLabelText(/Select A Season/i), { target: {value: showData.seasons[0].id } });
    //fireEvent.change(screen.getByLabelText(/Select A Season/i), { target: { value: showData.seasons[0].id } });
    expect(handleSelect).toHaveBeenCalled();
});

test('component renders when no seasons are selected and when rerenders with a season passed in', () => {
    const { rerender } = render(<Show show={showData} selectedSeason="none" />);
    expect(screen.queryByTestId('episodes-container')).toBeNull();

    rerender(<Show show={showData} selectedSeason={0} />);
  expect(screen.getByTestId('episodes-container')).toBeInTheDocument();

 });


