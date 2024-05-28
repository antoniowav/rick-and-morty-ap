/* eslint-disable react/prop-types */
import "./ResidentCard.css";

interface ResidentCardProps {
    resident: {
        id: number;
        name: string;
        status: string;
        species: string;
        gender: string;
        image: string;
    };
}

const ResidentCard: React.FC<ResidentCardProps> = ({ resident }) => {
    return (
        <div className="resident-card">
            <img src={resident.image} alt={resident.name} className="resident-image" />
            <div className="resident-info">
                <h2>{resident.name}</h2>
                <p>Status: {resident.status}</p>
                <p>Species: {resident.species}</p>
                <p>Gender: {resident.gender}</p>
            </div>
        </div>
    );
};

export default ResidentCard;
