import './App.css'
import { useEffect, useState } from 'react'
import parseMilliseconds from 'parse-ms'
import SingleValueStat from './components/SingleValueStat'
import MultiValueStat from './components/MultiValueStat'

export default function App() {
  const [flights, setFlights] = useState([])

  useEffect(() => {
    fetch('https://stantarnev.github.io/data/flight_data.json')
    .then(response => response.json())
    .then(data => setFlights(data.flight))
  }, [])

  function countMorningFlights() {
    return flights.filter(flight => flight['outdeparttime'] < '12').length
  }

  function getSwedenDestinationRatio() {
    const swedenIATAAirportCodes = ['AGH', 'AJR', 'ARN', 'BLE', 'BMA', 'EKT', 'EVG', 'GEV', 'GOT', 'GSE', 'GVX', 'HAD', 'HFS', 'HLF', 'HMV', 'HUV', 'IDB', 'JKG', 'KID', 'KLR', 'KRF', 'KRN', 'KSD', 'KSK', 'KVB', 'LDK', 'LLA', 'LPI', 'LYC', 'MMX', 'MXX', 'NRK', 'NYO', 'OER', 'ORB', 'OSD', 'OSK', 'PJA', 'RNB', 'SCR', 'SDL', 'SFT', 'SOO', 'SQO', 'THN', 'TYF', 'UME', 'VBY', 'VHM', 'VST', 'VVK', 'VXO']

    const swedenDestinationRatio = flights.filter(flight => swedenIATAAirportCodes.includes(flight['destair'])).length / flights.length * 100
    return `${swedenDestinationRatio.toFixed(2)}%`
  }

  function getTop10Airports() {
    const destinationFrequencies = []
    for (const flight of flights) {
      if (destinationFrequencies.length === 0) {
          destinationFrequencies.push({
                  "airportCode": flight["destair"],
                  "count": 1
          })
      } else {
          let existingAirportCode = false
          for (const item of destinationFrequencies) {
              if (item["airportCode"] === flight["destair"]) {
                  item["count"]++
                  existingAirportCode = true
                  break
              }
          }
          if (!existingAirportCode) {
              destinationFrequencies.push({
                  "airportCode": flight["destair"],
                  "count": 1
              })
          }
      }
    }
    return destinationFrequencies.sort((a, b) => b["count"] - a["count"]).slice(0, 10)
  }

  function getCurrenciesUsed() {
    const currencyFrequencies = []
    for (const flight of flights) {
      if (currencyFrequencies.length === 0) {
          currencyFrequencies.push({
                  "currency": flight["originalcurrency"],
                  "count": 1
          })
      } else {
          let existingCurrency = false
          for (const item of currencyFrequencies) {
              if (item["currency"] === flight["originalcurrency"]) {
                  item["count"]++
                  existingCurrency = true
                  break
              }
          }
          if (!existingCurrency) {
              currencyFrequencies.push({
                  "currency": flight["originalcurrency"],
                  "count": 1
              })
          }
      }
    }
    return currencyFrequencies.sort((a, b) => b["count"] - a["count"])
  }

  function getAveragePassengerJourney() {
    const LHRDXBJourneys = flights.filter(flight => flight['depair'] === 'LHR' && flight['destair'] === 'DXB')

    const journeyMillisecondDurations = LHRDXBJourneys.map(flight => {
        const arrival = new Date(`${flight.inarrivaldate}T${flight.inarrivaltime}`)
        const departure = new Date(`${flight.outdepartdate}T${flight.outdeparttime}`)
        return arrival.getTime() - departure.getTime()
    })

    const averageMillisecondDuration = journeyMillisecondDurations.reduce((total, duration) => {
      return total + duration
    }, 0) / journeyMillisecondDurations.length

    const parsedDuration = parseMilliseconds(averageMillisecondDuration)

    return `${parsedDuration.days} days, ${parsedDuration.hours} hours and ${parsedDuration.minutes} minutes`
  }

  return (
    <div className="App">
      <h1>Flight Data Stats</h1>
      <div id='stats'>
        <div className='stat-types'>
          <SingleValueStat
            title='Number of Flights Departing in the Morning'
            getStat={countMorningFlights}
          />
          <SingleValueStat
            title='Proportion of Flights to Sweden'
            getStat={getSwedenDestinationRatio}
          />
          <SingleValueStat
            title='Duration of Average Passenger Journey between London Heathrow and Dubai'
            getStat={getAveragePassengerJourney}
          />
        </div>
        <div className='stat-types'>
          <MultiValueStat
            title='IATA Codes for the 10 Most Popular Destination Airports'
            stat={getTop10Airports().map((airport, index) => <li key={index}>{airport.airportCode} - {airport.count} flights</li>)}
          />
          <MultiValueStat
            title='Currencies Used to Buy Tickets'
            stat={getCurrenciesUsed().map((currency, index) => <li key={index}>{currency.currency} - {currency.count} flights</li>)}
          />
        </div>
      </div>
    </div>
  )
}


