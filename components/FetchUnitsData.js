import { useState, useEffect } from 'react';
import { db } from '../firebase';

const useFetchUnitsData = (armyId) => {
    const [isLoading, setIsLoading] = useState(true);
    const [unitsData, setUnitsData] = useState([]);
    const [error, setError] = useState(null);
    console.log(armyId, "((((((((((((((((((((((((((((((((")

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const armySnapshot = await db.collection('Armies').doc(armyId).get();
                const armyData = armySnapshot.data();
                console.log('armyData', armyData);

                if(armyData){
                    const squads = armyData.units;
                    setUnitsData(squads);
                    setIsLoading(false);
                }else{
                    setIsLoading(false);
                    throw new Error("No data found for this armyId.");
                }
            } catch (err) {
                console.error('Error while fetching units:', err);
                setError(err);
                setIsLoading(false);
            }
        };
        fetchUnits();
    }, [armyId]);

    console.log(unitsData,"__________________________)())")

    return { isLoading, unitsData, error };
};

export default useFetchUnitsData;
