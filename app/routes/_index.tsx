import { useLoaderData, Link } from "@remix-run/react";
import { useState } from "react";
import { fetchData } from "../utils/graphqlClient";
import "../styles/Location.css";

type Location = {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: { id: number; name: string; image: string }[];
};

type LoaderData = {
  locations: {
    results: Location[];
  };
};

export const loader = async () => {
  const query = `{
    locations {
      results {
        id
        name
        type
        dimension
        residents {
          id
          name
          image
        }
      }
    }
  }`;
  return fetchData(query);
};

export default function Index() {
  const data: LoaderData = useLoaderData();
  const locations = data.locations.results;

  const [typeFilter, setTypeFilter] = useState<string>('');
  const [dimensionFilter, setDimensionFilter] = useState<string>('');

  const filteredLocations = locations.filter(location =>
    (typeFilter ? location.type.toLowerCase().includes(typeFilter.toLowerCase()) : true) &&
    (dimensionFilter ? location.dimension.toLowerCase().includes(dimensionFilter.toLowerCase()) : true)
  );

  return (
    <div style={{ padding: 20, minWidth: 300 }}>
      <h1>Locations</h1>
      <div className="filter-section">
        <label htmlFor="typeFilter">Filter by Type:</label>
        <input
          id="typeFilter"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          placeholder="Type"
          className="filter-input"
        />

        <label htmlFor="dimensionFilter">Filter by Dimension:</label>
        <input
          id="dimensionFilter"
          value={dimensionFilter}
          onChange={e => setDimensionFilter(e.target.value)}
          placeholder="Dimension"
          className="filter-input"
        />
      </div>

      <div className="locations-grid">
        {filteredLocations.length > 0 ? (
          filteredLocations.map(location => (
            <div key={location.id} className="location-item">
              <Link to={`/locations/${location.id}`}>
                <h2>{location.name}</h2>
              </Link>
              <p>Type: {location.type}</p>
              <p>Dimension: {location.dimension}</p>
              <p>Residents: {location.residents.length}</p>
            </div>
          ))
        ) : (
          <div>
            <p>No locations found matching the filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
