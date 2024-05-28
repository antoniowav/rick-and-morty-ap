import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import ResidentCard from '../components/ResidentCard/ResidentCard';
import '../styles/Location.css';

interface Resident {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface Location {
  name: string;
  type: string;
  dimension: string;
  residents: Resident[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const { locationId } = params;

  try {
    const response = await fetch(`https://rickandmortyapi.com/api/location/${locationId}`);

    if (!response.ok) {
      throw new Response('Not Found', { status: 404 });
    }

    const locationData = await response.json();

    const residents = await Promise.all(
      locationData.residents.map(async (url: string) => {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch resident data');
        }
        return res.json();
      })
    );

    const location: Location = {
      name: locationData.name,
      type: locationData.type,
      dimension: locationData.dimension,
      residents: residents.map((resident: Resident) => ({
        id: resident.id,
        name: resident.name,
        status: resident.status,
        species: resident.species,
        gender: resident.gender,
        image: resident.image
      })),
    };

    return json(location);
  } catch (error) {
    console.error('Failed to load location data:', error);
    throw error;
  }
};

export default function LocationDetail() {
  const location = useLoaderData<Location>();

  const filteredResidents = location.residents
  console.log(filteredResidents);


  const stats = {
    alive: filteredResidents.filter(resident => resident.status === 'Alive').length,
    dead: filteredResidents.filter(resident => resident.status === 'Dead').length,
    guests: filteredResidents.filter(resident => resident.status !== 'Alive' && resident.status !== 'Dead').length,
    robots: filteredResidents.filter(resident => resident.species === 'Robot').length,
    aliens: filteredResidents.filter(resident => resident.species === 'Alien').length,
    humans: filteredResidents.filter(resident => resident.species === 'Human').length
  };

  console.log(location);


  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Link to="/" className="back-link">Back to home</Link>
      <h1>{location.name}</h1>

      <p>Type: {location.type}</p>
      {location.dimension !== 'unknown' ? <p>Dimension: {location.dimension}</p> : null}
      <p>Residents: {filteredResidents.length}</p>

      <div className="stats-section">
        <h3>Statistics:</h3>
        <p>Number of Alive Residents: {stats.alive}</p>
        <p>Number of Dead Residents: {stats.dead}</p>
        <p>Number of Current Guests: {stats.guests}</p>
        <p>Number of Robots: {stats.robots}</p>
        <p>Number of Aliens: {stats.aliens}</p>
        <p>Number of Humans: {stats.humans}</p>
      </div>

      <div className="residents-grid">
        {filteredResidents.map(resident => (
          <ResidentCard key={resident.id} resident={resident} />
        ))}
      </div>
    </div>
  );
}
